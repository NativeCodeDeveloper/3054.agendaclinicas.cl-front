"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * CarruselPro
 * Props:
 * - img1: string (url), optional
 * - img2: string (url), optional
 * - img3: string (url), optional
 * - img4: string (url), optional
 * - img5: string (url), optional
 */
export default function CarruselPro({ img1, img2, img3, img4, img5 }) {
    const trackRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const safeImages = useMemo(() => {
        return [img1, img2, img3, img4, img5].filter(Boolean).slice(0, 5);
    }, [img1, img2, img3, img4, img5]);

    // Duplicamos para loop continuo (solo si hay 2+)
    const loopImages = useMemo(() => {
        if (safeImages.length <= 1) return safeImages;
        return [...safeImages, ...safeImages];
    }, [safeImages]);

    // Auto-scroll suave
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;

        if (safeImages.length <= 1) return; // no tiene sentido
        let raf = 0;

        // px por frame aprox (60fps). Ajusta para más lento/rápido.
        const speed = 0.35;

        const tick = () => {
            // pausa si usuario está encima (mejor UX)
            if (!isHovering) {
                el.scrollLeft += speed;

                // Cuando llegamos a la mitad (porque duplicamos), resetea sin salto visible
                const half = el.scrollWidth / 2;
                if (el.scrollLeft >= half) {
                    el.scrollLeft -= half;
                }
            }
            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isHovering, safeImages.length]);

    if (!safeImages.length) return null;

    return (
        <section className="w-full">
            <div
                className="
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50
          ring-1 ring-black/5
          shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]
        "
            >
                {/* Fade en bordes */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

                {/* Glow suave */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-200/35 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-cyan-200/35 blur-3xl" />

                <div className="px-4 sm:px-6 py-5 sm:py-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                                Inspiración & Resultados
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600">
                                Desliza o deja que se mueva suavemente ✨
                            </p>
                        </div>

                        <span className="hidden sm:inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-black/5 backdrop-blur">
              600×300
            </span>
                    </div>

                    {/* Track */}
                    <div
                        ref={trackRef}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="
              relative flex gap-4
              overflow-x-auto scroll-smooth
              snap-x snap-mandatory
              pb-3
              [-ms-overflow-style:none] [scrollbar-width:none]
            "
                        style={{
                            WebkitOverflowScrolling: "touch",
                        }}
                    >
                        {/* Ocultar scrollbar en WebKit */}
                        <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

                        {loopImages.map((src, idx) => (
                            <figure
                                key={`${src}-${idx}`}
                                className="
                  snap-start shrink-0
                  w-[88%] sm:w-[520px] lg:w-[600px]
                "
                            >
                                <div
                                    className="
                    group relative overflow-hidden rounded-2xl
                    bg-white/70 ring-1 ring-black/5 backdrop-blur
                    shadow-[0_12px_30px_-18px_rgba(0,0,0,0.45)]
                  "
                                >
                                    {/* Imagen 2:1 (600x300) */}
                                    <div className="relative w-full aspect-[2/1]">
                                        <img
                                            src={src}
                                            alt={`slide-${idx + 1}`}
                                            className="
                        absolute inset-0 h-full w-full object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-[1.03]
                      "
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        {/* overlay suave */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                                    </div>

                                    {/* pie minimal */}
                                    <figcaption className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-slate-600">
                                                Slide <span className="font-semibold text-slate-800">{(idx % safeImages.length) + 1}</span> /{" "}
                                                <span className="font-semibold text-slate-800">{safeImages.length}</span>
                                            </div>

                                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-70" />
                                        </div>
                                    </figcaption>
                                </div>
                            </figure>
                        ))}
                    </div>

                    {/* hint móvil */}
                    <div className="mt-2 sm:hidden text-[11px] text-slate-500">
                        Tip: desliza con el dedo →
                    </div>
                </div>
            </div>
        </section>
    );
}