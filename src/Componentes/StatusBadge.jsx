"use client";

/**
 * StatusBadge.jsx
 * Chip/badge estandarizado para los 8 estados del sistema.
 * Consume STATE_COLORS de designTokens.js.
 * Props:
 *   - estado: string (nombre del estado del sistema)
 *   - size: 'sm' | 'md' (default 'sm')
 */

import { getStateTokens } from "@/lib/designTokens";

export function StatusBadge({ estado = "", size = "sm" }) {
  const token = getStateTokens(estado);
  const label = token.label;

  const sizeClasses =
    size === "md"
      ? "px-2.5 py-1 text-[12px] gap-1.5"
      : "px-2 py-0.5 text-[11px] gap-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${sizeClasses} ${token.pill} max-w-full flex-shrink-0`}
      style={{ letterSpacing: "0.02em" }}
    >
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{
          width: size === "md" ? 6 : 5,
          height: size === "md" ? 6 : 5,
          backgroundColor: token.dot,
        }}
      />
      <span className="truncate leading-none pt-[1px]">{label}</span>
    </span>
  );
}
