"use client";

/**
 * RutDisplay.jsx
 * Componente presentacional que muestra un RUT formateado como 12.345.678-9.
 * Solo formateo visual — NO modifica el valor almacenado en BD.
 * Props:
 *   - rut: string
 *   - className: string (opcional)
 */

import { formatRut } from "@/lib/designTokens";

export function RutDisplay({ rut = "", className = "" }) {
  const formatted = formatRut(rut);
  if (!formatted) return null;

  return (
    <span className={`font-mono tabular-nums ${className}`}>{formatted}</span>
  );
}
