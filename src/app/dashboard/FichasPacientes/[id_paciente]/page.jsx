"use client"
import {useParams} from "next/navigation";
import {useState, useEffect, useRef} from "react";
import { useUser } from "@clerk/nextjs";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {CheckboxIcon} from "@radix-ui/react-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {InfoButton} from "@/Componentes/InfoButton";
import { formatRut } from "@/lib/designTokens";
import {
    canAccessOdontograma,
    canAccessRecetasEnFicha,
    getDashboardRoleFromUser,
} from "@/lib/dashboard-access";


function parsearDatosDinamicos(datos) {
    if (!datos) return null
    let parsed = datos
    if (typeof datos === "string") {
        try { parsed = JSON.parse(datos) } catch { return null }
    }
    if (!parsed || typeof parsed !== "object") return null
    return parsed
}

function agruparPorCategoria(datos) {
    const categoriasMap = {}

    Object.keys(datos).forEach(key => {
        if (key === "_plantillaNombre") return
        const entry = datos[key]
        if (!entry || typeof entry !== "object" || !entry.nombreCategoria) return

        const catNombre = entry.nombreCategoria
        if (!categoriasMap[catNombre]) {
            categoriasMap[catNombre] = {
                nombre: catNombre,
                orden: entry.categoriaOrden || 0,
                campos: []
            }
        }
        categoriasMap[catNombre].campos.push({
            nombre: entry.nombreCampo,
            valor: entry.valor,
            orden: entry.campoOrden || 0
        })
    })

    return Object.values(categoriasMap)
        .sort((a, b) => a.orden - b.orden)
        .map(cat => ({
            ...cat,
            campos: cat.campos.sort((a, b) => a.orden - b.orden)
        }))
}

function esDatoVisible(valor) {
    if (valor === null || valor === undefined) return false;

    const texto = String(valor).trim();
    if (!texto) return false;

    const normalizado = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (
        normalizado === "-" ||
        normalizado === "no indicado" ||
        normalizado === "no especificado" ||
        normalizado === "no especifica" ||
        normalizado === "sin definir"
    ) {
        return false;
    }

    return true;
}

function esFechaPlaceholder(fecha) {
    if (!fecha) return true;

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return true;

    return date.getFullYear() === 1900;
}

function convertirFechaParaBackend(fecha) {
    if (!fecha) return "";

    if (typeof fecha === "string") {
        const fechaLimpia = fecha.includes("T") ? fecha.split("T")[0] : fecha;
        const date = new Date(fechaLimpia);

        if (!Number.isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
        }

        return fechaLimpia;
    }

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
}

export default function Paciente() {

    const {id_paciente} = useParams();
    const { user } = useUser();
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const formularioEdicionRef = useRef(null);

    function nuevaFichaClinica() {
        router.push(`/dashboard/NuevaFicha/${id_paciente}`);
    }

    function editarPaciente() {
        setMostrarFormulario((prev) => {
            const siguienteEstado = !prev;

            if (siguienteEstado) {
                setTimeout(() => {
                    formularioEdicionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }, 50);
            }

            return siguienteEstado;
        });
    }


    function verOdontogramas() {
        router.push(`/dashboard/odontogramasPaciente/${id_paciente}`);
    }

    function editarFichaClinica(id_ficha) {
        router.push(`/dashboard/EdicionFicha/${id_ficha}`);
    }

    function agendarPaciente() {
        const paciente = detallePaciente[0];
        if (!paciente) return;
        const params = new URLSearchParams({
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            rut: paciente.rut || "",
            telefono: paciente.telefono || "",
            email: paciente.correo || "",
        });
        router.push(`/dashboard/calendario?${params.toString()}`);
    }

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");

    const [checked, setChecked] = useState(true);

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [estadoFicha, setEstadoFicha] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    const [listaFichas, setListaFichas] = useState([]);
    const [filtroProfesional, setFiltroProfesional] = useState("");

    async function eliminarFicha(id_ficha) {
        try {
            if (!id_ficha) {
                return toast.error("Debe seleccionar al menos una ficha clinica");
            }

            const res = await fetch(`${API}/ficha/eliminarFichaClinica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return toast.error("No se puedo eliminar la ficha , contacte a soporte informatico");
            } else {
                const resultadoBackend = await res.json();
                if (resultadoBackend.message === true) {
                    await listarFichasClinicasPaciente(id_paciente)
                    return toast.success("Se ha eliminado la ficha con exito!")
                } else {
                    return toast.error("No se ha podido eliminar la ficha por favor intente mas tarde")
                }
            }
        } catch (error) {
            return toast.error("Ha ocurrido un error contacte a soporte tecnico");
        }
    }

    async function listarFichasClinicasPaciente(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se ha seleccionado ningun Id, si el problema persiste contcate a soporte de Medify")
            } else {
                const res = await fetch(`${API}/ficha/seleccionarFichasPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id_paciente}),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Ha ocurrido un error Contacte a soporte de Medify")
                }

                const dataFichasClinicas = await res.json();
                setListaFichas(dataFichasClinicas);
            }
        } catch (e) {
            console.log(e)
            return toast.error("Ha ocurrido un error en el servidor: " + e)
        }
    }

    async function buscarPorProfesional() {
        if (!filtroProfesional.trim()) {
            return toast.error("Ingrese el nombre del profesional para buscar")
        }
        try {
            const res = await fetch(`${API}/ficha/seleccionar_similitud_nombre_profesional`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({observaciones: filtroProfesional.trim()}),
                mode: "cors"
            })

            if (!res.ok) {
                setListaFichas([])
                return toast.error("No se encontraron fichas con ese profesional")
            }

            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
                setListaFichas(data)
                toast.success(`Se encontraron ${data.length} fichas`)
            } else {
                setListaFichas([])
                toast.error("No se encontraron fichas con ese profesional")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al buscar fichas por profesional")
        }
    }

    function limpiarFiltro() {
        setFiltroProfesional("")
        listarFichasClinicasPaciente(id_paciente)
    }

    function volverAFichas() {
        router.push("/dashboard/FichaClinica");
    }

    function volverAListaTrabajo() {
        router.push("/dashboard");
    }

    async function actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, id_paciente) {

        let prevision_id = null;
        const pacienteBase = detallePaciente[0] || {};
        const nacimientoNormalizado = convertirFechaParaBackend(nacimiento);
        const nombreNormalizado = String(nombre || "").trim();
        const apellidoNormalizado = String(apellido || "").trim();
        const rutNormalizado = String(rut || "").trim();
        const sexoNormalizado = String(sexo || "").trim();
        const telefonoNormalizado = String(telefono || "").trim();
        const correoNormalizado = String(correo || "").trim();
        const direccionNormalizada = String(direccion || "").trim();
        const paisNormalizado = String(pais || "").trim();

        if (prevision.includes("FONASA")) {
            prevision_id = 1;
        } else if (prevision.includes("ISAPRE")) {
            prevision_id = 2;
        } else if (prevision.includes("CONVENIO")) {
            prevision_id = 3;
        } else if (prevision.includes("SIN PREVISION")) {
            prevision_id = 4;
        } else {
            prevision_id = 0;
        }

        try {
            if (
                !nombreNormalizado ||
                !apellidoNormalizado ||
                !rutNormalizado ||
                !nacimientoNormalizado ||
                !sexoNormalizado ||
                !prevision_id ||
                !telefonoNormalizado ||
                !correoNormalizado ||
                !direccionNormalizada ||
                !paisNormalizado ||
                !id_paciente
            ) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const payload = {
                nombre: nombreNormalizado,
                apellido: apellidoNormalizado,
                rut: rutNormalizado,
                nacimiento: nacimientoNormalizado,
                sexo: sexoNormalizado,
                prevision_id,
                telefono: telefonoNormalizado,
                correo: correoNormalizado,
                direccion: direccionNormalizada,
                pais: paisNormalizado,
                observacion1: pacienteBase.observacion1 ?? "",
                observacion2: pacienteBase.observacion2 ?? "",
                observacion3: pacienteBase.observacion3 ?? "",
                apoderado: pacienteBase.apoderado ?? "",
                apoderado_rut: pacienteBase.apoderado_rut ?? "",
                medicamentosUsados: pacienteBase.medicamentosUsados ?? "",
                habitos: pacienteBase.habitos ?? "",
                comentariosAdicionales: pacienteBase.comentariosAdicionales ?? "",
                id_paciente
            };

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const detalle = await res.json().catch(() => null);
                console.log("Error al actualizar paciente:", detalle, payload);
                return toast.error("No se pudo actualizar el paciente. Revise los datos e intente nuevamente.")
            } else {
                const resultadoQuery = await res.json();
                if (resultadoQuery.message === true) {
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    setMostrarFormulario(false);
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");
                } else {
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }
            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente})
            })

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        } catch (error) {
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
        listarFichasClinicasPaciente(id_paciente)
    }, [id_paciente]);

    useEffect(() => {
        if (detallePaciente.length === 0) return;

        const paciente = detallePaciente[0];
        setNombre(paciente.nombre || "");
        setApellido(paciente.apellido || "");
        setRut(paciente.rut || "");
        setNacimiento(paciente.nacimiento || "");
        setSexo(paciente.sexo || "");
        setPrevision(previsionDeterminacion(paciente.prevision_id));
        setTelefono(paciente.telefono || "");
        setCorreo(paciente.correo || "");
        setDireccion(paciente.direccion || "");
        setPais(paciente.pais || "");
    }, [detallePaciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento || esFechaPlaceholder(fechaNacimiento)) return '-';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    }

    function previsionDeterminacion(id_prevision) {
        if (id_prevision === 1) return "FONASA";
        if (id_prevision === 2) return "ISAPRE";
        if (id_prevision === 3) return "CONVENIO";
        if (id_prevision === 4) return "SIN PREVISION";
        return "SIN DEFINIR";
    }

    const pacienteActual = detallePaciente[0];
    const totalFichas = listaFichas.length;
    const dashboardRole = getDashboardRoleFromUser(user);
    const canSeeOdontograma = canAccessOdontograma(dashboardRole);
    const canSeeRecetaMedica = canAccessRecetasEnFicha(dashboardRole);



    function irAReceta(id_paciente) {
        router.push(`/dashboard/recetaPacientes/${id_paciente}`);
    }



    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
            <ToasterClient/>

            <div className="flex-1 mx-auto w-full max-w-[1600px] px-4 py-6 md:px-8 md:py-10 2xl:max-w-none">

                {/* ── Header Principal ── */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">Ficha Individual</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Carpeta Clínica: <span className="text-[#6E56CF]">{pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Paciente"}</span>
                        </h1>
                        <p className="mt-2 text-[13px] text-slate-500 max-w-2xl">
                            Gestión integral del historial médico, documentos y evoluciones clínicas del paciente.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="h-14 px-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">RUT</span>
                            <span className="text-sm font-bold text-slate-900 mt-1 leading-none font-mono">{formatRut(pacienteActual?.rut) || "-"}</span>
                        </div>
                        <div className="h-14 px-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-center shadow-sm">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registros</span>
                            <span className="text-sm font-bold text-slate-900 mt-1 leading-none">{totalFichas} Fichas</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => volverAFichas()}
                                className="h-14 px-5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => volverAListaTrabajo()}
                                className="h-14 px-6 rounded-2xl bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 flex items-center justify-center gap-2"
                            >
                                Reservaciones
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Perfil del Paciente ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
                    
                    {/* Tarjeta de Datos Personales (4 slots) */}
                    <div className="xl:col-span-4">
                        {pacienteActual && (
                            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden sticky top-6 transition-all hover:shadow-md">
                                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-[24px] bg-[#6E56CF] text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-100">
                                        {pacienteActual.nombre?.charAt(0)}{pacienteActual.apellido?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 leading-tight">{pacienteActual.nombre} {pacienteActual.apellido}</h2>
                                        <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider mt-1">ID Paciente #{id_paciente}</p>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nacimiento</span>
                                            <p className="text-[13px] font-semibold text-slate-700">{formatearFecha(pacienteActual.nacimiento)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Edad</span>
                                            <p className="text-[13px] font-semibold text-slate-700">{calcularEdad(pacienteActual.nacimiento)} años</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previsión</span>
                                            <p className="text-[13px] font-semibold text-slate-700">{previsionDeterminacion(pacienteActual.prevision_id)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sexo</span>
                                            <p className="text-[13px] font-semibold text-slate-700">{pacienteActual.sexo || "-"}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            </div>
                                            <span className="text-[13px] text-slate-600">{pacienteActual.telefono || "No registrado"}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            </div>
                                            <span className="text-[13px] text-slate-600 break-all">{pacienteActual.correo || "No registrado"}</span>
                                        </div>
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            onClick={editarPaciente}
                                            className="w-full h-11 bg-slate-900 text-white text-[13px] font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            Editar Datos Paciente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Contenido Principal (8 slots) ── */}
                    <div className="xl:col-span-8 space-y-8">
                        
                        {/* Acciones Rápidas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button onClick={() => nuevaFichaClinica(id_paciente)} className="h-28 bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between hover:border-[#6E56CF] hover:shadow-lg hover:shadow-indigo-50/50 transition-all group text-left">
                                <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6E56CF] flex items-center justify-center group-hover:bg-[#6E56CF] group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">Nueva Ficha</span>
                            </button>
                            <button onClick={agendarPaciente} className="h-28 bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between hover:border-[#6E56CF] hover:shadow-lg hover:shadow-indigo-50/50 transition-all group text-left">
                                <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6E56CF] flex items-center justify-center group-hover:bg-[#6E56CF] group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-[13px] font-bold text-slate-700">Agendar Cita</span>
                            </button>
                            {canSeeOdontograma && (
                                <button onClick={verOdontogramas} className="h-28 bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between hover:border-[#6E56CF] hover:shadow-lg hover:shadow-indigo-50/50 transition-all group text-left">
                                    <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6E56CF] flex items-center justify-center group-hover:bg-[#6E56CF] group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75h4.5m-4.5 4.5h4.5M7.5 3.75h9A2.25 2.25 0 0118.75 6v12A2.25 2.25 0 0116.5 20.25h-9A2.25 2.25 0 015.25 18V6A2.25 2.25 0 017.5 3.75z" /></svg>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-700">Odontograma</span>
                                </button>
                            )}
                            {canSeeRecetaMedica && (
                                <button onClick={() => irAReceta(id_paciente)} className="h-28 bg-white border border-slate-200 rounded-[28px] p-6 flex flex-col justify-between hover:border-[#6E56CF] hover:shadow-lg hover:shadow-indigo-50/50 transition-all group text-left">
                                    <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6E56CF] flex items-center justify-center group-hover:bg-[#6E56CF] group-hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-700">Receta Médica</span>
                                </button>
                            )}
                        </div>

                        {/* Formulario de Edición (Cerrable) */}
                        {mostrarFormulario && (
                            <div ref={formularioEdicionRef} className="bg-white rounded-[32px] border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Edición de Datos Maestros</h3>
                                    <button onClick={() => setMostrarFormulario(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                                            <ShadcnInput value={nombre} onChange={(e) => setNombre(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:ring-violet-50 focus:border-[#6E56CF]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
                                            <ShadcnInput value={apellido} onChange={(e) => setApellido(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:ring-violet-50 focus:border-[#6E56CF]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">RUT</label>
                                            <ShadcnInput value={rut} onChange={(e) => setRut(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:ring-violet-50 focus:border-[#6E56CF]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fecha de nacimiento</label>
                                            <div className="w-full [&_button]:h-11 [&_button]:w-full [&_button]:justify-between [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-white [&_button]:text-sm [&_label]:hidden">
                                                <ShadcnDatePicker
                                                    label="Fecha de nacimiento"
                                                    value={nacimiento}
                                                    onChange={(fecha) => setNacimiento(fecha)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sexo</label>
                                            <ShadcnInput value={sexo} onChange={(e) => setSexo(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:ring-violet-50 focus:border-[#6E56CF]" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Previsión</label>
                                            <div className="w-full [&_button]:h-11 [&_button]:rounded-xl [&_button]:border-slate-200 [&_button]:bg-white [&_button]:text-sm">
                                                <ShadcnSelect
                                                    nombreDefault={prevision || "Seleccionar..."}
                                                    value1={"FONASA"} value2={"ISAPRE"} value3={"CONVENIO"} value4={"SIN PREVISION"}
                                                    onChange={(v) => setPrevision(v)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                                            <ShadcnInput value={telefono} onChange={(e) => setTelefono(e.target.value)} className="h-11 rounded-xl border-slate-200 focus:ring-violet-50 focus:border-[#6E56CF]" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3">
                                        <button onClick={() => setMostrarFormulario(false)} className="h-11 px-6 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50">Cancelar</button>
                                        <button onClick={() => actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, id_paciente)} className="h-11 px-8 rounded-xl bg-[#6E56CF] text-white font-bold text-sm hover:bg-[#5b45bc] shadow-lg shadow-indigo-100">Guardar Cambios</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Listado de Fichas */}
                        <div className="space-y-6">
                            
                            {/* Barra de Filtro */}
                            <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={filtroProfesional}
                                        onChange={(e) => setFiltroProfesional(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && buscarPorProfesional()}
                                        placeholder="Filtrar por profesional..."
                                        className="h-12 w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 text-sm focus:ring-2 focus:ring-violet-100 transition-all"
                                    />
                                </div>
                                <button onClick={buscarPorProfesional} className="h-12 px-6 rounded-2xl bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-all">Buscar</button>
                                {filtroProfesional && <button onClick={limpiarFiltro} className="h-12 px-5 rounded-2xl bg-slate-100 text-slate-600 text-[13px] font-bold hover:bg-slate-200">Limpiar</button>}
                            </div>

                            {/* Fichas Propiamente Tales */}
                            {listaFichas.length === 0 ? (
                                <div className="bg-white rounded-[32px] border border-dashed border-slate-200 py-24 text-center">
                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">No se han encontrado registros clínicos.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {listaFichas.map((ficha) => (
                                        <div key={ficha.id_ficha} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-violet-50 text-[#6E56CF] flex items-center justify-center font-bold text-xs shadow-sm">
                                                        #{ficha.id_ficha}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-800">
                                                            {parsearDatosDinamicos(ficha.datosDinamicos)?._plantillaNombre || ficha.tipoAtencion || "Consulta General"}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Fecha: {formatearFecha(ficha.fechaConsulta)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-9 px-3 rounded-xl bg-teal-50 text-teal-700 text-[11px] font-bold flex items-center border border-teal-100">
                                                        Prof: {ficha.observaciones || "N/A"}
                                                    </div>
                                                    <button onClick={() => editarFichaClinica(ficha.id_ficha)} className="h-9 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-all">Editar</button>
                                                    <button onClick={() => eliminarFicha(ficha.id_ficha)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                {(() => {
                                                    const datos = parsearDatosDinamicos(ficha.datosDinamicos)
                                                    if (datos && datos._plantillaNombre) {
                                                        const categorias = agruparPorCategoria(datos)
                                                        return (
                                                            <div className="space-y-8">
                                                                {categorias.map(cat => (
                                                                    <div key={cat.nombre} className="space-y-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-[10px] font-bold text-[#6E56CF] uppercase tracking-[0.15em]">{cat.nombre}</span>
                                                                            <div className="flex-1 h-px bg-slate-100"></div>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {cat.campos.map((campo, idx) => (
                                                                                <div key={idx} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 transition-colors hover:bg-slate-50">
                                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{campo.nombre}</span>
                                                                                    <p className="mt-1.5 text-[13px] text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{campo.valor || "-"}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                    }
                                                    return <p className="text-sm text-slate-400 italic text-center py-4">No hay datos estructurados en esta ficha.</p>
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
