
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function MotionCards({ children, interval = 300, className }) {
    const items = Array.isArray(children) ? children : [children];
    return (
        <div className={cn("relative flex flex-col gap-4 w-full", className)}>
            {items.map((child, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.7,
                        delay: idx * (interval / 1000),
                        ease: "easeInOut",
                    }}
                    style={{
                        background: "rgba(255,255,255,0.55)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "1.5rem",
                        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
                        border: "1px solid rgba(255,255,255,0.4)",
                        padding: "1rem 1.5rem",
                        marginBottom: "0.5rem",
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </div>
    );
}
export default MotionCards;

export function MotionCardContent({ children, className }) {
    return (
        <div className={cn("items-center", className)}>{children}</div>
    );
}
