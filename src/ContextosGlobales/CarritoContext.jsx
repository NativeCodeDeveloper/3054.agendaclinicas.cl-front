"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);

export default function CarritoProvider({ children }) {

    // 1. Cargar carrito desde localStorage solo en el cliente
    const [carrito, setCarrito] = useState(() => {
        if (typeof window === "undefined") return []; // SSR safety
        try {
            const saved = localStorage.getItem("carrito");
            return saved ? JSON.parse(saved) : [];
        } catch (err) {
            console.error("Error al leer localStorage:", err);
            return [];
        }
    });

    // 2. Guardar carrito en localStorage cada vez que cambie
    useEffect(() => {
        try {
            localStorage.setItem("carrito", JSON.stringify(carrito));
        } catch (err) {
            console.error("Error al guardar en localStorage:", err);
        }
    }, [carrito]);

    return (
        <CarritoContext.Provider value={[carrito, setCarrito]}>
            {children}
        </CarritoContext.Provider>
    );
}

export const useCarritoGlobal = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error("useCarritoGlobal debe usarse dentro de un <CarritoProvider>");
    }
    return context;
};