"use client";

import React from "react";

interface CertificateProps {
  fullName: string;
  certHash: string;
  issuedAt: string;
}

export function CertificatePreview({ fullName, certHash, issuedAt }: CertificateProps) {
  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "https://healix-biolabs.com";
  const verifyUrl = `${origin}/training/verify?hash=${certHash}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1a2744&bgcolor=ffffff&data=${encodeURIComponent(verifyUrl)}`;
  const logoUrl = `${origin}/logo.png`;

  return (
    <div
      style={{
        width: "1122px",
        height: "793px",
        background: "#FFFFFF",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Load Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;550;600;700&display=swap"
        rel="stylesheet"
      />

      {/* SVG corner waves and backgrounds */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
        viewBox="0 0 1122 793"
      >
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052D4" />
            <stop offset="50%" stopColor="#4364F7" />
            <stop offset="100%" stopColor="#6FB1FC" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F1B018" />
            <stop offset="100%" stopColor="#f39c12" />
          </linearGradient>
        </defs>

        {/* Top-Left Corner Waves */}
        {/* Gold Wave (Underneath) */}
        <path d="M 0,0 L 390,0 C 290,75 160,110 0,130 Z" fill="url(#goldGrad)" />
        {/* Blue Wave (Top) */}
        <path d="M 0,0 L 370,0 C 270,60 145,90 0,110 Z" fill="url(#blueGrad)" />

        {/* Top-Right Corner Waves */}
        {/* Gold Wave (Underneath) */}
        <path d="M 1122,0 L 960,0 C 1010,45 1060,75 1122,100 Z" fill="url(#goldGrad)" />
        {/* Blue Wave (Top) */}
        <path d="M 1122,0 L 980,0 C 1025,35 1070,60 1122,80 Z" fill="url(#blueGrad)" />

        {/* Bottom Subtle Waves (Extremely low to prevent overlapping the text) */}
        {/* Gold Wave (Underneath) */}
        <path d="M 0,793 L 0,750 Q 300,730 600,760 T 1122,730 L 1122,793 Z" fill="url(#goldGrad)" />
        {/* Blue Wave (Top) */}
        <path d="M 0,793 L 0,765 Q 300,745 600,772 T 1122,745 L 1122,793 Z" fill="url(#blueGrad)" />
      </svg>

      {/* Official Brand Logo - Big & Top Left over the corner waves */}
      <img
        src={logoUrl}
        alt="Healix BioLabs Official Logo"
        style={{
          position: "absolute",
          top: "32px",
          left: "35px",
          width: "74px",
          height: "74px",
          borderRadius: "50%",
          border: "3px solid #FFFFFF",
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 10,
        }}
      />

      {/* Main Content Layout */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "105px 90px 85px",
          boxSizing: "border-box",
        }}
      >
        {/* Centered Header Institution */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginBottom: "15px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#4364F7", letterSpacing: "3.5px", textTransform: "uppercase" }}>
            Healix BioLabs Academy of Biomedical Sciences
          </span>
        </div>

        {/* Main Certificate Title */}
        <h1
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "48px",
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "6px",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            lineHeight: 1.1,
          }}
        >
          Certificate
        </h1>
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#4b5563",
            letterSpacing: "7px",
            margin: "0 0 35px 0",
            textTransform: "uppercase",
          }}
        >
          of Completion
        </h2>

        {/* Proudly Presented To */}
        <p
          style={{
            fontSize: "9.5px",
            fontWeight: 700,
            color: "#9ca3af",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            margin: "0 0 12px 0",
          }}
        >
          This Certificate is Proudly Presented to:
        </p>

        {/* Recipient Name */}
        <div
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "58px",
            color: "#111827",
            margin: "0 0 4px 0",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          {fullName}
        </div>

        {/* Name Underline */}
        <div style={{ width: "520px", height: "1px", background: "#e5e7eb", marginBottom: "22px" }} />

        {/* Award Details Description */}
        <p
          style={{
            fontSize: "11px",
            fontStyle: "italic",
            color: "#6b7280",
            margin: "0 0 8px 0",
          }}
        >
          for successfully completing the specialized training curriculum in
        </p>

        <h3
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "19px",
            fontWeight: 800,
            color: "#0052D4",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            margin: "0 0 14px 0",
            textAlign: "center",
          }}
        >
          Advanced Biomedical Research Methodologies
        </h3>

        {/* Competencies Details */}
        <p
          style={{
            fontSize: "8.5px",
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            textAlign: "center",
            lineHeight: "1.6",
            maxWidth: "680px",
            margin: "0 0 45px 0",
          }}
        >
          Scientific Inquiry Paradigms &nbsp;·&nbsp; Reference Metadata Formatting (BibTeX) &nbsp;·&nbsp; 
          Biosafety Containment (BSL-2) &nbsp;·&nbsp; PCR Genomic Amplification Protocols &nbsp;·&nbsp; 
          Translational Ethics (ICMR Standards)
        </p>

        {/* Bottom Balanced 5-Column Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "auto",
            padding: "0 10px",
          }}
        >
          {/* Column 1: Date */}
          <div style={{ width: "160px", textAlign: "center" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
              {formattedDate}
            </div>
            <div style={{ width: "100%", height: "1.5px", background: "#9ca3af" }} />
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#6b7280", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "6px" }}>
              Date of Issuance
            </div>
          </div>

          {/* Column 2: Signature 1 */}
          <div style={{ width: "170px", textAlign: "center", position: "relative" }}>
            <div
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "28px",
                color: "#4364F7",
                position: "absolute",
                top: "-28px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                pointerEvents: "none",
              }}
            >
              Priya Sharma
            </div>
            <div style={{ width: "100%", height: "1.5px", background: "#9ca3af" }} />
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827", letterSpacing: "1.2px", textTransform: "uppercase", marginTop: "6px" }}>
              Dr. Priya Sharma, PhD
            </div>
            <div style={{ fontSize: "7px", color: "#b8972a", textTransform: "uppercase", marginTop: "1px", fontWeight: 650 }}>
              Chief Scientific Officer
            </div>
          </div>

          {/* Column 3: Official Seal */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "110px", paddingBottom: "2px" }}>
            <svg width="74" height="74" viewBox="0 0 78 78" fill="none" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))" }}>
              <circle cx="39" cy="39" r="37" fill="#0052D4" />
              <circle cx="39" cy="39" r="34" stroke="#F1B018" strokeWidth="2" fill="none" />
              <circle cx="39" cy="39" r="28" fill="none" stroke="#F1B018" strokeWidth="0.75" strokeDasharray="3,2" />
              <defs>
                <path id="sealTextPath" d="M 39,12 A 27,27 0 1,1 38.9,12" />
              </defs>
              <text fontSize="5.5" fontWeight="800" fill="#F1B018" fontFamily="sans-serif" letterSpacing="0.8">
                <textPath href="#sealTextPath" startOffset="0%">
                  HEALIX BIOLABS ACADEMY OF SCIENCES · SECURE VERIFIED ·
                </textPath>
              </text>
              <path d="M 29,39 C 31,31 47,31 49,39 C 47,47 31,47 29,39" stroke="#F1B018" strokeWidth="1.5" fill="none" opacity="0.9" />
              <path d="M 29,39 C 31,47 47,47 49,39 C 47,31 31,31 29,39" stroke="#6FB1FC" strokeWidth="1.5" fill="none" opacity="0.9" />
              <circle cx="39" cy="39" r="3" fill="#F1B018" />
            </svg>
            <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#6b7280", letterSpacing: "1px", textTransform: "uppercase", marginTop: "6px" }}>
              Official Seal
            </div>
          </div>

          {/* Column 4: Signature 2 */}
          <div style={{ width: "170px", textAlign: "center", position: "relative" }}>
            <div
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "28px",
                color: "#4364F7",
                position: "absolute",
                top: "-28px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                pointerEvents: "none",
              }}
            >
              Avnish Verma
            </div>
            <div style={{ width: "100%", height: "1.5px", background: "#9ca3af" }} />
            <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827", letterSpacing: "1.2px", textTransform: "uppercase", marginTop: "6px" }}>
              Dr. Avnish Verma, PhD
            </div>
            <div style={{ fontSize: "7px", color: "#b8972a", textTransform: "uppercase", marginTop: "1px", fontWeight: 650 }}>
              Director of Research
            </div>
          </div>

          {/* Column 5: Verification QR Code */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "150px" }}>
            <div
              style={{
                width: "66px",
                height: "66px",
                padding: "3px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <img
                src={qrCodeUrl}
                alt="Verification QR"
                style={{ width: "60px", height: "60px" }}
              />
            </div>
            <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#4364F7", letterSpacing: "1px", textTransform: "uppercase", marginTop: "6px", textAlign: "center" }}>
              Scan to Verify
            </div>
            <div style={{ fontSize: "6px", fontFamily: "monospace", color: "#6b7280", marginTop: "1px" }}>
              ID: {certHash.substring(0, 12)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function downloadCertificateAsPDF(fullName: string, certHash: string, issuedAt: string) {
  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "https://healix-biolabs.com";
  const verifyUrl = `${origin}/training/verify?hash=${certHash}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1a2744&bgcolor=ffffff&data=${encodeURIComponent(verifyUrl)}`;
  const logoUrl = `${origin}/logo.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate – ${fullName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;550;600;700&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{
    width:297mm;height:210mm;
    background:#fff;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  @page{size:A4 landscape;margin:0;}
  @media print{html,body{width:297mm;height:210mm;}}

  .page{
    width:297mm;height:210mm;
    background:#FFFFFF;
    position:relative;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    overflow:hidden;
    font-family:'Inter',sans-serif;
  }

  /* Main content layout */
  .content{
    position:relative;z-index:10;
    display:flex;flex-direction:column;align-items:center;
    width:100%;height:100%;
    padding:105px 90px 85px;
  }
</style>
</head>
<body>
<div class="page">
  <!-- SVG backgrounds -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;" viewBox="0 0 1122 793">
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0052D4" />
        <stop offset="50%" stop-color="#4364F7" />
        <stop offset="100%" stop-color="#6FB1FC" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F1B018" />
        <stop offset="100%" stop-color="#f39c12" />
      </linearGradient>
    </defs>
    
    <!-- Top-Left Waves -->
    <path d="M 0,0 L 390,0 C 290,75 160,110 0,130 Z" fill="url(#goldGrad)" />
    <path d="M 0,0 L 370,0 C 270,60 145,90 0,110 Z" fill="url(#blueGrad)" />

    <!-- Top-Right Waves -->
    <path d="M 1122,0 L 960,0 C 1010,45 1060,75 1122,100 Z" fill="url(#goldGrad)" />
    <path d="M 1122,0 L 980,0 C 1025,35 1070,60 1122,80 Z" fill="url(#blueGrad)" />

    <!-- Bottom Horizontal Waves (Subtle & Extremely low) -->
    <path d="M 0,793 L 0,750 Q 300,730 600,760 T 1122,730 L 1122,793 Z" fill="url(#goldGrad)" />
    <path d="M 0,793 L 0,765 Q 300,745 600,772 T 1122,745 L 1122,793 Z" fill="url(#blueGrad)" />
  </svg>

  <!-- Official Brand Logo - Big & Top Left over the corner waves -->
  <img
    src="${logoUrl}"
    alt="Healix BioLabs Official Logo"
    style="
      position: absolute;
      top: 32px;
      left: 35px;
      width: 74px;
      height: 74px;
      border-radius: 50%;
      border: 3px solid #FFFFFF;
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
    "
  />

  <div class="content">
    <!-- Centered Header Institution -->
    <div style="display:flex;align-items:center;justify-content:center;width:100%;margin-bottom:15px;">
      <span style="font-size:11.5px;font-weight:800;color:#4364F7;letter-spacing:3.5px;text-transform:uppercase;">
        Healix BioLabs Academy of Biomedical Sciences
      </span>
    </div>

    <!-- Title -->
    <h1 style="font-family:'Montserrat',sans-serif;font-size:48px;font-weight:900;color:#111827;letter-spacing:6px;margin:0 0 4px 0;text-transform:uppercase;line-height:1.1;">
      Certificate
    </h1>
    <h2 style="font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;color:#4b5563;letter-spacing:7px;margin:0 0 35px 0;text-transform:uppercase;">
      of Completion
    </h2>

    <!-- Proudly Presented To -->
    <p style="font-size:9.5px;font-weight:700;color:#9ca3af;letter-spacing:2.5px;text-transform:uppercase;margin:0 0 12px 0;">
      This Certificate is Proudly Presented to:
    </p>

    <!-- Recipient Name -->
    <div style="font-family:'Great Vibes',cursive;font-size:58px;color:#111827;margin:0 0 4px 0;line-height:1.1;text-align:center;">
      ${fullName}
    </div>

    <!-- Underline -->
    <div style="width:520px;height:1px;background:#e5e7eb;margin-bottom:22px;"></div>

    <!-- Description -->
    <p style="font-size:11px;font-style:italic;color:#6b7280;margin:0 0 8px 0;">
      for successfully completing the specialized training curriculum in
    </p>

    <h3 style="font-family:'Montserrat',sans-serif;font-size:19px;font-weight:800;color:#0052D4;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 14px 0;text-align:center;">
      Advanced Biomedical Research Methodologies
    </h3>

    <!-- Competencies -->
    <p style="font-size:8.5px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;text-align:center;line-height:1.6;max-width:680px;margin:0 0 45px 0;">
      Scientific Inquiry Paradigms &nbsp;·&nbsp; Reference Metadata Formatting (BibTeX) &nbsp;·&nbsp; 
      Biosafety Containment (BSL-2) &nbsp;·&nbsp; PCR Genomic Amplification Protocols &nbsp;·&nbsp; 
      Translational Ethics (ICMR Standards)
    </p>

    <!-- Bottom Balanced 5-Column Row -->
    <div style="display:flex;align-items:flex-end;justify-content:space-between;width:100%;margin-top:auto;padding:0 10px;">
      
      <!-- Column 1: Date -->
      <div style="width:160px;text-align:center;">
        <div style="font-size:12.5px;font-weight:700;color:#111827;margin-bottom:8px;">
          ${formattedDate}
        </div>
        <div style="width:100%;height:1.5px;background:#9ca3af;"></div>
        <div style="font-size:8px;font-weight:700;color:#6b7280;letter-spacing:1.5px;text-transform:uppercase;margin-top:6px;">
          Date of Issuance
        </div>
      </div>

      <!-- Column 2: Signature 1 -->
      <div style="width:170px;text-align:center;position:relative;">
        <div style="font-family:'Great Vibes',cursive;font-size:28px;color:#4364F7;position:absolute;top:-28px;left:50%;transform:translateX(-50%);width:100%;pointer-events:none;">
          Priya Sharma
        </div>
        <div style="width:100%;height:1.5px;background:#9ca3af;"></div>
        <div style="font-size:8px;font-weight:700;color:#111827;letter-spacing:1.2px;text-transform:uppercase;margin-top:6px;">
          Dr. Priya Sharma, PhD
        </div>
        <div style="font-size:7px;color:#b8972a;text-transform:uppercase;margin-top:1px;font-weight:650;">
          Chief Scientific Officer
        </div>
      </div>

      <!-- Column 3: Official Seal -->
      <div style="display:flex;flex-direction:column;align-items:center;width:110px;padding-bottom:2px;">
        <svg width="74" height="74" viewBox="0 0 78 78" fill="none">
          <circle cx="39" cy="39" r="37" fill="#0052D4"/>
          <circle cx="39" cy="39" r="34" stroke="#F1B018" stroke-width="2" fill="none"/>
          <circle cx="39" cy="39" r="28" fill="none" stroke="#F1B018" stroke-width="0.75" stroke-dasharray="3,2"/>
          <defs>
            <path id="sealTextPath" d="M 39,12 A 27,27 0 1,1 38.9,12"/>
          </defs>
          <text font-size="5.5" font-weight="800" fill="#F1B018" font-family="sans-serif" letter-spacing="0.8">
            <textPath href="#sealTextPath" startOffset="0%">
              HEALIX BIOLABS ACADEMY OF SCIENCES · SECURE VERIFIED ·
            </textPath>
          </text>
          <path d="M 29,39 C 31,31 47,31 49,39 C 47,47 31,47 29,39" stroke="#F1B018" stroke-width="1.5" fill="none" opacity="0.9"/>
          <path d="M 29,39 C 31,47 47,47 49,39 C 47,31 31,31 29,39" stroke="#6FB1FC" stroke-width="1.5" fill="none" opacity="0.9"/>
          <circle cx="39" cy="39" r="3" fill="#F1B018"/>
        </svg>
        <div style="font-size:7.5px;font-weight:700;color:#6b7280;letter-spacing:1px;text-transform:uppercase;margin-top:6px;">
          Official Seal
        </div>
      </div>

      <!-- Column 4: Signature 2 -->
      <div style="width:170px;text-align:center;position:relative;">
        <div style="font-family:'Great Vibes',cursive;font-size:28px;color:#4364F7;position:absolute;top:-28px;left:50%;transform:translateX(-50%);width:100%;pointer-events:none;">
          Avnish Verma
        </div>
        <div style="width:100%;height:1.5px;background:#9ca3af;"></div>
        <div style="font-size:8px;font-weight:700;color:#111827;letter-spacing:1.2px;text-transform:uppercase;margin-top:6px;">
          Dr. Avnish Verma, PhD
        </div>
        <div style="font-size:7px;color:#b8972a;text-transform:uppercase;margin-top:1px;font-weight:650;">
          Director of Research
        </div>
      </div>

      <!-- Column 5: Verification QR Code -->
      <div style="display:flex;flex-direction:column;align-items:center;width:150px;">
        <div style="width:66px;height:66px;padding:3px;background:#ffffff;border:1px solid #e5e7eb;border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <img src="${qrCodeUrl}" alt="Verification QR" style="width:60px;height:60px;"/>
        </div>
        <div style="font-size:7.5px;font-weight:700;color:#4364F7;letter-spacing:1px;text-transform:uppercase;margin-top:6px;text-align:center;">
          Scan to Verify
        </div>
        <div style="font-size:6px;font-family:monospace;color:#6b7280;margin-top:1px;">
          ID: ${certHash.substring(0, 12)}
        </div>
      </div>

    </div>
  </div>
</div>
<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 700);
  };
</script>
</body>
</html>`;

  const win = window.open("", "_blank", "width=1200,height=850");
  if (!win) {
    alert("Please allow pop-ups to download your certificate as PDF.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
