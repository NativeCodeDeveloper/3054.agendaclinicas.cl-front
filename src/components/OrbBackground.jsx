'use client';

import { useEffect, useRef } from 'react';

export default function OrbBackground({ children, orbX = 0.60, orbY = 0.58, bg = '#fff' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Partículas: más densidad para mayor calidad visual ────────────────────
    const ROWS = 110;
    const COLS = 110;
    const particles = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        particles.push({ i, j });
      }
    }

    // ── Paleta inspirada en el logo: violeta → azul → cyan ───────────────────
    // Colores del logo: #8B5CF6 violeta, #3B82F6 azul, #06B6D4 cyan
    // Todos desaturados ~30% para feel premium, no neón
    const getColor = (ny, nx, nz, depth, t) => {
      const norm = (ny + 1) / 2;

      let r, g, b;
      if (norm < 0.30) {
        // Base: violeta profundo oscuro
        const t2 = norm / 0.30;
        r = Math.round(50  + t2 * 55);   // 50 → 105
        g = Math.round(10  + t2 * 15);   // 10 → 25
        b = Math.round(110 + t2 * 85);   // 110 → 195
      } else if (norm < 0.58) {
        // Cuerpo: azul real — corazón del orbe
        const t2 = (norm - 0.30) / 0.28;
        r = Math.round(30  + t2 * 20);   // 30 → 50
        g = Math.round(70  + t2 * 80);   // 70 → 150
        b = Math.round(190 + t2 * 50);   // 190 → 240
      } else if (norm < 0.82) {
        // Alto: transición azul → cyan del logo
        const t2 = (norm - 0.58) / 0.24;
        r = Math.round(20  + t2 * 10);   // 20 → 30
        g = Math.round(150 + t2 * 80);   // 150 → 230
        b = Math.round(220 + t2 * 30);   // 220 → 250
      } else {
        // Punta: cyan suave del logo — desaturado
        const t2 = (norm - 0.82) / 0.18;
        r = Math.round(40  + t2 * 30);   // 40 → 70
        g = Math.round(200 + t2 * 40);   // 200 → 240
        b = Math.round(230 + t2 * 20);   // 230 → 250
      }

      // Shimmer suave — textura sin sobrebrillo
      const shimmer = Math.sin(nx * 4.0 + t * 0.9) * 8;
      const pulse   = Math.cos(ny * 3.8 - t * 0.75) * 6;

      r = Math.min(255, Math.max(0, r + shimmer * 0.3));
      g = Math.min(255, Math.max(0, g + shimmer * 0.5 + pulse * 0.2));
      b = Math.min(255, Math.max(0, b + pulse   * 0.4));

      // Especular contenido
      const specAngle = Math.sin(t * 0.18) * 0.6;
      const specDot   = Math.max(0, nx * Math.cos(specAngle) + nz * Math.sin(specAngle));
      const specular  = Math.pow(specDot, 10) * 22 * depth;
      r = Math.min(255, r + specular * 0.5);
      g = Math.min(255, g + specular * 0.8);
      b = Math.min(255, b + specular);

      return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx     = canvas.width  * orbX;
      const cy     = canvas.height * orbY;
      const radius = Math.min(canvas.width, canvas.height) * 0.46;

      // ── Glow: refleja los colores del logo ───────────────────────────────
      const outerGlow = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 2.0);
      outerGlow.addColorStop(0,    'rgba(30, 160, 220, 0.12)');  // cyan
      outerGlow.addColorStop(0.35, 'rgba(50,  90, 210, 0.08)');  // azul
      outerGlow.addColorStop(0.65, 'rgba(100, 50, 190, 0.05)');  // violeta
      outerGlow.addColorStop(1,    'rgba(0,    0,   0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── Movimiento 3D ─────────────────────────────────────────────────────
      const rotY    = time * 0.10;
      const rotX    = Math.sin(time * 0.07) * 0.28;
      const breathe = 1 + Math.sin(time * 0.13) * 0.06;

      const cosRY = Math.cos(rotY), sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX), sinRX = Math.sin(rotX);

      // Ordenar por profundidad para pintar de atrás hacia adelante
      const rendered = [];

      for (const p of particles) {
        const phi   = (p.i / (ROWS - 1)) * Math.PI;
        const theta = (p.j / (COLS - 1)) * 2 * Math.PI;

        // Distorsión orgánica multicapa
        const nA = Math.sin(phi * 3.2 + time * 0.55 + p.j * 0.11) * 0.20;
        const nB = Math.cos(theta * 2.3 + time * 0.38 + p.i * 0.09) * 0.18;
        const nC = Math.sin(phi * 1.8 + theta * 1.4 + time * 0.72) * 0.12;
        const nD = Math.cos(phi + theta * 2.8 + time * 0.28) * 0.07;

        const nx = Math.sin(phi + nA) * Math.cos(theta + nB);
        const ny = Math.cos(phi + nB + nD);
        const nz = Math.sin(phi + nC) * Math.sin(theta + nA);

        // Rotación Y
        let x3d = nx * cosRY - nz * sinRY;
        let z3d = nx * sinRY + nz * cosRY;
        let y3d = ny;

        // Rotación X
        const y3dR = y3d * cosRX - z3d * sinRX;
        const z3dR = y3d * sinRX + z3d * cosRX;
        y3d = y3dR;
        z3d = z3dR;

        const depth       = (z3d + 1) / 2;
        const perspective = 1 / (1 + z3d * 0.38);
        const r           = radius * breathe;
        const sx          = cx + x3d * r * perspective;
        const sy          = cy - y3d * r * perspective;

        const dotSize = (0.45 + depth * 1.3) * perspective;
        const alpha   = 0.22 + depth * 0.52;
        const color   = getColor(ny, nx, nz, depth, time);

        rendered.push({ sx, sy, dotSize, alpha, color, z3d });
      }

      // Pintar de atrás hacia adelante para profundidad correcta
      rendered.sort((a, b) => a.z3d - b.z3d);

      for (const p of rendered) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      time += 0.009;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: bg }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
