"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Dna, Activity } from "lucide-react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  base?: "A" | "T" | "C" | "G";
  color: string;
  size: number;
  glowColor: string;
  isSatellite?: boolean;
  parentId?: number;
}

interface Connection {
  p1: number;
  p2: number;
  color: string;
  isRung?: boolean;
}

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

export default function DnaHelix3d() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Rotation states
  const angleYRef = useRef(0);
  const angleXRef = useRef(0.2);
  const targetAngleYRef = useRef(0);
  const targetAngleXRef = useRef(0.2);
  
  // Drag states
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartAngleYRef = useRef(0);
  const dragStartAngleXRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Build the 3D model: Double Helix
    const points: Point3D[] = [];
    const connections: Connection[] = [];

    const numPointsPerStrand = 24;
    const helixRadius = 98;
    const heightRange = 350;
    const pitch = 0.11; // Frequency of winding

    // Base pairing logic
    const bases: ("A" | "T" | "C" | "G")[] = ["A", "T", "C", "G"];
    const complementary: Record<string, "A" | "T" | "C" | "G"> = {
      A: "T",
      T: "A",
      C: "G",
      G: "C"
    };

    // Strand 1 and Strand 2
    for (let i = 0; i < numPointsPerStrand; i++) {
      const t = (i / (numPointsPerStrand - 1)) * 2 - 1; // -1 to 1
      const y = t * (heightRange / 2);
      const theta = y * pitch;

      // Strand 1 node
      const x1 = helixRadius * Math.cos(theta);
      const z1 = helixRadius * Math.sin(theta);
      const base1 = bases[i % 4];
      const color1 = base1 === "A" || base1 === "T" ? "#3B82F6" : "#8B5CF6";
      const glow1 = base1 === "A" || base1 === "T" ? "rgba(59,130,246,0.4)" : "rgba(139,92,246,0.4)";
      
      points.push({
        x: x1,
        y: y,
        z: z1,
        base: base1,
        color: color1,
        size: 12.5,
        glowColor: glow1
      });

      // Strand 2 node (out of phase by PI)
      const x2 = helixRadius * Math.cos(theta + Math.PI);
      const z2 = helixRadius * Math.sin(theta + Math.PI);
      const base2 = complementary[base1];
      const color2 = base2 === "A" || base2 === "T" ? "#06B6D4" : "#EC4899";
      const glow2 = base2 === "A" || base2 === "T" ? "rgba(6,182,212,0.4)" : "rgba(236,72,153,0.4)";

      points.push({
        x: x2,
        y: y,
        z: z2,
        base: base2,
        color: color2,
        size: 12.5,
        glowColor: glow2
      });

      // Connection between Strand 1 and Strand 2 (Rungs)
      const idx1 = points.length - 2;
      const idx2 = points.length - 1;
      connections.push({
        p1: idx1,
        p2: idx2,
        color: "rgba(255, 255, 255, 0.15)",
        isRung: true
      });

      // Connect backbones
      if (i > 0) {
        // Connect Strand 1 node to previous Strand 1 node
        connections.push({
          p1: idx1 - 2,
          p2: idx1,
          color: "rgba(59, 130, 246, 0.4)"
        });
        // Connect Strand 2 node to previous Strand 2 node
        connections.push({
          p1: idx2 - 2,
          p2: idx2,
          color: "rgba(139, 92, 246, 0.4)"
        });
      }

      // Add floating molecular branches (satellites) to some nodes to match the image complexity
      if (i % 3 === 0) {
        // Satellite for Strand 1
        const satAngle = theta + 1.2;
        const satRadius = 25;
        const satX = x1 + satRadius * Math.cos(satAngle);
        const satY = y + (Math.random() * 10 - 5);
        const satZ = z1 + satRadius * Math.sin(satAngle);
        points.push({
          x: satX,
          y: satY,
          z: satZ,
          color: "#475569",
          size: 3.5,
          glowColor: "rgba(71,85,105,0.2)",
          isSatellite: true,
          parentId: idx1
        });
        connections.push({
          p1: idx1,
          p2: points.length - 1,
          color: "rgba(255, 255, 255, 0.08)"
        });

        // Add a secondary connection to build a small molecular cluster
        if (Math.random() > 0.5) {
          points.push({
            x: satX + 12 * Math.cos(satAngle + 0.8),
            y: satY + 8,
            z: satZ + 12 * Math.sin(satAngle + 0.8),
            color: "#64748B",
            size: 2,
            glowColor: "rgba(100,116,139,0.1)",
            isSatellite: true,
            parentId: points.length - 1
          });
          connections.push({
            p1: points.length - 2,
            p2: points.length - 1,
            color: "rgba(255, 255, 255, 0.06)"
          });
        }
      }
    }

    // Handle canvas sizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse drag handlers for interactive spin
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartYRef.current = e.clientY;
      dragStartAngleYRef.current = angleYRef.current;
      dragStartAngleXRef.current = angleXRef.current;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      const dy = e.clientY - dragStartYRef.current;
      targetAngleYRef.current = dragStartAngleYRef.current + dx * 0.007;
      targetAngleXRef.current = dragStartAngleXRef.current + dy * 0.007;
      
      // Limit vertical rotation to avoid flipping upside down
      targetAngleXRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetAngleXRef.current));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
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

    function render(timestamp: number) {
      if (!ctx || !canvas) return;

      const dt = Math.min(2.0, (timestamp - lastTime) / 16.67);
      lastTime = timestamp;

      const W = canvas.width;
      const H = canvas.height;
      const centerX = W / 2;
      const centerY = H / 2;
      const dpr = window.devicePixelRatio || 1;

      // Adjust scale factor based on canvas size
      const zoom = Math.min(W, H) / 280;

      // Spin automatically when idle
      if (!isDraggingRef.current) {
        targetAngleYRef.current += 0.0045 * dt;
        angleYRef.current += (targetAngleYRef.current - angleYRef.current) * 0.05 * dt;
        angleXRef.current += (targetAngleXRef.current - angleXRef.current) * 0.05 * dt;
      } else {
        angleYRef.current += (targetAngleYRef.current - angleYRef.current) * 0.2 * dt;
        angleXRef.current += (targetAngleXRef.current - angleXRef.current) * 0.2 * dt;
      }

      // Project all 3D points to 2D
      const projected = points.map((p) => {
        // Rotate around Y-axis
        const [x1, z1] = rotateY(p.x, p.z, angleYRef.current);
        // Rotate around X-axis
        const [y1, z2] = rotateX(p.y, z1, angleXRef.current);

        // Perspective camera projection
        const fov = 400;
        const cameraDist = 300;
        const scale = fov / (fov + z2 + cameraDist);

        const screenX = centerX + x1 * scale * zoom;
        const screenY = centerY + y1 * scale * zoom;
        const size = p.size * scale * zoom;

        return {
          ...p,
          screenX,
          screenY,
          screenZ: z2,
          size
        };
      });

      // Clear Canvas
      ctx.clearRect(0, 0, W, H);

      // Draw Circular calibration ring (HUD backdrop element)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 205 * zoom, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw dotted ticking indicator arc
      ctx.strokeStyle = "rgba(139, 92, 246, 0.06)";
      ctx.setLineDash([2 * dpr, 6 * dpr]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, 215 * zoom, timestamp * 0.0002, timestamp * 0.0002 + Math.PI * 1.5);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Build Draw Queue (Painter's algorithm for proper depth ordering)
      interface DrawItem {
        type: "backbone" | "rung" | "node";
        z: number;
        data: any;
      }
      const drawQueue: DrawItem[] = [];

      // Sort connections based on average depth (Z)
      connections.forEach((conn) => {
        const p1 = projected[conn.p1];
        const p2 = projected[conn.p2];
        const avgZ = (p1.screenZ + p2.screenZ) / 2;

        if (conn.isRung) {
          drawQueue.push({ type: "rung", z: avgZ, data: { p1, p2, color: conn.color } });
        } else {
          drawQueue.push({ type: "backbone", z: avgZ, data: { p1, p2, color: conn.color } });
        }
      });

      // Add nodes to draw queue
      projected.forEach((p) => {
        drawQueue.push({ type: "node", z: p.screenZ, data: p });
      });

      // Sort queue from back (highest Z) to front (lowest Z)
      drawQueue.sort((a, b) => b.z - a.z);

      // Render all items
      drawQueue.forEach((item) => {
        if (item.type === "backbone") {
          const { p1, p2 } = item.data;
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          
          const depthAlpha = Math.max(0.04, Math.min(0.4, 0.28 * (1 - (item.z + 100) / 300)));
          ctx.strokeStyle = `rgba(59, 130, 246, ${depthAlpha})`;
          ctx.lineWidth = Math.max(0.6, 2.5 * (1 - (item.z + 100) / 300)) * dpr;
          ctx.stroke();

        } else if (item.type === "rung") {
          const { p1, p2 } = item.data;
          
          // Draw dual color rung matching the nucleotide pairs (e.g. blue to purple)
          const midX = (p1.screenX + p2.screenX) / 2;
          const midY = (p1.screenY + p2.screenY) / 2;
          
          const depthAlpha = Math.max(0.03, Math.min(0.35, 0.2 * (1 - (item.z + 100) / 300)));
          const rungWidth = Math.max(0.4, 1.6 * (1 - (item.z + 100) / 300)) * dpr;

          // First half (from Strand 1 node to middle)
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(midX, midY);
          ctx.strokeStyle = p1.color.replace(/rgb\(([^)]+)\)/, `rgba($1, ${depthAlpha})`).replace("#", "").length === 6
            ? p1.color + Math.round(depthAlpha * 255).toString(16).padStart(2, '0')
            : p1.color;
          // Safeguard color transparency
          if (p1.color === "#3B82F6") ctx.strokeStyle = `rgba(59, 130, 246, ${depthAlpha})`;
          if (p1.color === "#8B5CF6") ctx.strokeStyle = `rgba(139, 92, 246, ${depthAlpha})`;
          if (p1.color === "#06B6D4") ctx.strokeStyle = `rgba(6, 182, 212, ${depthAlpha})`;
          if (p1.color === "#EC4899") ctx.strokeStyle = `rgba(236, 72, 153, ${depthAlpha})`;
          
          ctx.lineWidth = rungWidth;
          ctx.stroke();

          // Second half (from middle to Strand 2 node)
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(p2.screenX, p2.screenY);
          if (p2.color === "#3B82F6") ctx.strokeStyle = `rgba(59, 130, 246, ${depthAlpha})`;
          if (p2.color === "#8B5CF6") ctx.strokeStyle = `rgba(139, 92, 246, ${depthAlpha})`;
          if (p2.color === "#06B6D4") ctx.strokeStyle = `rgba(6, 182, 212, ${depthAlpha})`;
          if (p2.color === "#EC4899") ctx.strokeStyle = `rgba(236, 72, 153, ${depthAlpha})`;
          ctx.stroke();

          // Draw small link junction bead at the center of the rung
          ctx.beginPath();
          ctx.arc(midX, midY, rungWidth * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.fill();

        } else if (item.type === "node") {
          const node = item.data;
          const nx = node.screenX;
          const ny = node.screenY;
          const nr = node.size;

          if (node.isSatellite) {
            // Draw satellite molecule node
            ctx.beginPath();
            ctx.arc(nx, ny, nr, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(100, 116, 139, 0.5)";
            ctx.fill();
            
            // Subtle boundary ring
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 0.5 * dpr;
            ctx.stroke();
            return;
          }

          // 1. Draw glowing background radial gradient under each main node
          const glowAlpha = Math.max(0.04, Math.min(0.48, 0.4 * (1 - (node.screenZ + 100) / 300)));
          const glowGrd = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr * 3.5);
          glowGrd.addColorStop(0, node.glowColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${glowAlpha})`));
          glowGrd.addColorStop(1, "transparent");
          
          ctx.beginPath();
          ctx.arc(nx, ny, nr * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGrd;
          ctx.fill();

          // 2. Draw 3D Shading sphere with a radial specular highlight
          const highlightX = nx - nr * 0.35;
          const highlightY = ny - nr * 0.35;
          const sphereGrd = ctx.createRadialGradient(
            highlightX, highlightY, nr * 0.05,
            nx, ny, nr
          );
          
          sphereGrd.addColorStop(0, "#FFFFFF");
          sphereGrd.addColorStop(0.2, adjustColor(node.color, 45));
          sphereGrd.addColorStop(0.7, node.color);
          sphereGrd.addColorStop(1, adjustColor(node.color, -55));

          ctx.beginPath();
          ctx.arc(nx, ny, nr, 0, Math.PI * 2);
          ctx.fillStyle = sphereGrd;
          ctx.fill();

          // 3. Draw thin outer boundary ring for high resolution definition
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 0.8 * dpr;
          ctx.stroke();

          // 4. Draw Nucleotide code letters (A, T, C, G) inside the sphere if visible
          if (nr > 4.5 && node.base) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.font = `bold ${nr * 0.95}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(node.base, nx, ny + 0.5 * dpr);
          }
        }
      });

      // Draw HUD overlays (Text items displaying scientific metrics)
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
      ctx.font = `${7 * dpr}px monospace`;
      
      // Upper Left HUD
      ctx.fillText("GENETIC SEQUENCE", centerX - 240 * zoom, centerY - 210 * zoom);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 0.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(centerX - 240 * zoom, centerY - 200 * zoom);
      ctx.lineTo(centerX - 180 * zoom, centerY - 200 * zoom);
      ctx.stroke();

      // Lower Right HUD
      ctx.textAlign = "right";
      ctx.fillText("OCTANE 3D RENDER", centerX + 240 * zoom, centerY + 200 * zoom);
      ctx.beginPath();
      ctx.moveTo(centerX + 240 * zoom, centerY + 210 * zoom);
      ctx.lineTo(centerX + 180 * zoom, centerY + 210 * zoom);
      ctx.stroke();

      frameId = requestAnimationFrame(render);
    }

    frameId = requestAnimationFrame(render);

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
    <div className="relative w-full h-full aspect-square flex items-center justify-center">
      {/* Decorative pulse glow element behind the canvas */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none animate-pulse" />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
      />
    </div>
  );
}
