"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {router} from "next/client";
import {useRouter} from "next/navigation";

/**
 * CarruselPortadaMoviles
 * - Optimizado para móviles
 * - Acepta array de strings (urls)
 * - Imágenes siempre completas (sin cortes) usando object-contain
 * - Soporta swipe (touch)
 */
export default function CarruselPortadaMoviles({
  images = [],
  autoPlay = true,
  intervalMs = 4500,
  className = "",
}) {
  const list = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const router = useRouter();

  function irAgendaMoviles() {
      router.push("/AgendaProceso");
  }

  // Touch handling
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const hasItems = list.length > 0;

  const goTo = (i) => {
    if (!hasItems) return;
    const next = (i + list.length) % list.length;
    setIndex(next);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay (pausa si hay 0/1 imagen)
  useEffect(() => {
    if (!autoPlay || list.length <= 1) return;

    // clear
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setIndex((curr) => (curr + 1) % list.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoPlay, intervalMs, list.length]);

  // Mantener index válido si cambia el array
  useEffect(() => {
    if (index >= list.length) setIndex(0);
  }, [list.length, index]);

  const onTouchStart = (e) => {
    if (!hasItems) return;
    touchStartX.current = e.touches?.[0]?.clientX ?? 0;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e) => {
    if (!hasItems) return;
    const x = e.touches?.[0]?.clientX ?? 0;
    touchDeltaX.current = x - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (!hasItems) return;

    // Umbral para swipe
    const threshold = 50;
    const dx = touchDeltaX.current;

    if (dx > threshold) prev();
    if (dx < -threshold) next();

    touchStartX.current = 0;
    touchDeltaX.current = 0;
  };

  return (
    <section className={`w-full ${className}`}>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-white sm:bg-slate-900/40"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/*
          Contenedor con ratio móvil. Ajusta el ratio si tu portada es distinta.
          - 1808x669 ~ 2.70:1
          - Aquí usamos un ratio más común en mobile para que no quede aplastado.
          Si quieres EXACTO 1808x669 en mobile, cambia a aspect-[1808/669].
        */}
        <div className="relative w-full aspect-[1808/669] sm:hidden">
          {hasItems ? (
            <div
              className="flex h-full w-full transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {list.map((src, i) => (
                <div key={`${src}-${i}`} className="h-full w-full shrink-0 bg-white">
                  <img
                    src={src}
                    alt={`portada-${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-contain object-top"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600 text-sm bg-white">
              No hay imágenes para mostrar
            </div>
          )}
          <div className="block md:hidden w-full flex justify-center mt-2">
            <button
onClick={()=> irAgendaMoviles()}
                className="p-2 border rounded-full border-indigo-600 w-80">
              <span className="text-base md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                AGENDA TU EVALUACION
              </span>
            </button>
          </div>

          {/* Removed CTA button */}

          {/* Removed Dots */}

          {/* Removed Arrows */}
        </div>

        {/*
          Si lo renderizas en pantallas mayores, puedes ocultarlo (default)
          o reutilizar tu otro carrusel de desktop.
        */}
        <div className="hidden sm:flex items-center justify-center p-6 text-white/70 text-sm">
          Este carrusel está optimizado para móviles (sm:hidden).
        </div>
      </div>
    </section>
  );
}