"use client"

import {Textarea} from "@/components/ui/textarea";
import {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from "react-hot-toast";
import {ShadcnInput} from "@/Componentes/shadcnInput2";
import {useRouter} from "next/navigation";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";

function parsearDatosDinamicos(datos) {
    if (!datos) return null
    if (typeof datos === "string") {
        try { return JSON.parse(datos) } catch { return null }
    }
    return typeof datos === "object" ? datos : null
}

function agruparPorCategoria(datos) {
    const categoriasMap = {}
    Object.keys(datos).forEach(key => {
        if (key === "_plantillaNombre") return
        const entry = datos[key]
        if (!entry || typeof entry !== "object" || !entry.nombreCategoria) return
        const catNombre = entry.nombreCategoria
        if (!categoriasMap[catNombre]) {
            categoriasMap[catNombre] = { nombre: catNombre, orden: entry.categoriaOrden || 0, campos: [] }
        }
        categoriasMap[catNombre].campos.push({ nombre: entry.nombreCampo, valor: entry.valor, orden: entry.campoOrden || 0 })
    })
    return Object.values(categoriasMap)
        .sort((a, b) => a.orden - b.orden)
        .map(cat => ({ ...cat, campos: cat.campos.sort((a, b) => a.orden - b.orden) }))
}

function transformarPlantilla(filas) {
    if (!filas || filas.length === 0) return null
    const primera = filas[0]
    const categoriasMap = {}

    filas.forEach(fila => {
        if (!fila.id_categoria) return
        if (!categoriasMap[fila.id_categoria]) {
            categoriasMap[fila.id_categoria] = {
                id_categoria: fila.id_categoria,
                nombre: fila.categoria_nombre,
                orden: fila.categoria_orden,
                campos: []
            }
        }
        if (fila.id_campo) {
            categoriasMap[fila.id_categoria].campos.push({
                id_campo: fila.id_campo,
                nombre: fila.campo_nombre,
                requerido: fila.requerido,
                orden: fila.campo_orden
            })
        }
    })

    return {
        id_plantilla: primera.id_plantilla,
        nombre: primera.plantilla_nombre,
        categorias: Object.values(categoriasMap).sort((a, b) => a.orden - b.orden)
    }
}

export default function EdicionFichaClinica() {
    const {id_ficha} = useParams();
    const [dataFicha, setdataFicha] = useState([]);

    // Campos legacy (para fichas sin plantilla)
    const [tipoAtencion, settipoAtencion] = useState("");
    const [anotacionConsulta, setanotacionConsulta] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");

    // Plantilla dinámica
    const [plantillas, setPlantillas] = useState([])
    const [idPlantilla, setIdPlantilla] = useState(null)
    const [plantillaCompleta, setPlantillaCompleta] = useState(null)
    const [datosDinamicos, setDatosDinamicos] = useState({})

    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    function retroceder(id_paciente) {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    function formatearFecha(fecha) {
        if (!fecha) {
            return null;
        } else {
            const date = new Date(fecha);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1);
            const day = String(date.getDate());
            return `${day}-${month}-${year}`;
        }
    }

    async function listarPlantillas() {
        try {
            const res = await fetch(`${API}/fichaPlantilla/listarPlantillas`)
            if (!res.ok) return
            const data = await res.json()
            if (Array.isArray(data)) setPlantillas(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function cargarPlantillaCompleta(id_plantilla) {
        try {
            const res = await fetch(`${API}/fichaPlantilla/obtenerPlantillaCompleta`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_plantilla})
            })

            if (!res.ok) return

            const filas = await res.json()
            const estructura = transformarPlantilla(filas)
            setPlantillaCompleta(estructura)
        } catch (error) {
            console.log(error)
        }
    }

    async function seleccionarPlantilla(id_plantilla) {
        setIdPlantilla(id_plantilla || null)
        setDatosDinamicos({})
        setPlantillaCompleta(null)
        if (!id_plantilla) return
        await cargarPlantillaCompleta(id_plantilla)
    }

    async function actualizarFicha() {
        try {
            if (!id_ficha) {
                return toast.error('Falta el identificador de la ficha');
            }

            if (!idPlantilla) {
                return toast.error('Debe seleccionar una plantilla');
            }

            if (!plantillaCompleta) {
                return toast.error('Espere a que se cargue la plantilla');
            }

            // Validar campos requeridos
            {
                const camposFaltantes = []
                plantillaCompleta.categorias.forEach(cat => {
                    cat.campos.forEach(campo => {
                        if (campo.requerido === 1 && !datosDinamicos[campo.id_campo]?.trim()) {
                            camposFaltantes.push(campo.nombre)
                        }
                    })
                })

                if (camposFaltantes.length > 0) {
                    return toast.error(`Debe completar los campos obligatorios: ${camposFaltantes.join(", ")}`)
                }

                // Construir datosDinamicos enriquecido
                const datosEnriquecidos = {
                    _plantillaNombre: plantillaCompleta.nombre
                }
                plantillaCompleta.categorias.forEach(cat => {
                    cat.campos.forEach(campo => {
                        if (datosDinamicos[campo.id_campo]) {
                            datosEnriquecidos[campo.id_campo] = {
                                valor: datosDinamicos[campo.id_campo],
                                nombreCampo: campo.nombre,
                                nombreCategoria: cat.nombre,
                                categoriaOrden: cat.orden,
                                campoOrden: campo.orden
                            }
                        }
                    })
                })

                const res = await fetch(`${API}/ficha/editarFichaPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        tipoAtencion: "",
                        motivoConsulta: "",
                        signosVitales: "",
                        observaciones,
                        anotacionConsulta: "",
                        anamnesis: "",
                        diagnostico: "",
                        indicaciones: "",
                        archivosAdjuntos: "",
                        fechaConsulta,
                        consentimientoFirmado: "",
                        id_plantilla: idPlantilla,
                        datosDinamicos: datosEnriquecidos,
                        id_ficha
                    }),
                    mode: "cors",
                    cache: "no-cache"
                });

                if (!res.ok) {
                    return toast.error("Ha ocurrido un error en la respuesta del servidor, Contacte a soporte");
                }

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    await seleccionarFichaEspecifica(id_ficha)
                    return toast.success("Ficha Clinica Actualizada!");
                } else {
                    return toast.error('No ha sido posible actualizar la ficha clinica!')
                }
            }
        } catch (error) {
            return toast.error("Ha ocurrido un error, Contacte a soporte");
        }
    }

    async function seleccionarFichaEspecifica(id_ficha) {
        try {
            const res = await fetch(`${API}/ficha/seleccionarFichaID`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors"
            })

            if (!res.ok) {
                return toast.error("No es posible ejecutar la consulta desde la base de datos cotacte a soporte");
            } else {
                const dataFichasClinicas = await res.json();
                if (Array.isArray(dataFichasClinicas)) {
                    setdataFicha(dataFichasClinicas);
                    if (dataFichasClinicas.length > 0) {
                        const f = dataFichasClinicas[0];
                        setObservaciones(f.observaciones || "");
                        setFechaConsulta(f.fechaConsulta || "");

                        if (f.id_plantilla) {
                            // Ficha con plantilla dinámica
                            setIdPlantilla(f.id_plantilla)
                            let datosRaw = {}
                            if (f.datosDinamicos) {
                                try {
                                    datosRaw = typeof f.datosDinamicos === "string" ? JSON.parse(f.datosDinamicos) : f.datosDinamicos
                                } catch (e) {
                                    datosRaw = {}
                                }
                            }
                            // Extraer solo los valores para el formulario
                            const datosSimples = {}
                            Object.keys(datosRaw).forEach(key => {
                                if (key === "_plantillaNombre") return
                                const entry = datosRaw[key]
                                datosSimples[key] = typeof entry === "object" && entry !== null ? entry.valor || "" : entry || ""
                            })
                            setDatosDinamicos(datosSimples)
                            await cargarPlantillaCompleta(f.id_plantilla)
                        } else {
                            // Ficha legacy
                            settipoAtencion(f.tipoAtencion || "");
                            setanotacionConsulta(f.anotacionConsulta || "");
                            setDiagnostico(f.diagnostico || "");
                            setIndicaciones(f.indicaciones || "");
                        }
                    }
                } else {
                    return toast.error("No se encuentras fichas clinicas disponibles con el id seleccionado");
                }
            }
        } catch (err) {
            return toast.error("Ha ocurrido un error, Contacte a soporte");
        }
    }

    useEffect(() => {
        seleccionarFichaEspecifica(id_ficha)
        listarPlantillas()
    }, [])

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_32%),radial-gradient(circle_at_right,_rgba(6,182,212,0.12),_transparent_28%),linear-gradient(180deg,_#f1f5f9_0%,_#f8fafc_55%,_#f1f5f9_100%)]">
            <ToasterClient/>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700 mb-1">Modificar registro</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Edici&oacute;n de Ficha Cl&iacute;nica
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {dataFicha.map((ficha) => (
                            <button
                                key={ficha.id_paciente ?? ficha.id_ficha}
                                onClick={() => retroceder(ficha.id_paciente)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 hover:border-slate-400 transition-all duration-150 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                Volver
                            </button>
                        ))}
                    </div>
                </div>

                {/* Datos actuales de la ficha */}
                {dataFicha.map((ficha) => (
                    <div key={ficha.id_ficha} className="mb-8 bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">
                        <div className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] px-5 md:px-6 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
                                    Datos Actuales &mdash; Ficha #{ficha.id_ficha}
                                </h2>
                            </div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm border border-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <span className="text-base font-bold text-indigo-700">{formatearFecha(ficha.fechaConsulta)}</span>
                            </span>
                        </div>

                        <div className="p-5 md:p-6">
                            {(() => {
                                const datos = parsearDatosDinamicos(ficha.datosDinamicos)
                                const plantillaNombre = datos?._plantillaNombre
                                return (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2 mb-5">
                                            {plantillaNombre ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-800">
                                                    <span className="text-indigo-500">Plantilla:</span> {plantillaNombre}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-800">
                                                    <span className="text-indigo-500">Motivo Consulta:</span> {ficha.tipoAtencion || '-'}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-100 border border-teal-200 text-xs font-medium text-teal-800">
                                                <span className="text-teal-500">Profesional:</span> {ficha.observaciones || '-'}
                                            </span>
                                        </div>

                                        {datos && plantillaNombre ? (
                                            <div className="space-y-4">
                                                {agruparPorCategoria(datos).map(categoria => (
                                                    <div key={categoria.nombre}>
                                                        <p className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-2">{categoria.nombre}</p>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {categoria.campos.map((campo, idx) => (
                                                                <div key={idx} className="flex flex-col gap-0.5 px-3 py-2.5 bg-slate-100/80 rounded-lg border border-slate-200">
                                                                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{campo.nombre}</span>
                                                                    <span className="text-sm font-medium text-slate-700 whitespace-pre-line">{campo.valor}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">Ficha sin plantilla asociada.</p>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                ))}

                {/* Formulario de edici&oacute;n */}
                <div className="bg-white border border-slate-300 rounded-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.12)] overflow-hidden">

                    <div className="border-b border-slate-200 bg-slate-100/80 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                            Actualizar Informaci&oacute;n
                        </h2>
                    </div>

                    <div className="p-5 md:p-6 space-y-5">

                        {/* Selector de Plantilla */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Plantilla de Ficha <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={idPlantilla || ""}
                                onChange={(e) => seleccionarPlantilla(e.target.value)}
                                className="w-full h-10 px-3.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-slate-700"
                            >
                                <option value="">Seleccione una plantilla...</option>
                                {plantillas.map((p) => (
                                    <option key={p.id_plantilla} value={p.id_plantilla}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha + Profesional */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Fecha de Consulta
                                </label>
                                <ShadcnDatePicker
                                    className="border-slate-300 focus:border-indigo-500"
                                    label=""
                                    value={fechaConsulta}
                                    onChange={(fecha) => setFechaConsulta(fecha)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Profesional
                                </label>
                                <p className="text-xs text-slate-400 mb-2">Profesional a cargo de la atenci&oacute;n</p>
                                <ShadcnInput
                                    value={observaciones}
                                    placeholder="Ej: Dra. Andrea Moran"
                                    onChange={e => setObservaciones(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos din&aacute;micos de la plantilla */}
                    {idPlantilla && plantillaCompleta && plantillaCompleta.categorias.map(categoria => (
                        <div key={categoria.id_categoria}>
                            <div className="border-t border-b border-slate-200 bg-slate-100/80 px-5 py-3">
                                <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                                    {categoria.nombre}
                                </h2>
                            </div>

                            <div className="p-5 md:p-6 space-y-5">
                                {categoria.campos.map(campo => (
                                    <div key={campo.id_campo}>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {campo.nombre}
                                            {campo.requerido === 1 && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <Textarea
                                            className="min-h-[100px] resize-y border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                                            value={datosDinamicos[campo.id_campo] || ""}
                                            onChange={(e) => setDatosDinamicos(prev => ({
                                                ...prev,
                                                [campo.id_campo]: e.target.value
                                            }))}
                                            placeholder={`Ingrese ${campo.nombre.toLowerCase()}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Formulario legacy (fichas sin plantilla) */}
                    {!idPlantilla && (
                        <>
                            <div className="p-5 md:p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Motivo de Consulta
                                        </label>
                                        <p className="text-xs text-slate-400 mb-2">Tipo de atenci&oacute;n realizada</p>
                                        <ShadcnInput
                                            value={tipoAtencion}
                                            placeholder="Ej: Seguimiento, Tratamiento, Evaluaci&oacute;n..."
                                            onChange={e => settipoAtencion(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-b border-slate-200 bg-slate-100/80 px-5 py-3">
                                <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                                    Diagn&oacute;stico e Indicaciones
                                </h2>
                            </div>

                            <div className="p-5 md:p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Diagn&oacute;stico
                                    </label>
                                    <p className="text-xs text-slate-400 mb-2">Diagn&oacute;stico cl&iacute;nico del paciente</p>
                                    <ShadcnInput
                                        value={diagnostico}
                                        placeholder="Ej: Caries dental activa en molar 3.6 (lesi&oacute;n oclusal)"
                                        onChange={e => setDiagnostico(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Indicaciones
                                    </label>
                                    <p className="text-xs text-slate-400 mb-2">Indicaciones post-atenci&oacute;n para el paciente</p>
                                    <ShadcnInput
                                        value={indicaciones}
                                        placeholder="Ej: Cepillado suave 3 veces al d&iacute;a + hilo dental nocturno"
                                        onChange={e => setIndicaciones(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-b border-slate-200 bg-slate-100/80 px-5 py-3">
                                <h2 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
                                    Anotaciones Cl&iacute;nicas
                                </h2>
                            </div>

                            <div className="p-5 md:p-6">
                                <p className="text-xs text-slate-400 mb-3">
                                    Registra hallazgos, procedimiento realizado, materiales/medicaci&oacute;n indicada, evoluci&oacute;n y plan de control.
                                </p>
                                <Textarea
                                    className="min-h-[140px] resize-none border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    value={anotacionConsulta}
                                    onChange={(e) => setanotacionConsulta(e.target.value)}
                                    placeholder="Ej: Odontograma: 3.6 caries O; se realiza resina; anestesia local; se indican cuidados y control en 7 d&iacute;as."
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Botones de acci&oacute;n */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    {dataFicha.map((ficha) => (
                        <button
                            key={ficha.id_paciente ?? ficha.id_ficha}
                            onClick={() => retroceder(ficha.id_paciente)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 hover:border-slate-400 transition-all duration-150 shadow-sm">
                            Cancelar
                        </button>
                    ))}
                    <button
                        onClick={() => actualizarFicha()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 to-teal-600 rounded-xl hover:from-indigo-800 hover:to-teal-700 transition-all duration-150 shadow-md hover:shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Actualizar Ficha
                    </button>
                </div>

            </div>
        </div>
    )
}
