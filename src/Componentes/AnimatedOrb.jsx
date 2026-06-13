"use client";
import { useEffect, useRef } from "react";

export default function AnimatedOrb({ size = 48 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = size * dpr;
    const h = size * dpr;
    canvas.width = w;
    canvas.height = h;

    // Perlin noise
    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(a, b, t) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    function noise3D(x, y, z) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const Z = Math.floor(z) & 255;
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
      const u = fade(x), v = fade(y), w2 = fade(z);
      const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
      const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
      return lerp(
        lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
             lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
        lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
             lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
        w2
      );
    }

    // Generar puntos en la esfera
    const particles = [];
    const numRings = 40;
    const radius = w * 0.36;

    for (let i = 0; i < numRings; i++) {
      const phi = (Math.PI * (i + 0.5)) / numRings;
      const ringRadius = Math.sin(phi);
      const numDots = Math.max(6, Math.floor(ringRadius * 50));
      for (let j = 0; j < numDots; j++) {
        const theta = (2 * Math.PI * j) / numDots;
        particles.push({
          basePhi: phi,
          baseTheta: theta,
          x: 0, y: 0, z: 0,
          size: (0.5 + Math.random() * 0.7) * dpr,
        });
      }
    }

    let animId;
    let time = 0;

    function render() {
      time += 0.012;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Rotacion continua tipo remolino
      const rotY = time * 1.2;
      const rotX = 0.4;
      const rotZ = time * 0.3;
      const cosRY = Math.cos(rotY), sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX), sinRX = Math.sin(rotX);
      const cosRZ = Math.cos(rotZ), sinRZ = Math.sin(rotZ);

      const noiseTime = time * 0.5;
      const noiseScale = 1.4;

      // Calcular posiciones con efecto remolino
      for (const pt of particles) {
        const sp = Math.sin(pt.basePhi);
        const cp = Math.cos(pt.basePhi);

        // Efecto remolino: desplazar theta segun la latitud (phi) y el tiempo
        const swirlAmount = Math.sin(pt.basePhi) * 0.8;
        const swirlTheta = pt.baseTheta + time * 1.5 * swirlAmount + cp * time * 0.6;

        const st = Math.sin(swirlTheta);
        const ct = Math.cos(swirlTheta);

        let bx = sp * ct;
        let by = cp;
        let bz = sp * st;

        // Noise displacement organico
        const n = noise3D(
          bx * noiseScale + noiseTime,
          by * noiseScale + noiseTime * 0.6,
          bz * noiseScale + noiseTime * 0.4
        );
        const n2 = noise3D(
          bz * noiseScale * 0.8 + noiseTime * 0.3,
          bx * noiseScale * 0.8 + noiseTime * 0.5,
          by * noiseScale * 0.8 + noiseTime * 0.7
        );
        const d = 1 + n * 0.18 + n2 * 0.08;

        let x = bx * d * radius;
        let y = by * d * radius;
        let z = bz * d * radius;

        // Rotacion Y (principal, giro constante)
        let rx = x * cosRY - z * sinRY;
        let rz = x * sinRY + z * cosRY;
        x = rx; z = rz;

        // Rotacion X (inclinacion)
        let ry = y * cosRX - z * sinRX;
        let rz2 = y * sinRX + z * cosRX;
        y = ry; z = rz2;

        // Rotacion Z (giro lento adicional)
        rx = x * cosRZ - y * sinRZ;
        ry = x * sinRZ + y * cosRZ;
        x = rx; y = ry;

        pt.x = x;
        pt.y = y;
        pt.z = z;
      }

      // Ordenar por Z
      particles.sort((a, b) => a.z - b.z);

      for (const pt of particles) {
        const depth = (pt.z / radius + 1) / 2;
        const alpha = 0.1 + depth * 0.9;

        // Color gradiente: rosa/rojo arriba -> magenta centro -> violeta/azul abajo
        const yNorm = (-pt.y / radius + 1) / 2; // 0=arriba(rosa), 1=abajo(azul)
        let r, g, b2;

        if (yNorm < 0.5) {
          const t = yNorm / 0.5;
          r = Math.floor(lerp(255, 220, t));
          g = Math.floor(lerp(50, 30, t));
          b2 = Math.floor(lerp(100, 200, t));
        } else {
          const t = (yNorm - 0.5) / 0.5;
          r = Math.floor(lerp(220, 80, t));
          g = Math.floor(lerp(30, 40, t));
          b2 = Math.floor(lerp(200, 255, t));
        }

        const glow = depth > 0.7 ? (depth - 0.7) / 0.3 : 0;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${r},${g},${b2})`;

        const dotSize = pt.size * (0.5 + depth * 0.6);
        ctx.beginPath();
        ctx.arc(cx + pt.x, cy - pt.y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Glow sutil en particulas cercanas
        if (glow > 0) {
          ctx.globalAlpha = glow * 0.3;
          ctx.shadowColor = `rgb(${r},${g},${b2})`;
          ctx.shadowBlur = 4 * dpr;
          ctx.beginPath();
          ctx.arc(cx + pt.x, cy - pt.y, dotSize * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    }

    render();

    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="block"
    />
  );
}
