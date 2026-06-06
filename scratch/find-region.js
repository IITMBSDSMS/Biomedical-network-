const https = require('https');

const targetIp = '2406:da12:5ca:b702:7a3c:b06d:3a9d:9d10';

function expandIPv6(ip) {
  let cleanIp = ip;
  if (ip.includes('::')) {
    const parts = ip.split('::');
    const left = parts[0].split(':').filter(x => x !== '');
    const right = parts[1] ? parts[1].split(':').filter(x => x !== '') : [];
    const missing = 8 - (left.length + right.length);
    const middle = Array(missing).fill('0');
    return [...left, ...middle, ...right].map(x => x.padStart(4, '0')).join(':');
  }
  return ip.split(':').map(x => x.padStart(4, '0')).join(':');
}

function ip6ToBigInt(ip) {
  const expanded = expandIPv6(ip);
  const hex = expanded.replace(/:/g, '');
  return BigInt('0x' + hex);
}

function matchesPrefix(ip, prefix, length) {
  const ipInt = ip6ToBigInt(ip);
  const prefixInt = ip6ToBigInt(prefix);
  const mask = (1n << 128n) - (1n << BigInt(128 - length));
  return (ipInt & mask) === (prefixInt & mask);
}

https.get('https://ip-ranges.amazonaws.com/ip-ranges.json', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const matches = [];
      for (const item of data.ipv6_prefixes) {
        const [prefix, lenStr] = item.ipv6_prefix.split('/');
        const len = parseInt(lenStr, 10);
        if (matchesPrefix(targetIp, prefix, len)) {
          matches.push(item);
        }
      }
      console.log('Matches:', JSON.stringify(matches, null, 2));
    } catch (err) {
      console.error(err);
    }
  });
}).on('error', console.error);
