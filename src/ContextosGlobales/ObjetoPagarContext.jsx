"use client"
import {useState, useEffect, createContext, useContext} from "react";
const ObjetoPagarContext = createContext(null);

export default function ObjetoPagarProvider({ children }) {
    const [objetoDePago, setObjetoDePago] = useState([]);

    function agregarObjetosDePago(objetoNuevo) {
        setObjetoDePago((objetosPrevios) => [...objetosPrevios, objetoNuevo]);
    }
    return (
        <ObjetoPagarContext.Provider value={[objetoDePago, setObjetoDePago]}>
            {children}
        </ObjetoPagarContext.Provider>
    )
}

export const useObjetosPagosGlobales = () => {
    const contexto = useContext(ObjetoPagarContext);
    if (!contexto) {
        return console.log("No se puede usar el carriro verificar los compmponetes de context");
    } else {
        return contexto;
    }}