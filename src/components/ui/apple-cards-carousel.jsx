"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/use-outside-click";

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0, className }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = useCallback(() => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const isMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  const handleCardClose = (index) => {
    if (!carouselRef.current) return;

    const cardWidth = isMobile() ? 230 : 384;
    const gap = isMobile() ? 4 : 8;
    const scrollPosition = (cardWidth + gap) * (index + 1);

    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    setCurrentIndex(index);
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className={cn("relative w-full", className)}>
        <div
          className="hide-scrollbar flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className="absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l from-[#efedeb] to-transparent" />

          <div className="mx-auto flex max-w-7xl flex-row justify-start gap-4 pl-4">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                key={`card-${index}`}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mr-10 flex justify-end gap-2">
          <button
            type="button"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Card anterior"
          >
            <ChevronLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            type="button"
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Card siguiente"
          >
            <ChevronRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({ card, index, layout = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useOutsideClick(containerRef, () => handleClose());

  return (
    <>
      <AnimatePresence>
        {open ? (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 md:p-10"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="sticky right-0 top-4 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black"
                onClick={handleClose}
                aria-label="Cerrar tarjeta"
              >
                <X className="h-5 w-5 text-neutral-100" />
              </button>

              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black"
              >
                {card.category}
              </motion.p>

              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl"
              >
                {card.title}
              </motion.p>

              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left text-sm font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>

          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left text-xl font-semibold [text-wrap:balance] text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>

        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="absolute inset-0 z-10 object-cover"
          sizes="(max-width: 768px) 224px, 384px"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({ className, alt, ...rest }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      alt={alt || "Background of a beautiful view"}
      {...rest}
    />
  );
};
