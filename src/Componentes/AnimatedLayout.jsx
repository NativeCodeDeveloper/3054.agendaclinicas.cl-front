// src/components/AnimatedLayout.jsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

export function AnimatedLayout({ children }) {
    // FIX: usePathname() funciona en SSR a diferencia de window.location.pathname
    // Con window, la key siempre era "" en el server y las transiciones nunca funcionaban.
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}