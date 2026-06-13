"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealOnScroll({ children, className = "", delayClass = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.16 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "reveal-on-scroll",
        delayClass,
        visible ? "is-visible" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
