"use client";

import React, { useRef, useEffect } from "react";

export default function HeroWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let time = 0;

    const resize = () => {
      if (!canvas.parentNode) return;
      const rect = (canvas.parentNode as HTMLElement).getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    // Multi-layered waves matching the design palette of the reference image
    const waves = [
      {
        speed: 0.007,
        freq: 0.0018,
        amp: 40,
        y: 110,
        stops: [
          { offset: 0, color: "rgba(236, 72, 153, 0.28)" }, // Pink-purple
          { offset: 0.5, color: "rgba(139, 92, 246, 0.48)" },
          { offset: 1, color: "rgba(59, 130, 246, 0.05)" }
        ]
      },
      {
        speed: -0.0055,
        freq: 0.0025,
        amp: 30,
        y: 150,
        stops: [
          { offset: 0, color: "rgba(59, 130, 246, 0)" }, // Indigo-teal
          { offset: 0.5, color: "rgba(99, 102, 241, 0.58)" },
          { offset: 1, color: "rgba(16, 185, 129, 0.48)" }
        ]
      },
      {
        speed: 0.0035,
        freq: 0.0012,
        amp: 20,
        y: 190,
        stops: [
          { offset: 0.2, color: "rgba(7, 11, 19, 1)" }, // Deep navy
          { offset: 0.6, color: "rgba(37, 99, 235, 0.28)" },
          { offset: 1, color: "rgba(6, 182, 212, 0.48)" }
        ]
      }
    ];

    const draw = () => {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      const dpr = window.devicePixelRatio || 1;

      ctx.clearRect(0, 0, W, H);

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, H);

        for (let x = 0; x <= W; x += 4) {
          const waveX = x / dpr;
          // Combine primary sine and secondary cosine wave for organic complexity
          const y = w.y * dpr + 
            Math.sin(waveX * w.freq + time * w.speed) * w.amp * dpr +
            Math.cos(waveX * (w.freq * 1.6) - time * (w.speed * 0.8)) * (w.amp * 0.25) * dpr;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(W, H);
        ctx.closePath();

        // Create linear gradient across canvas
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        w.stops.forEach((stop) => {
          grad.addColorStop(stop.offset, stop.color);
        });

        ctx.fillStyle = grad;
        ctx.fill();
      });

      time += 1.2;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ imageRendering: "auto" }}
    />
  );
}
