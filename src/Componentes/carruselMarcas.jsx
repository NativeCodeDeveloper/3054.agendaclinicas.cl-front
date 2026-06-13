"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

export const Case1 = () => {
    const [api, setApi] = useState();
    const [current, setCurrent] = useState(0);

    // Array con las marcas/logos reales
    const logos = [
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoGates.png", alt: "Gates", width: 140, height: 100 },
        { src: "/logoMaxus.jpg", alt: "Maxus", width: 120, height: 100 },
        { src: "/logoLuk.png", alt: "LuK", width: 120, height: 100 },
        { src: "/logoWega.png", alt: "Wega", width: 120, height: 100 },
        { src: "/logoSaic.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoValeo.png", alt: "SAIC", width: 140, height: 100 },
        { src: "/logoLitens.jpeg", alt: "SAIC", width: 140, height: 100 },
    ];

    useEffect(() => {
        if (!api) {
            return;
        }

        setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 2500);
    }, [api, current]);

    return (
        <div className="w-full py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            {/* Elementos decorativos de fondo premium */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col gap-16">
                    {/* Header Section Premium */}
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge Premium */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200/60">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-sm font-semibold text-blue-900 uppercase tracking-wider">
                                Partners Certificados
                            </span>
                        </div>

                        {/* Título Premium */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent mb-6">
                            Excelencia en Cada Marca
                        </h2>

                        {/* Descripción Premium */}
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                            Alianzas estratégicas con los líderes mundiales en repuestos automotrices,
                            garantizando <span className="font-semibold text-blue-800">calidad superior</span> y
                            <span className="font-semibold text-blue-800"> rendimiento excepcional</span>
                        </p>

                        {/* Línea decorativa */}
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-300" />
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-300" />
                        </div>
                    </div>

                    {/* Carousel Section Premium */}
                    <div className="relative">
                        <Carousel setApi={setApi} className="w-full">
                            <CarouselContent className="-ml-6">
                                {logos.map((logo, index) => (
                                    <CarouselItem className="pl-6 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6" key={index}>
                                        {/* Tarjeta Premium con efectos glassmorphism */}
                                        <div className="group relative">
                                            {/* Resplandor al hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Tarjeta principal */}
                                            <div className="relative flex items-center justify-center h-32 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 p-6 hover:-translate-y-1">
                                                {/* Borde interior decorativo */}
                                                <div className="absolute inset-1 rounded-xl border border-blue-50/50" />

                                                {/* Logo */}
                                                <Image
                                                    src={logo.src}
                                                    alt={logo.alt}
                                                    width={logo.width}
                                                    height={logo.height}
                                                    className="object-contain max-h-20 w-auto relative z-10 transition-all duration-500 group-hover:scale-110"
                                                />

                                                {/* Shine effect premium */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        {/* Gradient Overlays Premium con azul */}
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-50 via-white/50 to-transparent pointer-events-none z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-50 via-white/50 to-transparent pointer-events-none z-10" />
                    </div>

                    {/* Footer Premium - Mensaje de confianza */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full shadow-lg shadow-blue-900/30">
                            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold text-white">
                                Respaldados por más de 25 años de experiencia
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
