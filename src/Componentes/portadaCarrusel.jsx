"use client"; // Indica que este es un componente de cliente (necesario para hooks como useState)

import React, { useState, useEffect, useCallback } from "react";
// Importamos iconos de lucide-react. Asegurese de tener instalada esta libreria.
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Componente PortadaCarrusel
 *
 * Este componente crea un carrusel de imagenes "hero" de ancho completo,
 * diseñado para ser altamente estético y profesional.
 *
 * @param {Object[]} images - Array de objetos de imagen o strings.
 *                            Se recomienda: [{ url: '...', alt: '...' }]
 *                            Si pasas strings, se convertirán internamente.
 *                            Máximo 6 imágenes recomendado.
 */
export default function PortadaCarrusel({ images = [], onActionClick, loading = false }) {
    // Estado para rastrear la diapositiva actual
    const [currentIndex, setCurrentIndex] = useState(0);
    // Estado para pausar el autoplay cuando el usuario interactúa
    const [isPaused, setIsPaused] = useState(false);

    // Normalizamos las imagenes para asegurarnos de que sean un array de objetos
    // Si vienen strings => { url: string }
    // Si no hay imágenes, mostramos un estado de loading/skeleton en vez de “placeholders”.
    const normalizedImages = (images || [])
        .map((img) => (typeof img === "string" ? { url: img, alt: "" } : img))
        .filter(Boolean);

    const isLoading = loading || normalizedImages.length === 0;

    // Función para ir a la siguiente diapositiva
    const nextSlide = useCallback(() => {
        if (normalizedImages.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % normalizedImages.length);
    }, [normalizedImages.length]);

    // Función para ir a la diapositiva anterior
    const prevSlide = () => {
        if (normalizedImages.length === 0) return;
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? normalizedImages.length - 1 : prevIndex - 1
        );
    };

    // Función para ir a una diapositiva específica (dots)
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Efecto para el cambio automático de diapositivas (Autoplay)
    useEffect(() => {
        if (isPaused) return; // Si está pausado, no hacemos nada

        // Configurar el intervalo (ej: 5000ms = 5 segundos)
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        // Limpiar intervalo al desmontar o cambiar dependencias
        return () => clearInterval(interval);
    }, [isPaused, nextSlide]);

    if (isLoading) {
        return (
            <div className="relative w-full max-w-[1808px] h-[360px] sm:h-[320px] md:h-[460px] lg:h-[520px] overflow-hidden bg-gray-900 mx-auto">
                {/* Skeleton */}
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 via-white/10 to-white/5" />

                {/* Brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                {/* Indicadores falsos */}
                <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
                    <div className="w-8 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>

                {/* Borde decorativo */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
        );
    }

    return (
        // Contenedor Principal:
        // 'relative': Para posicionar botones y dots absolutamente dentro.
        // 'w-full': Ancho completo.
        // 'h-[400px] md:h-[500px] lg:h-[600px]': Altura reajustada (más baja).
        // 'overflow-hidden': Para ocultar las imágenes que están fuera de vista.
        // 'group': Para mostrar flechas solo al hacer hover.
        <div
            className="relative w-full max-w-[1808px] h-[360px] sm:h-[320px] md:h-[460px] lg:h-[520px] overflow-hidden bg-gray-900 group mx-auto"
            onMouseEnter={() => setIsPaused(true)}  // Pausar al pasar el mouse
            onMouseLeave={() => setIsPaused(false)} // Reanudar al salir
        >

            {/*
                Botón Inferior Izquierdo (Agenda tu Sesion):
                Independiente del carrusel, posición absoluta.
                Fondo blanco, texto con gradiente de indigo-500 a cyan-500.
                Responsivo: Ajuste de padding/tamaño de texto y posición.
            */}
            <button
                onClick={onActionClick}
                className=" ml-80  absolute bottom-6 -translate-x-1/2 z-30 bg-white rounded-full shadow-lg px-5 py-2.5 md:px-8 md:py-3 md:bottom-12 hover:scale-105 transition-transform duration-300 group/btn"
                aria-label="Agenda tu Sesion"
            >
                <span className="hidden md:block text-base md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                    AGENDA TU EVALUACION GRATUITA
                </span>

                <span className="block md:hidden text-base md:text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                    AGENDA TU EVALUACION
                </span>
            </button>

            {/*
        Contenedor de Diapositivas:
        Usamos una transición de transform (translate) para el efecto de deslizamiento.
        'flex': Pone las imágenes en fila.
        'transition-transform': Suaviza el movimiento.
        'duration-700': Duración de 700ms para un feel "premium".
        'ease-out': Curva de velocidad suave.
      */}
            <div
                className="flex w-full h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {normalizedImages.map((image, index) => (
                    // Cada Slide individual
                    <div key={index} className="min-w-full w-full h-full relative">
                        {/*
              Imagen:
              'w-full h-full': Ocupa todo el slide.
              'object-cover': PROPIEDAD CLAVE.
               Hace que la imagen cubra todo el espacio sin deformarse (recortando los bordes si es necesario).
               Para evitar que en movil se recorte "mal", se usa 'object-center' para centrar el foco.
               NOTA: Si se requiere que NO se recorte NADA en movil, se debería usar 'object-contain',
               pero eso dejaría espacios vacíos. 'object-cover' es el estándar estético moderno.
            */}
                        <img
                            src={typeof image === 'string' ? image : image.url}
                            alt={image.alt || `Slide ${index + 1}`}
                            className="w-full h-full object-cover object-center"
                        />

                        {/*
              Overlay (Opcional):
              Un degradado sutil en la parte inferior para que el texto o los controles resalten.
            */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                    </div>
                ))}
            </div>

            {/*
        Flecha Izquierda (Anterior):
        Botón absoluto, centrado verticalmente, con glassmorphism.
      */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                aria-label="Previous Slide"
            >
                <ChevronLeft size={32} strokeWidth={1.5} />
            </button>

            {/*
        Flecha Derecha (Siguiente):
        Similar a la izquierda pero a la derecha.
      */}
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                aria-label="Next Slide"
            >
                <ChevronRight size={32} strokeWidth={1.5} />
            </button>

            {/*
        Indicadores (Dots/Paginación):
        Ubicados abajo al centro. Muestra qué slide está activo.
      */}
            <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
                {normalizedImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`
              w-3 h-3 rounded-full transition-all duration-300 
              ${currentIndex === index
                            ? "bg-white w-8" // El activo es más ancho (pill shape)
                            : "bg-white/50 hover:bg-white/80"} 
            `}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/*
        Estilo de borde inferior (Opcional, decorativo como en referencia)
      */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
    );
}