"use client"

import {createContext, useContext, useState} from "react";

const AgendaContext = createContext(null);

export default function AgendaProvider({children}) {
    const [agenda, setAgenda] = useState({
        fechaInicio:      "",
        horaInicio:       "",
        fechaFinalizacion:"",
        horaFinalizacion: "",
        /*
         * servicio: objeto con los datos de la tarifa elegida en el calendario.
         * Se guarda aquí para que el formulario del paso 2 lo reciba sin re-fetch.
         * Estructura: { id, nombre, duracion_min, precio }
         */
        servicio: null,
    });

    const setFechaInicio      = (v) => setAgenda(p => ({...p, fechaInicio: v}));
    const setHoraInicio       = (v) => setAgenda(p => ({...p, horaInicio: v}));
    const setFechaFinalizacion= (v) => setAgenda(p => ({...p, fechaFinalizacion: v}));
    const setHoraFinalizacion = (v) => setAgenda(p => ({...p, horaFinalizacion: v}));

    /**
     * Guarda el servicio/tarifa elegido desde el calendario.
     * Recibe el objeto tarifa tal como viene del backend:
     *   { id_tarifaProfesional, nombreServicio, duracion_min, precio, ... }
     * Pasar null limpia la selección.
     */
    const setServicio = (tarifa) => setAgenda(p => ({
        ...p,
        servicio: tarifa
            ? {
                id:          tarifa.id_tarifaProfesional,
                nombre:      tarifa.nombreServicio,
                duracion_min: Number(tarifa.duracion_min) || 60,
                precio:      tarifa.precio ?? 0,
              }
            : null,
    }));

    const value = {
        /* valores */
        fechaInicio:      agenda.fechaInicio,
        horaInicio:       agenda.horaInicio,
        fechaFinalizacion:agenda.fechaFinalizacion,
        horaFinalizacion: agenda.horaFinalizacion,
        servicio:         agenda.servicio,

        /* setters */
        setFechaInicio,
        setHoraInicio,
        setFechaFinalizacion,
        setHoraFinalizacion,
        setServicio,

        /* alias de compatibilidad hacia atrás */
        horaFin:    agenda.horaFinalizacion,
        setHoraFin: setHoraFinalizacion,
    };

    return (
        <AgendaContext.Provider value={value}>
            {children}
        </AgendaContext.Provider>
    );
}

export function useAgenda() {
    const ctx = useContext(AgendaContext);
    if (!ctx) throw new Error("useAgenda debe usarse dentro de <AgendaProvider>");
    return ctx;
}
