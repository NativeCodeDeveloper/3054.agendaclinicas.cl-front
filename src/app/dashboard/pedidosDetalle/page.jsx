'use client'
import {useSearchParams} from "next/navigation";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import { useEffect, useState, Suspense } from "react";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import {ShadcnTable} from "@/Componentes/shadcnTable";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import Link from "next/link";
import {Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {Textarea} from "@/components/ui/textarea";
import {InfoButton} from "@/Componentes/InfoButton";


function PedidoDetalleInner(){
    const searchParams = useSearchParams();
    const id_pedido = searchParams.get("id");
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [detalleComprador, setDetalleComprador] = useState([]);
    const [nuevoestado, setnuevoEstado] = useState("");



    const [asunto, setAsunto] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [isEnviandoSeguimiento, setIsEnviandoSeguimiento] = useState(false);


    async function seguimientoCliente(asunto,email,mensaje){
        try {
            if (!asunto || !email || !mensaje) {
                toast.error('Para hacer el seguimiento debe llenar todos los campos de texto');
                return false;
            }

            const res = await fetch(`${API}/correo/seguimiento`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({asunto,email,mensaje}),
                cache: "no-cache"
            })

            if(!res.ok){
                toast.error('No se pudo enviar el correo de seguimiento (respuesta del servidor no válida)');
                return false;
            }

            const respuestaBackend = await res.json();
            return respuestaBackend.message === true;

        }catch(error){
            console.log(error);
            toast.error('No se pudo enviar el correo de seguimiento: ' + (error?.message ?? 'Error desconocido'));
            return false;
        }
    }

    async function handleEnviarSeguimiento() {
        if (isEnviandoSeguimiento) return;
        try {
            setIsEnviandoSeguimiento(true);

            const ok = await seguimientoCliente(asunto, email, mensaje);

            if (ok) {
                toast.success("Correo de seguimiento enviado correctamente");
            } else {
                toast.error("No se pudo enviar el correo de seguimiento");
            }

        } finally {
            setIsEnviandoSeguimiento(false);
        }
    }


    async function obtenerDetallesComprador(id_pedido){
        try {
            const res = await fetch(`${API}/pedidos/seleccionarPorid`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json",},
                body: JSON.stringify({ id_pedido }),
                mode: "cors"
            });

            if(!res.ok){
                return toast.error('Ha ocurrido un problema porfavor contacte a soporte de NativeCode');
            }else{

                const dataDetalles = await res.json();
                setDetalleComprador(dataDetalles);
            }
        }catch (error) {
            console.log(error);
            return toast.error('Ha ocurrido un problema porfavor contacte a soporte de NativeCode'  + error.message);

        }
    }

    useEffect(() => {
        if (id_pedido) {
            obtenerDetallesComprador(id_pedido);
        }
    }, [id_pedido]);



    async function cambiarEstado(id_pedido, nuevoestado){
        if(!nuevoestado || !id_pedido){
            return toast.error("viene vacio un dato")
        }

        let estado_pedido;
        const estadoNormalizado = String(nuevoestado).trim().toUpperCase();

        if (estadoNormalizado.includes("PAGO SIN COMPLETAR") || estadoNormalizado.includes("PAGO PENDIENTE") || estadoNormalizado.includes("PENDIENTE PAGO")) {
            estado_pedido = '0';
        } else if (estadoNormalizado.includes("COMPRA REALIZADA") || estadoNormalizado.includes("COMPLETADO") || estadoNormalizado.includes("CONFIRMADO")) {
            estado_pedido = 1;
        } else if (estadoNormalizado.includes("COMPRA ANULADA") || estadoNormalizado.includes("ANULADO")) {
            estado_pedido = 4;
        } else {
            return toast.error("Estado no reconocido: " + nuevoestado);
        }

        try {

            const res = await fetch(`${API}/pedidos/cambioEstado`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json",},
                mode: "cors",
                body: JSON.stringify({estado_pedido,id_pedido}),
            })

            if(!res.ok){
                return toast.error("PROBLEMA EN EN resok")
            }else {

                const respuestaDelController = await res.json();

                if(respuestaDelController.message === true){
                    await obtenerDetallesComprador(id_pedido)
                    return toast.success("Se ha actualizado el estado del Pedido!");
                }else {
                    return toast.error("No se ha podido actualizar el estado del Pedido!, Contacte al Administrador del Sistema");
                }
            }
        }catch (error) {
            console.log(error);
            return toast.error('Ha ocurrido un problema porfavor contacte a soporte de NativeCode'  + error.message);
        }
    }




    const [listaDetallada, setListaDetallada] = useState([]);

    async function obtenerListaDetallada(id_pedido){
        try {
            if(!id_pedido){
                return toast.error("Ha ocurrido un error en cargar el ID del pedido porfavor  contacte a soporte de NativeCode");
            }else{

                const res = await fetch(`${API}/pedidos/seleccionarDetalle`, {
                    method: "POST",
                    headers: {Accept: "application/json",
                        "Content-Type": "application/json",},
                    mode: "cors",
                    body: JSON.stringify({id_pedido}),
                })
                if(!res.ok){
                    return toast.error("problema en servidor porfavor contacte a soporte de NativeCode");
                }else{
                    const dataPedidoDetalle = await res.json();
                    setListaDetallada(dataPedidoDetalle);
                }
            }
        }catch (error) {
            console.log(error);
            return toast.error('Ha ocurrido un problema porfavor contacte a soporte de NativeCode'  + error.message);
        }
    }

    useEffect(() => {
        if (id_pedido) {
            obtenerListaDetallada(id_pedido);
        }
    }, [id_pedido]);

    const pedidoDetalle = listaDetallada || [{id_producto: 0, tituloProducto: "SIN DATO", cantidad: 0, precio_unitario: 0}]

    const totalCompra = pedidoDetalle.reduce((acc, pedido) => acc + (pedido.precio_unitario * pedido.cantidad), 0);


    useEffect(() => {
        if (detalleComprador.length > 0) {
            setEmail(detalleComprador[0].email_Comprador);
        }
    }, [detalleComprador]);


    return (
        <div>
            <ToasterClient />
            {/*PANTALLAS ESCRITORIO*/}
            <div className="hidden md:block">
                <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 px-4 py-6 sm:px-10 sm:py-10">

                    <div className='flex justify-end '>
                        <InfoButton informacion={"En este apartado, usted puede cambiar el estado del pedido mediante el botón “Cambiar estado”. Debajo de este botón se muestra el estado actual de la compra, permitiéndole identificar fácilmente en qué etapa del proceso se encuentra.\n" +
                            "\n" +
                            "Además, se indica la fecha en que se realizó el pedido, junto con los datos demográficos de la persona que efectuó la transacción de compra, facilitando la identificación y el seguimiento del cliente.\n" +
                            "\n" +
                            "En la sección de seguimiento, usted tiene la posibilidad de recuperar carritos perdidos enviando mensajes directamente al correo electrónico del cliente. En caso de que el correo no sea válido o no se encuentre registrado, el sistema mostrará un mensaje indicando que el correo proporcionado no existe o no es válido.\n" +
                            "\n" +
                            "Al final de la pantalla, usted encontrará el listado detallado de los productos o servicios que el cliente agregó al carrito de compras.\n"}/>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-6">


                        <div className="space-y-1">
                            <h1 className="text-4xl sm:text-3xl font-semibold text-sky-800 tracking-tight">
                                Detalle del pedido
                            </h1>
                            <p className="text-xs text-slate-500">
                                Revisa la información del cliente y el estado del pedido desde un solo lugar.
                            </p>
                        </div>


                        <Link href={"/dashboard/pedidosCompras"}>
                            <ShadcnButton
                                className="text-xs  bg-sky-950"
                                nombre={"Volver a Listado"} />
                        </Link>

                    </div>

                    <div className="w-100 mt-6 rounded-xl border border-sky-100 bg-white/70 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 shadow-sm">
                        <ShadcnSelect

                            nombreDefault={"ESTADO COMPRA"}
                            value1={"COMPRA REALIZADA"}
                            value3={"PAGO SIN COMPLETAR"}
                            value5={"COMPRA ANULADA"}
                            onChange={(value) => setnuevoEstado(value)}
                        />

                        <ShadcnButton  className="text-xs  bg-sky-950" funcion={()=>cambiarEstado(id_pedido, nuevoestado)} nombre={"Cambiar Estado"} />
                    </div>

                    {/*

        ESTADOS DE LOS PEDIDOS:
        --------------------------
         1: "Pendiente"
         2: "Confirmado"
         3: "Completado"
         4: "Anulado"
         0: pendiente pago

        */}
                    <br/>

                    {detalleComprador.map(comprador => (
                        <div key={comprador.id_pedido} className="mt-8">
                            <h3 className="text-xs font-medium text-slate-500 mb-2">
                                Estado actual
                            </h3>
                            <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-800">
                                {(
                                    {
                                        1: "COMPRA REALIZADA",
                                        4: "COMPRA ANULADA"
                                    }
                                )[comprador.estado_pedido] ?? "PAGO SIN COMPLETAR"}
                            </div>
                        </div>
                    ))}



                    <br/><br/>
                    {detalleComprador.map(comprador => (
                        <div key={comprador.id_pedido} className="space-y-3">
                            <h3 className="text-2xl  text-green-800 font-medium"><span className="text-2xl  text-green-500 font-semibold">Fecha Pedido</span>: {formatearFecha(comprador.fecha_pedido)}</h3>

                        </div>
                    ))}

                    <div className="mt-8 grid grid-cols-2 gap-6 bg-white/80 border border-sky-100 rounded-xl p-6 sm:p-8 shadow-sm">

                        {detalleComprador.map(comprador => (
                            <div key={comprador.id_pedido} className="space-y-3">
                                <h3 className="text-base text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Nombre Completo</span>:{' ' + comprador.nombre_comprador + ' ' + comprador.apellidosComprador }  </h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Telefono</span>: {comprador.telefono_comprador}</h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Email</span>: {comprador.email_Comprador}</h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">RUT</span>: {comprador.identificacion_comprador}</h3>
                            </div>
                        ))}

                        {detalleComprador.map(comprador => (
                            <div key={comprador.id_pedido} className="space-y-3">
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Dirección</span>: {comprador.direccion_despacho}</h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Comuna</span>: {comprador.comuna}</h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Región / País</span>: {comprador.regionPais}</h3>
                                <h3 className="text-base  text-sky-800 font-medium"><span className="text-base  text-sky-500 font-semibold">Comentarios</span>: {comprador.comentarios || "Sin comentarios"}</h3>
                            </div>
                        ))}


                    </div>


                    <br/><br/>

                    <div className="mt-8 bg-gradient-to-br from-white to-sky-50 border border-sky-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-base  font-semibold text-sky-800 tracking-tight">Seguimiento de Cliente</h1>
                                <p className="text-xs text-slate-500">Envía un correo personalizado al cliente sobre su pedido</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="tituloCorreo" className="block text-base font-semibold text-sky-700 mb-2">
                                    Asunto del correo
                                </label>
                                <ShadcnInput
                                    id="asunto"
                                    value={asunto}
                                    onChange={e => setAsunto(e.target.value)}
                                    placeholder="Ej: Actualización de tu pedido #123"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="mensajeCorreo" className="block text-base font-semibold text-sky-700 mb-2">
                                    Mensaje
                                </label>
                                <Textarea
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    id="mensajeCorreo"
                                    placeholder="Escribe aquí el mensaje para el cliente..."
                                    className="w-full text-xs min-h-[160px] resize-none rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <ShadcnButton
                                    funcion={handleEnviarSeguimiento}
                                    disabled={isEnviandoSeguimiento}
                                    className={`text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${isEnviandoSeguimiento ? "opacity-60 pointer-events-none" : ""}`}
                                    nombre={isEnviandoSeguimiento ? "Enviando..." : "Enviar Seguimiento"}
                                />
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="mt-10 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
                                    Productos del pedido
                                </h2>

                            </div>
                            <span className="hidden sm:inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                    {pedidoDetalle.length} productos
                </span>
                        </div>

                        <div className="bg-white border border-sky-100 rounded-xl shadow-sm overflow-x-auto">
                            <div className="min-w-full">
                                <Table>
                                    <TableCaption>Tabla Detalle pedidos.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="px-4 py-3">Producto</TableHead>
                                            <TableHead className="px-4 py-3">Cantidad </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pedidoDetalle.map((pedido) => (
                                            <TableRow key={pedido.id_producto}>
                                                <TableCell className="px-4 py-3">{pedido.tituloProducto}</TableCell>
                                                <TableCell className="px-4 py-3">{pedido.cantidad}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3} className="px-4 py-3">Total Compra</TableCell>
                                            <TableCell className="justify-start px-4 py-3">{totalCompra}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            {/*PANTALLAS CELULARES*/}
            <div className="block md:hidden">
                <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 px-4 py-6 sm:px-10 sm:py-10">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-100 pb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-sky-800 tracking-tight">
                                Detalle del pedido
                            </h1>
                            <p className="text-xs text-slate-500">
                                Revisa la información del cliente y el estado del pedido desde un solo lugar.
                            </p>
                        </div>


                        <Link href={"/dashboard/pedidosCompras"}>
                            <ShadcnButton
                                className="text-xs  bg-sky-950"
                                nombre={"Volver a Listado"} />
                        </Link>

                    </div>

                    <div className="w-70 mt-6 rounded-xl border border-sky-100 bg-white/70 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 shadow-sm">
                        <ShadcnSelect

                            nombreDefault={"ESTADO COMPRA"}
                            value1={"COMPRA REALIZADA"}
                            value3={"PAGO SIN COMPLETAR"}
                            value5={"COMPRA ANULADA"}
                            onChange={(value) => setnuevoEstado(value)}
                        />

                        <ShadcnButton  className="text-xs  bg-sky-950" funcion={()=>cambiarEstado(id_pedido, nuevoestado)} nombre={"Cambiar Estado"} />
                    </div>

                    {/*

        ESTADOS DE LOS PEDIDOS:
        --------------------------
         1: "Pendiente"
         2: "Confirmado"
         3: "Completado"
         4: "Anulado"
         0: pendiente pago

        */}
                    <br/>

                    {detalleComprador.map(comprador => (
                        <div key={comprador.id_pedido} className="mt-8">
                            <h3 className="text-xs font-medium text-slate-500 mb-2">
                                Estado actual
                            </h3>
                            <div className="inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-800">
                                {(
                                    {
                                        1: "COMPRA REALIZADA",
                                        4: "COMPRA ANULADA"
                                    }
                                )[comprador.estado_pedido] ?? "PAGO SIN COMPLETAR"}
                            </div>
                        </div>
                    ))}



                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/80 border border-sky-100 rounded-xl p-6 sm:p-8 shadow-sm">

                        <h1 className="text-base font-bold text-sky-800" >Informacion detallada </h1>
                        {detalleComprador.map(comprador => (
                            <div key={comprador.id_pedido} className="space-y-3">
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Nombre</span>: {comprador.nombre_comprador}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Apellido</span>: {comprador.apellidosComprador}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Telefono</span>: {comprador.telefono_comprador}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Email</span>: {comprador.email_Comprador}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">RUT</span>: {comprador.identificacion_comprador}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Fecha Pedido</span>: {formatearFecha(comprador.fecha_pedido)}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xstext-sky-500 font-semibold">Dirección</span>: {comprador.direccion_despacho}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Comuna</span>: {comprador.comuna}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Región / País</span>: {comprador.regionPais}</h3>
                                <h3 className="text-xs text-sky-800 font-medium"><span className="text-xs text-sky-500 font-semibold">Comentarios</span>: {comprador.comentarios || "Sin comentarios"}</h3>
                            </div>
                        ))}

                    </div>
                    <br/><br/>

                    <div className="mt-8 bg-gradient-to-br from-white to-sky-50 border border-sky-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-base  font-semibold text-sky-800 tracking-tight">Seguimiento de Cliente</h1>
                                <p className="text-xs text-slate-500">Envía un correo personalizado al cliente sobre su pedido</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="tituloCorreo" className="block text-base font-semibold text-sky-700 mb-2">
                                    Asunto del correo
                                </label>
                                <ShadcnInput
                                    id="asunto"
                                    value={asunto}
                                    onChange={e => setAsunto(e.target.value)}
                                    placeholder="Ej: Actualización de tu pedido #123"
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="mensajeCorreo" className="block text-base font-semibold text-sky-700 mb-2">
                                    Mensaje
                                </label>
                                <Textarea
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    id="mensajeCorreo"
                                    placeholder="Escribe aquí el mensaje para el cliente..."
                                    className="w-full text-xs min-h-[160px] resize-none rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <ShadcnButton
                                    funcion={handleEnviarSeguimiento}
                                    disabled={isEnviandoSeguimiento}
                                    className={`text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${isEnviandoSeguimiento ? "opacity-60 pointer-events-none" : ""}`}
                                    nombre={isEnviandoSeguimiento ? "Enviando..." : "Enviar Seguimiento"}
                                />
                            </div>
                        </div>
                    </div>

                    <br/>
                    <div className="mt-10 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
                                    Productos del pedido
                                </h2>

                            </div>
                            <span className="hidden sm:inline-flex items-center rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                    {pedidoDetalle.length} productos
                </span>
                        </div>

                        <div className="bg-white border border-sky-100 rounded-xl shadow-sm overflow-x-auto">
                            <div className="min-w-full">
                                <Table>
                                    <TableCaption>Tabla Detalle pedidos.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="px-4 py-3">Producto</TableHead>
                                            <TableHead className="px-4 py-3">Cantidad </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pedidoDetalle.map((pedido) => (
                                            <TableRow key={pedido.id_producto}>
                                                <TableCell className="px-4 py-3">{pedido.tituloProducto}</TableCell>
                                                <TableCell className="px-4 py-3">{pedido.cantidad}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={3} className="px-4 py-3">Total Compra</TableCell>
                                            <TableCell className="justify-start px-4 py-3">{totalCompra}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PedidoDetalle() {
    return (
        <Suspense fallback={<div className="p-4">Cargando detalle del pedido...</div>}>
            <PedidoDetalleInner />
        </Suspense>
    );
}