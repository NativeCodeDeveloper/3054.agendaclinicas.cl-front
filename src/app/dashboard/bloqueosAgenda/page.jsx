'use client'
import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {SelectDinamic} from "@/Componentes/SelectDinamic";
import {InputTextDinamic} from "@/Componentes/InputTextDinamic";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import * as React from "react";
import ToasterClient from "@/Componentes/ToasterClient";
import {InfoButton} from "@/Componentes/InfoButton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



export default function BloqueosAgendas() {
const API = process.env.NEXT_PUBLIC_API_URL;
const [listaProfesionales, setListaProfesionales] = useState([]);
const [id_profesional, setId_profesional] = useState("");
    const [fechaInicio, setfechaInicio] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [motivo, setMotivo] = useState("");
    const [listaBloqueos, setListaBloqueos] = useState([]);
    const [modalBloqueoAbierto, setModalBloqueoAbierto] = useState(false);
    const [bloqueoSeleccionado, setBloqueoSeleccionado] = useState(null);
    const [selectorFinalizacionKey, setSelectorFinalizacionKey] = useState(0);

    const mensajeFechaFinalizacionInvalida = "La fecha de termino NUNCA puede ser mas antigua que la fecha de inicio.";


    function formatearFechaTabla(fechaISO) {
        if (!fechaISO) return "";
        const partes = fechaISO.slice(0, 10).split("-");
        if (partes.length !== 3) return fechaISO;
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function formatearFechaLocal(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }

    function convertirFechaLocal(fechaISO) {
        if (!fechaISO) return null;
        const [year, month, day] = fechaISO.slice(0, 10).split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function fechaFinalizacionEsAnterior(fechaInicioValidar, fechaFinalizacionValidar) {
        const inicio = convertirFechaLocal(fechaInicioValidar);
        const finalizacion = convertirFechaLocal(fechaFinalizacionValidar);
        return Boolean(inicio && finalizacion && finalizacion < inicio);
    }

    const manejarFechaHoraInicio = (dateTime) => {
        const nuevaFechaInicio = formatearFechaLocal(dateTime);

        if (fechaFinalizacionEsAnterior(nuevaFechaInicio, fechaFinalizacion)) {
            setfechaFinalizacion("");
            setHoraFinalizacion("");
            setSelectorFinalizacionKey((prev) => prev + 1);
            toast.error(mensajeFechaFinalizacionInvalida);
        }

        setfechaInicio(nuevaFechaInicio);
        setHoraInicio(dateTime.toTimeString().slice(0, 8));
    };

    const manejarFechaHoraFinalizacion = (dateTime) => {
        const nuevaFechaFinalizacion = formatearFechaLocal(dateTime);

        if (fechaFinalizacionEsAnterior(fechaInicio, nuevaFechaFinalizacion)) {
            setSelectorFinalizacionKey((prev) => prev + 1);
            return toast.error(mensajeFechaFinalizacionInvalida);
        }

        setfechaFinalizacion(nuevaFechaFinalizacion);
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8));
    };

    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function abrirModalBloqueo(bloqueo) {
        setBloqueoSeleccionado(bloqueo);
        setModalBloqueoAbierto(true);
    }

    function cerrarModalBloqueo() {
        setModalBloqueoAbierto(false);
        setBloqueoSeleccionado(null);
    }

    async function buscarPorProfesionalBloqueo() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');

            }else{
                const respustaBackend = await res.json();

                if(respustaBackend){
                    setListaProfesionales(respustaBackend);

                }else{
                    return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
                }
            }
        }catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        buscarPorProfesionalBloqueo()
    },[])



    async function insertarBloqueoHorario(id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo) {
        try {

        if(!fechaInicio ||!fechaFinalizacion||!horaInicio||!horaFinalizacion||!motivo || !id_profesional){
            return toast.error("Deben completarse todos los campos para ingresar el bloqueo al sistema.")
        }

        if (fechaFinalizacionEsAnterior(fechaInicio, fechaFinalizacion)) {
            return toast.error(mensajeFechaFinalizacionInvalida);
        }

        const res = await fetch(`${API}/bloqueoAgenda/InsertarBloqueo`,{
            method: 'POST',
            headers: {Accept: 'application/json',
            'Content-Type': 'application/json'},
            body: JSON.stringify({id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo}),
            mode: 'cors'
        })

            if (!res.ok) {
                return toast.error("Verifique que no haya una hora o bloqueo previo.")
            }else{

                const respuestaBackend = await res.json();
                if(respuestaBackend.message ===true){
                    setMotivo("");
                    setId_profesional("");
                    setfechaInicio("");
                    setfechaFinalizacion("");
                    setHoraInicio("");
                    setHoraFinalizacion("");
                    await verTodosLosBloqueos();
                    return toast.success('Se ha ingresado con exito el bloqueo al sistema. ')
                }else if (respuestaBackend.message === "reservaExistente") {
                    return toast.error("No puede bloquear un horario donde ya existen pacientes agendados.");
                }else if (respuestaBackend.message === "bloqueoExistente") {
                    return toast.error("Verifique que no haya una hora o bloqueo previo.");
                }else {
                    return toast.error("Verifique que no haya una hora o bloqueo previo.")
                }

            }

        }catch (error) {
            return toast.error("Verifique que no haya una hora o bloqueo previo.")
        }
    }

    async function verTodosLosBloqueos(){
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarTodos`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })

            const respuestaBackend = await res.json();
            setListaBloqueos(respuestaBackend);


        }catch (error) {
            return toast.error('No fue posible cargar los datos de los bloqueos')
        }
    }

    useEffect(() => {
        verTodosLosBloqueos()
    },[])




    async function eliminarBloqueo(id_bloqueo) {
        try {
            if(!id_bloqueo){
                return toast.error('Debe seleccionar el bloqueo que desea eliminar.');
            }
            const res = await fetch(`${API}/bloqueoAgenda/eliminarBloqueo`,{
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({id_bloqueo}),
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error("No se ha podido eliminar el bloqueo del sistema. Intente mas tarde.")
            }else{

                const respuestaBackend = await res.json();
                if(respuestaBackend.message ===true){
                    await verTodosLosBloqueos();
                    cerrarModalBloqueo();
                    return toast.success('Se ha eliminado con exito el bloqueo del sistema. ')
                }else {
                    return toast.error("Verifique que no haya una hora o bloqueo previo.")
                }
            }
        }catch (error) {
            return toast.error("No se ha podido eliminar el bloqueo de horario. Contacte a soporte TI de nativecode ")
        }
    }


    async function filtrarPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`,{
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({id_profesional}),
                mode: 'cors'
            })
                const respuestaBackend = await res.json();
                setListaBloqueos(respuestaBackend);

        }catch (error) {
            return toast.error("No se ha podido seleccionar el listado de bloqueos de horarios. Contacte a soporte TI de nativecode ")
        }
    }

    useEffect(() => {
        filtrarPorProfesional(id_profesional)
    },[id_profesional])

    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
            <ToasterClient />
            
            <div className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-10 2xl:max-w-none">
                
                {/* ── Header ── */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">Configuración de Disponibilidad</p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Bloqueo de Agenda</h1>
                        <p className="mt-2 text-[13px] text-slate-500 max-w-2xl leading-relaxed">
                            Gestiona los períodos de inactividad de los profesionales. Los bloqueos evitan que se agenden citas en rangos específicos por vacaciones, descansos o capacitaciones.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <InfoButton informacion={"Para bloquear un horario, selecciona al profesional, define el rango y el motivo. Recuerda que los bloqueos no son editables; si cometes un error, deberás eliminarlo y crearlo nuevamente."}/>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── Columna Izquierda: Formulario (5/12) ── */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-6 border-b border-slate-100 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-[#6E56CF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">Nuevo Bloqueo</h2>
                                    <p className="text-[11px] text-slate-400 font-medium">Define el rango de inactividad</p>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Profesional */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Profesional</label>
                                    <SelectDinamic
                                        value={id_profesional}
                                        onChange={(e) => setId_profesional(e.target.value)}
                                        options={listaProfesionales.map(p => ({
                                            value: p.id_profesional,
                                            label: p.nombreProfesional
                                        }))}
                                        placeholder="Selecciona un profesional"
                                    />
                                </div>

                                {/* Rango */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Desde</label>
                                        <ShadcnFechaHora onChange={manejarFechaHoraInicio} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Hasta</label>
                                        <ShadcnFechaHora
                                            key={selectorFinalizacionKey}
                                            onChange={manejarFechaHoraFinalizacion}
                                            minDate={convertirFechaLocal(fechaInicio)}
                                            onInvalidDate={() => toast.error(mensajeFechaFinalizacionInvalida)}
                                        />
                                    </div>
                                </div>

                                {/* Motivo */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Motivo del bloqueo</label>
                                    <InputTextDinamic
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        placeholder="Ej: Vacaciones, Congreso..."
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => insertarBloqueoHorario(id_profesional,fechaInicio,horaInicio,fechaFinalizacion,horaFinalizacion,motivo)}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#6E56CF] text-white text-sm font-bold rounded-2xl hover:bg-[#5b45bc] transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Ingresar Bloqueo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Columna Derecha: Listado (7/12) ── */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-800">Bloqueos Activos</h2>
                                        <p className="text-[11px] text-slate-400 font-medium">Listado histórico y actual</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={verTodosLosBloqueos}
                                    className="text-[11px] font-bold text-[#6E56CF] uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
                                >
                                    Refrescar Lista
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <Table className="w-full table-fixed">
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-slate-100">
                                            <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3 w-[30%]">Profesional</TableHead>
                                            <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3 w-[22%]">Motivo</TableHead>
                                            <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3 w-[20%]">Inicio</TableHead>
                                            <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3 w-[20%]">Fin</TableHead>
                                            <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3 w-[8%] text-center">Ver</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listaBloqueos.length > 0 ? (
                                            listaBloqueos.map((bloqueo) => (
                                                <TableRow
                                                    key={bloqueo.id_bloqueo}
                                                    className="border-slate-50 hover:bg-violet-50/30 transition-colors cursor-pointer"
                                                    onClick={() => abrirModalBloqueo(bloqueo)}
                                                >
                                                    <TableCell className="py-3 pr-2">
                                                        <span className="text-[12px] font-bold text-slate-700 truncate block">{bloqueo.nombreProfesional}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3 pr-2">
                                                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-1 rounded-lg truncate block max-w-full">{bloqueo.motivo}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3 pr-2">
                                                        <span className="text-[12px] font-semibold text-slate-600 block">{formatearFechaTabla(bloqueo.fechaInicio)}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{(bloqueo.horaInicio ?? "").slice(0, 5)}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3 pr-2">
                                                        <span className="text-[12px] font-semibold text-slate-600 block">{formatearFechaTabla(bloqueo.fechaFinalizacion)}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium">{(bloqueo.horaFinalizacion ?? "").slice(0, 5)}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-center">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); abrirModalBloqueo(bloqueo); }}
                                                            className="inline-flex items-center justify-center h-8 w-8 rounded-xl text-[#6E56CF] hover:bg-violet-50 transition-all active:scale-95"
                                                            title="Ver detalle del bloqueo"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-400">No hay bloqueos registrados</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalBloqueoAbierto && bloqueoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={cerrarModalBloqueo} />
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        {/* Header — igual que los cards de la página */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-[#6E56CF]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800">Detalle del Bloqueo</h3>
                                <p className="text-[11px] text-slate-400 font-medium">Revisa la información y elimina si corresponde</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 p-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profesional</label>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-[13px] font-semibold text-slate-700">
                                    {bloqueoSeleccionado.nombreProfesional}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Motivo</label>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-[13px] text-slate-700">
                                    {bloqueoSeleccionado.motivo}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Inicio</label>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-[13px] text-slate-700">
                                        <span className="block font-semibold text-slate-800">{formatearFechaTabla(bloqueoSeleccionado.fechaInicio)}</span>
                                        <span className="mt-0.5 block text-[11px] font-bold text-slate-400">{bloqueoSeleccionado.horaInicio}</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fin</label>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-[13px] text-slate-700">
                                        <span className="block font-semibold text-slate-800">{formatearFechaTabla(bloqueoSeleccionado.fechaFinalizacion)}</span>
                                        <span className="mt-0.5 block text-[11px] font-bold text-slate-400">{bloqueoSeleccionado.horaFinalizacion}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                            <button
                                onClick={cerrarModalBloqueo}
                                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-50 active:scale-[0.98]"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => eliminarBloqueo(bloqueoSeleccionado.id_bloqueo)}
                                className="rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-rose-700 active:scale-[0.98]"
                            >
                                Eliminar Bloqueo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
