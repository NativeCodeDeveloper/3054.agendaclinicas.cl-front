"use client"

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js";
import {formatRut} from "@/lib/designTokens";

export default function ArchivosPaciente() {
    const {id_paciente} = useParams();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [detallePaciente, setDetallePaciente] = useState([]);
    const pacienteActual = detallePaciente[0];

    async function buscarPacientePorId(idPaciente) {
        try {
            if (!idPaciente) {
                return toast.error("No se puede cargar el paciente seleccionado.");
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente: idPaciente})
            });

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);
        } catch (error) {
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado.");
        }
    }

    useEffect(() => {
        buscarPacientePorId(id_paciente);
    }, [id_paciente]);

    return (
        <div className="min-h-screen bg-[#FAFAFB] flex flex-col">
            <ToasterClient/>

            <div className="flex-1 mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6E56CF]">Documentos del paciente</p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                            Archivos: <span className="text-[#6E56CF]">{pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Paciente"}</span>
                        </h1>
                        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-500">
                            Acceso a documentos, respaldos y archivos asociados a la carpeta clinica.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => router.push(`/dashboard/FichasPacientes/${id_paciente}`)}
                            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                        >
                            Volver a ficha
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/FichaClinica")}
                            className="h-12 rounded-2xl bg-slate-900 px-5 text-[13px] font-bold text-white shadow-lg shadow-slate-100 transition-all hover:bg-slate-800"
                        >
                            Carpetas clinicas
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                    <aside className="xl:col-span-4">
                        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/30 p-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#6E56CF] text-xl font-bold text-white shadow-lg shadow-indigo-100">
                                        {pacienteActual?.nombre?.charAt(0) || "P"}{pacienteActual?.apellido?.charAt(0) || ""}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold leading-tight text-slate-900">
                                            {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Cargando paciente"}
                                        </h2>
                                        <p className="mt-1 text-[12px] font-medium uppercase tracking-wider text-slate-400">
                                            ID Paciente #{id_paciente}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 p-8">
                                <InfoRow label="RUT" value={formatRut(pacienteActual?.rut) || "-"}/>
                                <InfoRow label="Nacimiento" value={pacienteActual?.nacimiento ? formatearFecha(pacienteActual.nacimiento) : "-"}/>
                                <InfoRow label="Telefono" value={pacienteActual?.telefono || "No registrado"}/>
                                <InfoRow label="Correo" value={pacienteActual?.correo || "No registrado"}/>
                            </div>
                        </div>
                    </aside>

                    <section className="xl:col-span-8">
                        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/30 px-8 py-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-[#6E56CF]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13h8m-8 3h5" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">Archivos asociados</h2>
                                    <p className="mt-0.5 text-xs text-slate-400">Documentos disponibles para este paciente</p>
                                </div>
                            </div>

                            <div className="flex min-h-[360px] flex-col items-center justify-center px-8 py-14 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-100 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                                    </svg>
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-slate-900">Aun no hay archivos registrados</h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                                    Cuando existan documentos asociados al paciente, se mostraran en esta seccion.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function InfoRow({label, value}) {
    return (
        <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
            <p className="mt-1 break-words text-[13px] font-semibold text-slate-700">{value}</p>
        </div>
    );
}
