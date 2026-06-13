"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

/**
 * Carrusel de imágenes grande, limpio y sin bordes
 */
export function CarruselOfertas({
    title = "Trusted by thousands of businesses worldwide",
    images = [],
    intervalMs = 1800,
    itemClassName = "basis-full sm:basis-1/2 lg:basis-1/4",
    imageClassName = "",
    ctaText = "",
    onCtaClick = undefined,
}) {
    const items = useMemo(() => {
        const arr = images ?? [];

        return arr
            .filter((src) => typeof src === "string" && src.trim().length > 0)
            .map((src, i) => ({
                src,
                alt: `Imagen ${i + 1}`,
            }));
    }, [images]);

    // @ts-ignore
    const [api, setApi] = useState();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api || !items.length) return;

        const id = setTimeout(() => {
            const lastIndex = api.scrollSnapList().length - 1;
            const nextIndex =
                api.selectedScrollSnap() >= lastIndex
                    ? 0
                    : api.selectedScrollSnap() + 1;

            api.scrollTo(nextIndex);
            setCurrent(nextIndex);
        }, intervalMs);

        return () => clearTimeout(id);
    }, [api, current, intervalMs, items.length]);

    return (
        <section className="w-full py-20 lg:py-32">
            <div className="container mx-auto">
                <div className="flex flex-col gap-10">
                    <h2 className="text-xl md:text-3xl lg:text-5xl tracking-tight font-regular text-left max-w-2xl">
                        {title}
                    </h2>

                    <Carousel setApi={setApi} className="w-full">
                    <CarouselContent className="-ml-0 sm:-ml-6">
                            {items.map((img, index) => (
                                <CarouselItem
                                    key={`${img.src}-${index}`}
                                    className={`${itemClassName} pl-0 sm:pl-6`}
                                >
                                    <div className="relative w-full overflow-hidden rounded-2xl bg-white/5">
                                        <div className="relative w-full h-[60vh] sm:h-72 md:h-80 lg:h-[22rem]">
                                            <img
                                                src={img.src}
                                                alt={img.alt}
                                                loading={index < 4 ? "eager" : "lazy"}
                                                className={`
                                                    w-full h-full
                                                    ${imageClassName}
                                                    object-cover object-center
                                                    sm:transition-transform sm:duration-700 sm:hover:scale-110
                                                `}
                                            />

                                            {ctaText && index === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={onCtaClick}
                                                    className="
                                                        absolute
                                                        bottom-3 left-1/2 -translate-x-1/2
                                                        sm:bottom-5
                                                        rounded-full
                                                        bg-white/95 text-slate-900
                                                        px-5 py-3
                                                        text-sm sm:text-base font-semibold
                                                        shadow-lg shadow-black/10
                                                        ring-1 ring-black/10
                                                        backdrop-blur
                                                        transition
                                                        hover:bg-white
                                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                                                    "
                                                >
                                                    {ctaText}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    {!items.length && (
                        <p className="text-sm text-muted-foreground">
                            No hay imágenes para mostrar.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CarruselOfertas;