"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Network, Zap } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  type: "hub" | "researcher" | "publication" | "institution";
  x3d: number;
  y3d: number;
  z3d: number;
  r: number;
  color: string;
  glowColor: string;
}

interface EdgeData {
  source: string;
  target: string;
  color: string;
}

const NODES: NodeData[] = [
  { id: "hub", label: "Healix BioLabs", type: "hub", x3d: 0, y3d: 0, z3d: 0, r: 22, color: "#3B82F6", glowColor: "rgba(59,130,246,0.5)" },
  
  // Institutions (large radius ~ 170-190)
  { id: "iit-d", label: "IIT Delhi", type: "institution", x3d: -160, y3d: -100, z3d: 80, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  { id: "iisc", label: "IISc Bangalore", type: "institution", x3d: 160, y3d: -110, z3d: -80, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  { id: "aiims", label: "AIIMS Delhi", type: "institution", x3d: 170, y3d: 100, z3d: 90, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  { id: "iit-m", label: "IIT Madras", type: "institution", x3d: -170, y3d: 110, z3d: -90, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  { id: "iit-b", label: "IIT Bombay", type: "institution", x3d: -195, y3d: 0, z3d: -40, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  { id: "iit-h", label: "IIT Hyderabad", type: "institution", x3d: 195, y3d: 0, z3d: 40, r: 14, color: "#F59E0B", glowColor: "rgba(245,158,11,0.4)" },
  
  // Researchers (medium radius ~ 90-100)
  { id: "r1", label: "Dr. Priya Sharma", type: "researcher", x3d: -95, y3d: -50, z3d: 50, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },
  { id: "r2", label: "Dr. Avnish Verma", type: "researcher", x3d: 95, y3d: -60, z3d: -50, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },
  { id: "r3", label: "Dr. Ranjit Kumar", type: "researcher", x3d: 100, y3d: 50, z3d: 60, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },
  { id: "r4", label: "Dr. K. Rao", type: "researcher", x3d: -100, y3d: 60, z3d: -60, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },
  { id: "r5", label: "Dr. A. Singh", type: "researcher", x3d: 0, y3d: -95, z3d: 20, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },
  { id: "r6", label: "Dr. S. Nair", type: "researcher", x3d: 0, y3d: 95, z3d: -20, r: 10, color: "#10B981", glowColor: "rgba(16,185,129,0.4)" },

  // Publications (small radius ~ 40-50)
  { id: "p1", label: "CRISPR-Cas9 Off-Target Assessment", type: "publication", x3d: -45, y3d: -30, z3d: 30, r: 7, color: "#8B5CF6", glowColor: "rgba(139,92,246,0.4)" },
  { id: "p2", label: "Lipid Nanoparticle Delivery Vectors", type: "publication", x3d: 45, y3d: -30, z3d: -30, r: 7, color: "#8B5CF6", glowColor: "rgba(139,92,246,0.4)" },
  { id: "p3", label: "Neural Prosthetics Calibration Phase 2", type: "publication", x3d: -45, y3d: 30, z3d: -30, r: 7, color: "#8B5CF6", glowColor: "rgba(139,92,246,0.4)" },
  { id: "p4", label: "Genomics Internship Insights 2026", type: "publication", x3d: 45, y3d: 30, z3d: 30, r: 7, color: "#8B5CF6", glowColor: "rgba(139,92,246,0.4)" },
];

const EDGES: EdgeData[] = [
  // Hub to institutions
  { source: "hub", target: "iit-d", color: "rgba(245,158,11,0.3)" },
  { source: "hub", target: "iisc", color: "rgba(245,158,11,0.3)" },
  { source: "hub", target: "aiims", color: "rgba(245,158,11,0.3)" },
  { source: "hub", target: "iit-m", color: "rgba(245,158,11,0.3)" },
  { source: "hub", target: "iit-b", color: "rgba(245,158,11,0.3)" },
  { source: "hub", target: "iit-h", color: "rgba(245,158,11,0.3)" },
  
  // Hub to researchers
  { source: "hub", target: "r1", color: "rgba(16,185,129,0.25)" },
  { source: "hub", target: "r2", color: "rgba(16,185,129,0.25)" },
  { source: "hub", target: "r3", color: "rgba(16,185,129,0.25)" },
  { source: "hub", target: "r4", color: "rgba(16,185,129,0.25)" },
  { source: "hub", target: "r5", color: "rgba(16,185,129,0.25)" },
  { source: "hub", target: "r6", color: "rgba(16,185,129,0.25)" },
  
  // Hub to publications
  { source: "hub", target: "p1", color: "rgba(139,92,246,0.2)" },
  { source: "hub", target: "p2", color: "rgba(139,92,246,0.2)" },
  { source: "hub", target: "p3", color: "rgba(139,92,246,0.2)" },
  { source: "hub", target: "p4", color: "rgba(139,92,246,0.2)" },
  
  // Cross connections
  { source: "r1", target: "iit-d", color: "rgba(255,255,255,0.08)" },
  { source: "r2", target: "iisc", color: "rgba(255,255,255,0.08)" },
  { source: "r3", target: "aiims", color: "rgba(255,255,255,0.08)" },
  { source: "r4", target: "iit-m", color: "rgba(255,255,255,0.08)" },
  { source: "r1", target: "p1", color: "rgba(255,255,255,0.07)" },
  { source: "r2", target: "p2", color: "rgba(255,255,255,0.07)" },
  { source: "r3", target: "p4", color: "rgba(255,255,255,0.07)" },
  { source: "r4", target: "p3", color: "rgba(255,255,255,0.07)" },
];

function rotateX(y: number, z: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [y * cos - z * sin, y * sin + z * cos];
}

function rotateY(x: number, z: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos + z * sin, -x * sin + z * cos];
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (
    0x1000000 +
    (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export default function NetworkIntelligenceMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 3D Rotation State Refs
  const angleXRef = useRef(-0.25);
  const angleYRef = useRef(0.5);
  const targetAngleXRef = useRef(-0.25);
  const targetAngleYRef = useRef(0.5);
  
  // Drag State Refs
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartAngleXRef = useRef(0);
  const dragStartAngleYRef = useRef(0);
  
  // Interactivity State Refs
  const hoveredNodeIdRef = useRef<string | null>(null);
  const projectedNodesRef = useRef<{ id: string; screenX: number; screenY: number; size: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Travelling packets
    const packets = EDGES.map((e, i) => ({
      edgeIndex: i,
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      color: e.color.replace(/[\d.]+\)$/, "0.9)"),
    }));

    // Resize handler to match screen pixel density (DPI)
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      dragStartAngleXRef.current = angleXRef.current;
      dragStartAngleYRef.current = angleYRef.current;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const mx = (e.clientX - rect.left) * dpr;
      const my = (e.clientY - rect.top) * dpr;

      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartXRef.current;
        const dy = e.clientY - dragStartYRef.current;
        targetAngleYRef.current = dragStartAngleYRef.current + dx * 0.006;
        targetAngleXRef.current = dragStartAngleXRef.current + dy * 0.006;
        // Keep X angle within safe bounds to prevent inversion
        targetAngleXRef.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetAngleXRef.current));
      } else {
        // Compute hover detection
        let closestId: string | null = null;
        let minDist = 28 * dpr; // Slightly larger hover target box

        projectedNodesRef.current.forEach((n) => {
          const dist = Math.hypot(n.screenX - mx, n.screenY - my);
          if (dist < minDist) {
            minDist = dist;
            closestId = n.id;
          }
        });

        if (closestId !== hoveredNodeIdRef.current) {
          hoveredNodeIdRef.current = closestId;
          canvas.style.cursor = closestId ? "pointer" : "grab";
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = hoveredNodeIdRef.current ? "pointer" : "grab";
    };

    const onMouseLeave = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let frameId = 0;
    let lastTime = performance.now();

    function animate(timestamp: number) {
      if (!ctx || !canvas) return;

      const dt = Math.min(2.0, (timestamp - lastTime) / 16.67);
      lastTime = timestamp;

      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;
      const centerX = W / 2;
      const centerY = H / 2;
      
      // Calculate responsive zoom factor (significantly larger than before)
      const zoom = Math.min(W, H) / 250;

      // Auto-rotation when idle
      if (!isDraggingRef.current) {
        targetAngleYRef.current += 0.0012 * dt;
        
        // Damp rotation
        angleYRef.current += (targetAngleYRef.current - angleYRef.current) * 0.05 * dt;
        angleXRef.current += (targetAngleXRef.current - angleXRef.current) * 0.05 * dt;
      } else {
        // Directly follow mouse movement
        angleYRef.current += (targetAngleYRef.current - angleYRef.current) * 0.2 * dt;
        angleXRef.current += (targetAngleXRef.current - angleXRef.current) * 0.2 * dt;
      }

      // 1. Rotate and project all nodes
      const rotatedNodes = NODES.map((node) => {
        // Living network bobbing effect
        const nodeIdx = NODES.findIndex((n) => n.id === node.id);
        const bob = Math.sin(timestamp * 0.0008 + nodeIdx) * 8;
        const adjustedY = node.y3d + bob;

        const [x1, z1] = rotateY(node.x3d, node.z3d, angleYRef.current);
        const [y1, z2] = rotateX(adjustedY, z1, angleXRef.current);

        // Stronger perspective camera
        const fov = 350;
        const cameraDist = 240;
        const scale = fov / (fov + z2 + cameraDist);
        
        const screenX = centerX + x1 * scale * zoom;
        const screenY = centerY + y1 * scale * zoom;
        const size = node.r * scale * zoom;

        return {
          ...node,
          screenX,
          screenY,
          screenZ: z2,
          size,
          isHovered: node.id === hoveredNodeIdRef.current,
        };
      });

      // Update projected nodes ref for hover detection
      projectedNodesRef.current = rotatedNodes.map((n) => ({
        id: n.id,
        screenX: n.screenX,
        screenY: n.screenY,
        size: n.size,
      }));

      // 2. Project Edges
      const rotatedEdges = EDGES.map((edge) => {
        const src = rotatedNodes.find((n) => n.id === edge.source)!;
        const tgt = rotatedNodes.find((n) => n.id === edge.target)!;
        const avgZ = (src.screenZ + tgt.screenZ) / 2;
        return {
          source: src,
          target: tgt,
          screenZ: avgZ,
          color: edge.color,
        };
      });

      // 3. Project Packets
      packets.forEach((p) => {
        p.t += p.speed * dt;
        if (p.t > 1) p.t = 0;
      });

      const rotatedPackets = packets.map((packet) => {
        const edge = EDGES[packet.edgeIndex];
        const src = rotatedNodes.find((n) => n.id === edge.source)!;
        const tgt = rotatedNodes.find((n) => n.id === edge.target)!;

        // Position interpolation in 3D space
        const x3d = src.x3d + (tgt.x3d - src.x3d) * packet.t;
        const y3d = src.screenY; // interpolate in screen space for smoother packets, or 3D
        // Interpolate in projected coordinates
        const screenX = src.screenX + (tgt.screenX - src.screenX) * packet.t;
        const screenY = src.screenY + (tgt.screenY - src.screenY) * packet.t;
        const screenZ = (src.screenZ + tgt.screenZ) / 2;
        const size = 2.4 * dpr * (1 - (screenZ + 200) / 450);

        return {
          screenX,
          screenY,
          screenZ,
          size: Math.max(1.2 * dpr, size),
          color: packet.color,
        };
      });

      // Assemble draw queue for sorting (Painter's Algorithm)
      interface DrawItem {
        type: "edge" | "packet" | "node";
        z: number;
        data: any;
      }
      
      const drawQueue: DrawItem[] = [];
      rotatedEdges.forEach((e) => drawQueue.push({ type: "edge", z: e.screenZ, data: e }));
      rotatedPackets.forEach((p) => drawQueue.push({ type: "packet", z: p.screenZ, data: p }));
      rotatedNodes.forEach((n) => drawQueue.push({ type: "node", z: n.screenZ, data: n }));

      // Sort items back-to-front (larger Z values drawn first)
      drawQueue.sort((a, b) => b.z - a.z);

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Render Queue
      drawQueue.forEach((item) => {
        if (item.type === "edge") {
          const edge = item.data;
          ctx.beginPath();
          ctx.moveTo(edge.source.screenX, edge.source.screenY);
          ctx.lineTo(edge.target.screenX, edge.target.screenY);
          
          // Realistic depth-based line thickness and opacity
          const depthAlpha = Math.max(0.04, Math.min(0.45, 0.28 * (1 - (edge.screenZ + 200) / 450)));
          const baseWidth = Math.max(0.4, 1.4 * (1 - (edge.screenZ + 200) / 450));
          
          ctx.strokeStyle = edge.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${depthAlpha})`);
          ctx.lineWidth = baseWidth * dpr;
          ctx.stroke();

        } else if (item.type === "packet") {
          const packet = item.data;
          ctx.beginPath();
          ctx.arc(packet.screenX, packet.screenY, packet.size, 0, Math.PI * 2);
          ctx.fillStyle = packet.color;
          ctx.fill();

        } else if (item.type === "node") {
          const node = item.data;
          const nx = node.screenX;
          const ny = node.screenY;
          const nr = node.size * 0.7;

          // Pulse ring (institutions & researchers only)
          if (node.type !== "publication") {
            const nodeIdx = NODES.findIndex((n) => n.id === node.id);
            const pulseT = (timestamp * 0.0012 * (1 + (nodeIdx % 3) * 0.15)) % 1;
            const pulseR = nr * (1.1 + pulseT * 1.5);
            const pulseAlpha = Math.max(0, 0.4 * (1 - pulseT) * (1 - (node.screenZ + 200) / 450));

            ctx.beginPath();
            ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
            ctx.strokeStyle = node.glowColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${pulseAlpha})`);
            ctx.lineWidth = 1.2 * dpr;
            ctx.stroke();
          }

          // Depth-based ambient glow opacity
          const glowAlpha = Math.max(0.06, Math.min(0.55, 0.5 * (1 - (node.screenZ + 200) / 450)));
          const radialGlow = node.glowColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${glowAlpha})`);
          
          // Outer Glow
          const grdOuter = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr * 3.2);
          grdOuter.addColorStop(0, radialGlow);
          grdOuter.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(nx, ny, nr * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = grdOuter;
          ctx.fill();

          // Inner Specular 3D Shading
          const highlightX = nx - nr * 0.3;
          const highlightY = ny - nr * 0.3;
          const radSphere = ctx.createRadialGradient(
            highlightX, highlightY, nr * 0.05,
            nx, ny, nr
          );
          
          radSphere.addColorStop(0, "#FFFFFF");
          radSphere.addColorStop(0.2, adjustColor(node.color, 45));
          radSphere.addColorStop(0.7, node.color);
          radSphere.addColorStop(1, adjustColor(node.color, -55));

          // Draw main node sphere
          ctx.beginPath();
          ctx.arc(nx, ny, nr, 0, Math.PI * 2);
          ctx.fillStyle = radSphere;
          ctx.fill();

          // Highlight boundary when hovered
          if (node.isHovered) {
            ctx.beginPath();
            ctx.arc(nx, ny, nr * 1.35, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
            ctx.lineWidth = 1.5 * dpr;
            ctx.stroke();
          }
        }
      });

      // 4. Render tooltip for hovered node on top of everything
      const hoveredNode = rotatedNodes.find((n) => n.id === hoveredNodeIdRef.current);
      if (hoveredNode) {
        const tx = hoveredNode.screenX + 16 * dpr;
        const ty = hoveredNode.screenY - 16 * dpr;

        ctx.font = `bold ${10 * dpr}px monospace`;
        const nameWidth = ctx.measureText(hoveredNode.label).width;
        ctx.font = `${8 * dpr}px monospace`;
        const typeWidth = ctx.measureText(hoveredNode.type.toUpperCase()).width;
        
        const boxWidth = Math.max(nameWidth, typeWidth) + 18 * dpr;
        const boxHeight = 36 * dpr;

        ctx.fillStyle = "rgba(7, 11, 19, 0.94)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1 * dpr;

        drawRoundedRect(ctx, tx, ty - boxHeight, boxWidth, boxHeight, 6 * dpr);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = `bold ${10 * dpr}px monospace`;
        ctx.fillText(hoveredNode.label, tx + 9 * dpr, ty - 20 * dpr);

        ctx.fillStyle = hoveredNode.color;
        ctx.font = `bold ${7.5 * dpr}px monospace`;
        ctx.fillText(hoveredNode.type.toUpperCase(), tx + 9 * dpr, ty - 6 * dpr);
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section className="py-20 bg-[#0B0F19]/30 border-b border-slate-900 relative z-10 overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left: Interactive 3D Canvas (Large and High Realistic spheres) */}
          <motion.div
            className="lg:col-span-7 relative flex items-center justify-center min-h-[320px] sm:min-h-[450px] md:min-h-[550px]"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full h-[320px] sm:h-[450px] md:h-[550px] max-w-[760px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
              />

              {/* Float Legend overlay (hidden on mobile for clean touch interaction) */}
              <div className="absolute bottom-4 left-4 hidden sm:flex flex-col space-y-1.5 bg-slate-950/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/40 shadow-xl select-none pointer-events-none z-20">
                {[
                  { color: "#3B82F6", label: "Hub Node" },
                  { color: "#F59E0B", label: "Institutions" },
                  { color: "#10B981", label: "Researchers" },
                  { color: "#8B5CF6", label: "Publications" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[9px] text-slate-400 font-mono font-bold tracking-wide">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Floating Active Links Badge (hidden on mobile for clean screen workspace) */}
              <div className="absolute top-4 right-4 hidden sm:block bg-blue-500/10 backdrop-blur-md border border-blue-500/15 rounded-xl px-4 py-2.5 text-center shadow-xl select-none pointer-events-none z-20">
                <div className="text-blue-400 font-extrabold font-heading text-lg leading-none">24</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">Active Links</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Network className="w-3 h-3 text-accent-blue" />
                <span>Network Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
                A Living, Breathing{" "}
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  Research Network
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Every node on this map represents a real entity in our network — researchers, institutions, and publications all dynamically connected through the Healix intelligence layer. Drag to spin the 3D model.
              </p>
            </div>

            {/* Network stats */}
            <div className="space-y-3">
              {[
                { label: "Institutions Connected", value: "7+", color: "bg-amber-500" },
                { label: "Research Collaborations", value: "340+", color: "bg-violet-500" },
                { label: "Cross-Institutional Papers", value: "1,240+", color: "bg-blue-500" },
                { label: "Network Coverage", value: "All India", color: "bg-emerald-500" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${stat.color}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{stat.label}</span>
                    <span className="text-[11px] text-white font-bold">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/researchers"
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Explore Network</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
