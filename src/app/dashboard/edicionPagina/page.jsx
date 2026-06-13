"use client";

import { useEffect, useState } from "react";

export default function EdicionPagina() {
    const [nuevoTitulo, setNuevoTitulo] = useState("");
    const [mensajeSubTitulo, setmensajeSubTitulo] = useState("");
    const [mensajeSobreNosotros, setmensajeSobreNosotros] = useState("");
    const [mensajeProyectos, setmensajeProyectos] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [MensajeContacto, setMensajeContacto] = useState("");
    const [MensajeTexto1, setMensajeTexto1] = useState("");
    const [MensajeTexto2, setMensajeTexto2] = useState("");

    // Estado para timestamp de última actualización
    const [ultimaActualizacion, setUltimaActualizacion] = useState("");
    // Estados de carga
    const [cargando, setCargando] = useState(false);

    const [nuevoSubtitulo, setNuevoSubtitulo] = useState("");
    const [nuevoSobreNosotros, setNuevoSobreNosotros] = useState("");
    const [nuevoTituloProyecto, setnuevoTituloProyecto] = useState("");
    const [contactoTitulo, setcontactoTitulo] = useState("");
    const [texto1, settexto1] = useState("");
    const [texto2, settexto2] = useState("");
    const [titulo, settitulo] = useState("");
    const [subtitulo, setsubtitulo] = useState("");
    const [sobreNosotros, setsobreNosotros] = useState("");
    const [tituloProyectos, settituloProyectos] = useState("");
    const [tituloContacto, settituloContacto] = useState("");
    const [primerParrafo, setprimerParrafo] = useState("");
    const [segundoParrafo, setsegundoParrafo] = useState("");
    
    const API = process.env.NEXT_PUBLIC_API_URL;

    async function cargarTitulos() {
        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/titulo`);
            if (!res.ok) {
                // Manejo suave: mostrar un mensaje en el estado y salir
                settitulo("Problema en consulta a base de datos, contacte equipo de soporte");
                return;
            }
            const data = await res.json();

            let tituloPrincipal = null;
            let subtitulo = null;
            let nosotros = null;
            let tituloProyectos = null;
            let tituloContacto = null;
            let parrafo1 = null;
            let parrafo2 = null;

            if (Array.isArray(data)) {
                const objetoEncontrado1 = data.find(
                    (item) => Number(item.id_titulo) === 1
                );
                const objetoEncontrado2 = data.find(
                    (item) => Number(item.id_titulo) === 2
                );
                const objetoEncontrado3 = data.find(
                    (item) => Number(item.id_titulo) === 3
                );
                const objetoEncontrado4 = data.find(
                    (item) => Number(item.id_titulo) === 4
                );
                const objetoEncontrado5 = data.find(
                    (item) => Number(item.id_titulo) === 5
                );
                const objetoEncontrado6 = data.find(
                    (item) => Number(item.id_titulo) === 6
                );
                const objetoEncontrado7 = data.find(
                    (item) => Number(item.id_titulo) === 7
                );

                tituloPrincipal = objetoEncontrado1;
                subtitulo = objetoEncontrado2;
                nosotros = objetoEncontrado3;
                tituloProyectos = objetoEncontrado4;
                tituloContacto = objetoEncontrado5;
                parrafo1 = objetoEncontrado6;
                parrafo2 = objetoEncontrado7;
            }

            if (tituloPrincipal) {
                if (typeof tituloPrincipal.titulo === "string") {
                    settitulo(tituloPrincipal.titulo);
                }
            }

            if (subtitulo) {
                if (typeof subtitulo.titulo === "string") {
                    setsubtitulo(subtitulo.titulo);
                }
            }

            if (nosotros) {
                if (typeof nosotros.titulo === "string") {
                    setsobreNosotros(nosotros.titulo);
                }
            }

            if (tituloProyectos) {
                if (typeof tituloProyectos.titulo === "string") {
                    settituloProyectos(tituloProyectos.titulo);
                }
            }

            if (tituloContacto) {
                if (typeof tituloContacto.titulo === "string") {
                    settituloContacto(tituloContacto.titulo);
                }
            }

            if (parrafo1) {
                if (typeof parrafo1.titulo === "string") {
                    setprimerParrafo(parrafo1.titulo);
                }
            }

            if (parrafo2) {
                if (typeof parrafo2.titulo === "string") {
                    setsegundoParrafo(parrafo2.titulo);
                }
            }
        } catch (error) {
            settitulo("Problemas en comunicación con el servidor");
        }
    }

    async function cargarTextos() {
        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/textos`);
            if (!res.ok) {
                // Manejo suave: escribir en el estado y salir
                settitulo("Problema en consulta a base de datos, contacte equipo de soporte");
                return;
            }
            const data = await res.json();

            let parrafo1 = null;
            let parrafo2 = null;

            if (Array.isArray(data)) {
                const objetoEncontrado1 = data.find(
                    (item) => Number(item.id_Textos) === 1
                );
                const objetoEncontrado2 = data.find(
                    (item) => Number(item.id_Textos) === 2
                );

                parrafo1 = objetoEncontrado1;
                parrafo2 = objetoEncontrado2;
            }

            if (parrafo1) {
                if (typeof parrafo1.contenido === "string") {
                    setprimerParrafo(parrafo1.contenido);
                }
            }

            if (parrafo2) {
                if (typeof parrafo2.contenido === "string") {
                    setsegundoParrafo(parrafo2.contenido);
                }
            }
        } catch (error) {
            settitulo("Problemas en comunicación con el servidor");
        }
    }

    // Carga inicial
    useEffect(() => {
        cargarTitulos();
        cargarTextos();
        setUltimaActualizacion(new Date().toLocaleString('es-CL'));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setCargando(true);

        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/titulo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevoTitulo }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje("✅ " + (data.message || "Actualizado correctamente"));
                localStorage.setItem('medify-titulo-principal', nuevoTitulo);
                settitulo(nuevoTitulo);
                setNuevoTitulo("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setMensaje("❌ " + (data.error || "No se pudo actualizar"));
            }
        } catch (err) {
            setMensaje("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleUpdateSubtitulo(e) {
        e.preventDefault();
        setCargando(true);

        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/titulo/subtitulo`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevoSubtitulo }),
            });

            const data = await res.json();

            if (res.ok) {
                setmensajeSubTitulo("✅ " + (data.message || "Actualizado"));
                localStorage.setItem('medify-subtitulo', nuevoSubtitulo);
                setsubtitulo(nuevoSubtitulo);
                setNuevoSubtitulo("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setmensajeSubTitulo("❌ " + (data.error || "No se pudo actualizar"));
            }
        } catch (err) {
            setmensajeSubTitulo("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleUpdateSobreNosotros(event) {
        event.preventDefault();
        if (!nuevoSobreNosotros || !nuevoSobreNosotros.trim()) {
            setmensajeSobreNosotros("⚠️ Debes escribir un texto para 'Sobre nosotros'");
            return;
        }
        setCargando(true);
        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/titulo/sobrenosotros`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nuevoSobreNosotros: (nuevoSobreNosotros || "").trim(),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setmensajeSobreNosotros("✅ " + (data.message || "Actualizado"));
                setsobreNosotros(nuevoSobreNosotros.trim());
                setNuevoSobreNosotros("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setmensajeSobreNosotros("❌ " + (data.error || "No se pudo actualizar"));
            }
        } catch (err) {
            setmensajeSobreNosotros("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleSubmitProyectos(evento) {
        evento.preventDefault();
        setCargando(true);

        try {
            const res = await fetch(`${API}/titulo/proyectos`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevoTituloProyecto }),
            });

            const data = await res.json();

            if (res.ok) {
                setmensajeProyectos(
                    (data.message) || "✅ Se ha cambiado el titulo de la seccion Portafolio/Proyectos"
                );
                setnuevoTituloProyecto("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setmensajeProyectos("❌ " + (data.error || "No se ha podido cambiar el titulo"));
            }
        } catch (error) {
            setmensajeProyectos("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleSubmitContacto(evento) {
        evento.preventDefault();
        setCargando(true);

        try {
            const res = await fetch(`${API}/titulo/contacto`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactoTitulo }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensajeContacto("✅ " + (data.message || "Se ha cambiado el titulo de la seccion Contacto"));
                settituloContacto(contactoTitulo);
                setcontactoTitulo("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setMensajeContacto("❌ " + (data.error || "No se ha podido cambiar el titulo de la seccion Contacto"));
            }
        } catch (err) {
            setMensajeContacto("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleSubmitText1(event) {
        event.preventDefault();
        setCargando(true);

        try {
            const res = await fetch(`${API}/textos/texto1`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto1 }),
            });

            const data = await res.json();

            if (res.ok) {
                setMensajeTexto1("✅ " + (data.message || "Parrafo cambiado correctamente"));
                settexto1("");
                setUltimaActualizacion(new Date().toLocaleString('es-CL'));
            } else {
                setMensajeTexto1("❌ " + (data.error || "No se pudo actualizar"));
            }
        } catch (err) {
            setMensajeTexto1("❌ Error de conexión con el backend");
        } finally {
            setCargando(false);
        }
    }

    async function handleSubmitText2(event) {
        event.preventDefault();

        try {
            // Usar la constante API en lugar de URL hardcodeada
            const res = await fetch(`${API}/textos/texto2`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texto2 }),
            });
            const data = await res.json();

            if (res.ok) {
                setMensajeTexto2("✅ " + (data.message || "Parrafo cambiado correctamente"));
            } else {
                setMensajeTexto2("❌ " + (data.error || "No se pudo actualizar"));
            }
        } catch (err) {
            setMensajeTexto2("Error de conexión con el backend");
        }
    }


    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Gestión de Contenido Web</h1>
                            <p className="text-slate-200">Personaliza los textos y contenido de la página web</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span suppressHydrationWarning>Última actualización: {ultimaActualizacion || '—'}</span>
                    </div>
                </div>

                <div className="grid gap-6 md:gap-8">



                    {/* Título Principal */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Título Principal</h2>

                        {/* Texto Actual */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Texto actual</label>
                            <div className="bg-white border border-gray-200 rounded-md p-3">
                                <p className="text-gray-900">{titulo || 'No hay título configurado'}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Título:</label>
                                <textarea
                                    value={nuevoTitulo}
                                    onChange={(e) => setNuevoTitulo(e.target.value)}
                                    placeholder="Escribe el nuevo título"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                    type="submit"
                                    disabled={cargando}
                                 >
                                    Guardar Cambios
                                </button>
                            </div>

                            {mensaje && (
                                <div className={`p-3 rounded-md text-sm ${
                                    mensaje.startsWith('✅') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                                }`}>
                                    {mensaje}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Subtítulo */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{subtitulo}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar Subtítulo</h2>
                        <form onSubmit={handleUpdateSubtitulo}>
              <textarea
                  value={nuevoSubtitulo}
                  onChange={(e) => setNuevoSubtitulo(e.target.value)}
                  placeholder="Escribe el nuevo subtítulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
              />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar subtítulo
                             </button>
                            <br />
                            {mensajeSubTitulo && <p>{mensajeSubTitulo}</p>}
                        </form>
                    </div>

                    {/* Sobre nosotros */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{sobreNosotros}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar Título: Acerca de</h2>
                        <form onSubmit={handleUpdateSobreNosotros}>
              <textarea
                  value={nuevoSobreNosotros}
                  onChange={(event) => setNuevoSobreNosotros(event.target.value)}
                  placeholder="Escribe el nuevo 'Sobre nosotros'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
              />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar Sobre Nosotros
                             </button>
                            <br /> {mensajeSobreNosotros && <p>{mensajeSobreNosotros}</p>}
                        </form>
                    </div>

                    {/* Proyectos */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{tituloProyectos}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar título Proyectos</h2>
                        <form onSubmit={handleSubmitProyectos}>
              <textarea
                  value={nuevoTituloProyecto}
                  onChange={(evento) => setnuevoTituloProyecto(evento.target.value)}
                  placeholder="Nuevo titulo de la seccion Proyectos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
              />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar titulo Proyecto
                             </button>
                            <br />
                            {mensajeProyectos && <p>{mensajeProyectos}</p>}
                        </form>
                    </div>

                    {/* Contacto */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{tituloContacto}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar título Contacto</h2>
                        <form onSubmit={handleSubmitContacto}>
              <textarea
                  value={contactoTitulo}
                  onChange={(evento) => setcontactoTitulo(evento.target.value)}
                  placeholder="Nuevo titulo de la seccion contacto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
              />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar titulo Contacto
                             </button>
                            <br />
                            {MensajeContacto && <p>{MensajeContacto}</p>}
                        </form>
                    </div>

                    {/* Párrafo 1 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{primerParrafo}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar Primer Párrafo</h2>
                        <form onSubmit={handleSubmitText1}>
                            <br />
                            <textarea
                                value={texto1}
                                onChange={(event) => settexto1(event.target.value)}
                                placeholder="Nuevo texto Párrafo"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
                            />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar Párrafo
                             </button>
                            <br />
                            {MensajeTexto1 && <p>{MensajeTexto1}</p>}
                        </form>
                    </div>

                    {/* Párrafo 2 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-7">
                        <h3 className="mb-2 text-sm font-semibold text-slate-700">Texto actual</h3>
                        <div className="overflow-hidden border border-gray-200 bg-white rounded-md inline-block max-w-full p-3">
                            <p className="text-slate-900">{segundoParrafo}</p>
                        </div>
                        <br />
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">Editar Segundo Párrafo</h2>
                        <form onSubmit={handleSubmitText2}>
                            <br />
                            <textarea
                                value={texto2}
                                onChange={(event) => settexto2(event.target.value)}
                                placeholder="Nuevo texto Párrafo"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm bg-white"
                            />
                            <br />
                            <button
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:pointer-events-none"
                                type="submit"
                                disabled={cargando}
                             >
                                 Guardar Párrafo
                             </button>
                        </form>
                        <br />
                        <br />
                        {MensajeTexto2 && <p>{MensajeTexto2}</p>}
                    </div>

                </div>
            </div>
        </div>
    );
}