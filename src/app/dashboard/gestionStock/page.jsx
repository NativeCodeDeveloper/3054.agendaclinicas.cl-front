"use client"
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import Image from "next/image";

export default function GestionStock() {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [productos, setProductos] = useState([])
    const [nuevoStock, setNuevoStock] = useState({});
    const [productoSimilar, setProductoSimilar] = useState("");

    const CLOUDFLARE_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_HASH;
    const VARIANT_CARD = 'card';
    const VARIANT_FULL='full';
    const VARIANT_MINI = 'mini';


    function cfToSrc(imageId) {
        if (!imageId) return "";
        return `https://imagedelivery.net/${CLOUDFLARE_HASH}/${imageId}/${VARIANT_MINI}`;
    }

    async function buscarProductoSimilar(productoSimilar){
        let tituloProducto = productoSimilar;

        try {
            const res = await fetch(`${API}/producto/buscarSimilar`,{
                method: "POST",
                headers:{
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({tituloProducto}),
                mode: "cors"
            })

            if(!res.ok){
                return toast.error("No se han encontrado similitudes por problemas tecnicos porfavor contacte al equipo de soporte de NativeCode.cl");
            }else{

                const data = await res.json();
                if(Array.isArray(data)){
                    setProductos(data)
                }

                if(data.length > 0){
                    return toast.success("Se han encontrado similitudes")

                }else {
                    return toast.error("No Se han encontrado similitudes")
                }

            }

        }catch (error) {
            console.log(error);
            return toast.error("Se ha producido un problema contacte a soporte informatico de NativeCode.cl");
        }
    }





    async function actualizarStock(cantidadStock,id_producto) {
        try {
            const res = await fetch(`${API}/producto/actualizarStock`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({cantidadStock, id_producto}),
                mode: "cors"
            })
            if (!res.ok) {
                return toast.error("Error al Actualizar producto / Verifique que no hayan campos vacios");
            }else{
                const resultado = await res.json();
                if (resultado.message === "ok") {
                    await listarProductos();
                    return toast.success("Stock de producto actualizado con exito!");
                }
            }
        }catch(err) {
            console.log(err);
            return toast.error("Error al Actualizar producto / Contacte a soporte Informatico de NativeCode");

        }
    }










    async function listarProductos() {
        try {
            const res = await fetch(`${API}/producto/seleccionarProducto`,{
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            })
            if(!res.ok){
                return toast.error("No ha sido posible listar los productos para la edicion, contacte a soporte Informatico de NativeCode")
            }else {
                const dataProductos = await res.json();
                setProductos(dataProductos);
            }
        }catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        listarProductos();
    },[])




    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 text-slate-900 py-10">
            <ToasterClient/>
            <div className="mx-auto max-w-6xl px-4">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-800 to-sky-700">
                Gestión de Inventario
              </span>
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Administra el stock de tus productos de forma clara y profesional.
                    </p>
                </header>

                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-stretch gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={productoSimilar}
                                onChange={(event) => setProductoSimilar(event.target.value)}
                                placeholder="Buscar por título o palabra clave..."
                                aria-label="Buscar similitudes de producto"
                                className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                {/* simple magnifying glass icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 104.165 9.33l3.003 3.003a.75.75 0 101.06-1.06l-3.003-3.004A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => buscarProductoSimilar(productoSimilar)}
                            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-700 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-sky-800 hover:to-sky-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                        >
                            <span className="mr-2 hidden md:inline">Buscar</span>
                            {/* search icon duplicated for button for consistency */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 104.165 9.33l3.003 3.003a.75.75 0 101.06-1.06l-3.003-3.004A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Ingresa un término y presiona <span className="font-medium text-slate-700">Buscar</span> para encontrar productos similares.</p>
                </div>

                <div className="space-y-4">
                    {productos.map((producto) => (
                        <div
                            key={producto.id_producto}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition"
                        >

                            <img src={cfToSrc(producto.imagenProducto,)} alt="Producto" className="rounded-2xl h-25 w-25 hidden md:block" />


                            <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wider text-slate-500">Producto</span>
                                <span className="text-base font-medium text-slate-800">
                    {producto.tituloProducto}
                  </span>
                            </div>

                            <div className="flex items-center gap-6">
                  <span className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    Stock: {producto.cantidadStock}
                  </span>

                                <input
                                    min="0"
                                    step="1"
                                    type="number"
                                    className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none transition focus:border-slate-500"
                                    value={nuevoStock[producto.id_producto] ?? ""}
                                    onChange={(e) =>
                                        setNuevoStock((objetoPrevio) => ({
                                            ...objetoPrevio,
                                            [producto.id_producto]: e.target.value,
                                        }))
                                    }
                                />

                                <button
                                    onClick={() =>
                                        actualizarStock(Number(nuevoStock[producto.id_producto] ?? 0), producto.id_producto)
                                    }
                                    type="button"
                                    className="rounded-lg border border-slate-400 bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
