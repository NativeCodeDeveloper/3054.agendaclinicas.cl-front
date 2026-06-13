"use client";

import { useEffect, useRef } from "react";

const COLS = 110;
const ROWS = 60;

function waveHeight(x, y, t) {
  const nx = x / COLS;
  const ny = y / ROWS;
  const w1 = Math.sin(nx * Math.PI * 2.8 + ny * Math.PI * 1.2 + t * 0.4) * 0.5;
  const w2 = Math.sin(nx * Math.PI * 1.4 - ny * Math.PI * 2.1 + t * 0.3) * 0.3;
  const w3 = Math.cos(nx * Math.PI * 3.5 + ny * Math.PI * 0.8 - t * 0.5) * 0.2;
  const w4 = Math.sin((nx + ny) * Math.PI * 2.0 + t * 0.35) * 0.15;
  return w1 + w2 + w3 + w4;
}

function drawBackground(ctx, W, H) {
  const grad = ctx.createRadialGradient(W * 0.35, H * 0.3, 0, W * 0.35, H * 0.3, W * 0.8);
  grad.addColorStop(0, "#f8f9fc");
  grad.addColorStop(0.5, "#edf0f7");
  grad.addColorStop(1, "#e4e8f2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function draw(ctx, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  drawBackground(ctx, W, H);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const baseX = (col / COLS) * W * 1.1 - W * 0.05;
      const baseY = (row / ROWS) * H * 1.1 - H * 0.05;
      const wave = waveHeight(col, row, t);
      const offsetX = wave * 35 * Math.sin((col / COLS) * Math.PI);
      const offsetY = wave * 55;
      const x = baseX + offsetX;
      const y = baseY + offsetY;

      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;

      const waveNorm = (wave + 1) / 2;
      const size = 1.2 + waveNorm * 5.5;
      const darkness = Math.max(0, Math.min(1, waveNorm));
      const r = Math.round(30 + (200 - 30) * (1 - darkness * 0.85));
      const g = Math.round(38 + (205 - 38) * (1 - darkness * 0.75));
      const b = Math.round(60 + (215 - 60) * (1 - darkness * 0.55));
      const alpha = 0.15 + darkness * 0.82;

      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }
  }
}

export default function ParticleWaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let t = 0;
    let rafId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function animate() {
      t += 0.012;
      draw(ctx, canvas.width, canvas.height, t);
      rafId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
