"use client";

/**
 * AvatarInitials.jsx
 * Avatar circular con iniciales y color determinístico por nombre.
 * Props:
 *   - name: string
 *   - size: 'xs' | 'sm' | 'md' | 'lg' (default 'md')
 *   - className: string (opcional)
 */

import { getAvatarColor, getInitials } from "@/lib/designTokens";

const SIZE_MAP = {
  xs: { container: "h-6 w-6 text-[10px]" },
  sm: { container: "h-8 w-8 text-[11px]" },
  md: { container: "h-9 w-9 text-[13px]" },
  lg: { container: "h-11 w-11 text-[15px]" },
};

export function AvatarInitials({ name = "", size = "md", className = "" }) {
  const { bg, text } = getAvatarColor(name);
  const initials = getInitials(name);
  const { container } = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold flex-shrink-0 ${container} ${className}`}
      style={{ backgroundColor: bg, color: text }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
