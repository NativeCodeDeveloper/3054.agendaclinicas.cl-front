"use client";

/**
 * SkeletonLoader.jsx
 * Skeleton genérico para listas y calendario.
 * Variantes: 'card' | 'row' | 'calendar-week' | 'calendar-day'
 * Props:
 *   - variant: string
 *   - count: number (para 'row', cantidad de filas)
 */

export function SkeletonLoader({ variant = "card", count = 3 }) {
  if (variant === "row") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 animate-pulse"
          >
            <div className="h-8 w-8 rounded-full bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-1/3 rounded bg-slate-100" />
              <div className="h-2.5 w-1/2 rounded bg-slate-100" />
            </div>
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "calendar-week") {
    return (
      <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden animate-pulse">
        {Array.from({ length: 7 }).map((_, col) => (
          <div key={col} className="bg-white p-2 space-y-2 min-h-[400px]">
            <div className="h-6 w-3/4 rounded bg-slate-100 mx-auto" />
            {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "calendar-day") {
    return (
      <div className="space-y-2 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  // Default: 'card'
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3.5 w-1/2 rounded bg-slate-100" />
          <div className="h-2.5 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-2.5 w-full rounded bg-slate-100" />
      <div className="h-2.5 w-4/5 rounded bg-slate-100" />
    </div>
  );
}
