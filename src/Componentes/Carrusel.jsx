"use client";

import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

function ControlledCarousel({ imagen1, imagen2, imagen3, imagen4, interval = 3000, transitionDuration = 600 }) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Filtramos imágenes no válidas (undefined, null, "")
  const images = [imagen1, imagen2, imagen3, imagen4].filter(src => typeof src === 'string' && src.trim() !== '');

  return (
    <div className="w-full h-full max-h-[600px] overflow-hidden rounded-xl">
      {/* Sobrescribir la duración de transición del carousel (Bootstrap usa .carousel-item { transition: transform .6s ... }) */}
      <style jsx global>{`
        /* Ajusta la duración de la animación de slide (en ms) */
        .carousel-item {
          transition: transform ${transitionDuration}ms ease-in-out !important;
        }
      `}</style>

      {images.length === 0 ? (
        <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 flex items-center justify-center rounded-lg">
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      ) : (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={interval} className="w-full h-full">
          {images.map((src, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="w-full h-[300px] md:h-[420px] lg:h-[500px] object-cover rounded-lg"
                src={src}
                alt={`Slide ${idx + 1}`}
              />
              <Carousel.Caption>

              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default ControlledCarousel;