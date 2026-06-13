'use client'
import {useState, useEffect, Suspense} from 'react';
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import MediaCardImage from "@/Componentes/MediaCardImage";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import {useCarritoGlobal} from "@/ContextosGlobales/CarritoContext";
import {useRouter, useSearchParams} from "next/navigation";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



export default function Catalogo() {
    return (
        <Suspense fallback={'...Loading'}>
            <CatalogoSuspense/>
        </Suspense>
    )
}



function CatalogoSuspense(){
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [_carrito, setCarrito] = useCarritoGlobal();
    const [listaProductos, setlistaProductos] = useState([]);
    const [mujeres, setmujeres] = useState(true);
    const [hombres, sethombres] = useState(false);
    const [listaSubcategoria, setListaSubcategoria] = useState([]);
    const [subCategoria, setSubCategoria] = useState(undefined);
    const [listasubsubCategoria, setlistasubsubCategoria] = useState([]);
    const searchparams = useSearchParams();
    const seccion = searchparams.get("seccion")
    

    function irProductosPorCategoria(id_subcategoria) {
        router.push(`/producto/${id_subcategoria}`);
    }











    async function listarSubSubcategoriasCatalogo(id_subcategoria) {
        try {
            const res = await fetch(`${API}/subsubcategorias/seleccionarPorSubSubCategoriaPorIdSubCategoria`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({id_subcategoria}),
                mode: "cors"
            })

            if(!res.ok){
                return;
            }

            const dataSubSubcategoria = await res.json();
            if (Array.isArray(dataSubSubcategoria)){
                setlistasubsubCategoria(dataSubSubcategoria);
            }else {
                setlistasubsubCategoria([])
            }

        }catch (e) {
            return toast.error('No ha sido posible listar las subcategorias contacte  a soporte de NativeCode: ERROR :' + e);
        }
    }


    useEffect(() => {
        if (subCategoria) {
            listarSubSubcategoriasCatalogo(subCategoria);
        } else {
            setlistasubsubCategoria([]);
        }

    },[subCategoria])







    const router = useRouter();

    function verEspecificacionProducto(id_producto){
        try {
            router.push(`/producto/${id_producto}`);
        }catch(err){
            return toast.error("No se puede ver las especificaciones del producto consulte con el administrador.")
        }
    }

    async function seleccionarProductosPorSubcategoria(subCategoria) {
        try {

            const res = await fetch(`${API}/producto/seleccionarPorSubcategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({subCategoria: Number(subCategoria),}),
                mode: 'cors'
            })

            if (!res.ok) {
                return toast.error("No hay respuesta del servidor contacte al administrador.")
            }else {

                const dataSubcategoria = await res.json();
                setlistaProductos(dataSubcategoria);
            }
        }catch (e) {
            return toast.error("No hay respuesta del servidor")
        }
    }

    useEffect(() => {
 if (!subCategoria) return;
 seleccionarProductosPorSubcategoria(subCategoria);

    }, [subCategoria]);




    useEffect(() => {
        async function cargarYSeleccionarSubcategoria() {
            let subcategorias = [];
            if (hombres) {
                subcategorias = await listarSubcategoriaHombre();
            } else {
                subcategorias = await listarSubcategoriaMujer();
            }

            if (Array.isArray(subcategorias) && subcategorias.length > 0) {
                setSubCategoria(String(subcategorias[0].id_subcategoria));
            } else {
                setSubCategoria(undefined); // O null, para que no quede una subcategoría seleccionada
            }
        }
        cargarYSeleccionarSubcategoria();
    },[hombres]);


    function anadirProducto(producto){
        setCarrito(productosAnteriores =>[...productosAnteriores, producto]);
        return toast.success("Producto Agregado al carrito!");
    }

    function comprarProducto(producto){
        setCarrito(productosAnteriores =>[...productosAnteriores, producto]);
        router.push('/carrito');
    }

    const formatoCLP = (valor) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(valor);
    };

    async function seleccionarProductosHombres(){
        try {
            const res = await fetch(`${API}/producto/categoriaProducto`, {
                method: "POST",
                headers: {Accept: "application/json",
                    "Content-Type": "application/json"},
                body: JSON.stringify({
                    categoriaProducto: 48
                }),
                mode: "cors"
            })

            if (!res.ok) {

                return toast.error('Ha ocurrido un error al listar los productos de Hombre. Contacte a Soporte.');

            } else {

                const resultadoData = await res.json();
                setlistaProductos(resultadoData);
                setmujeres(false);
                sethombres(true);

                // --- NUEVA LÓGICA ---
                const subcategorias = await listarSubcategoriaHombre(); // Carga y actualiza listaSubcategoria
                if (Array.isArray(subcategorias) && subcategorias.length > 0) {
                    setSubCategoria(String(subcategorias[0].id_subcategoria));
                } else {
                    setSubCategoria(undefined);
                }
                // --- FIN NUEVA LÓGICA ---
            }
        }catch(err){
            return toast.error('Ha ocurrido un error al listar los productos de Hombre. Contacte a Soporte.');
        }
    }





    async function seleccionarProductosMujer(){
        try {
            const res = await fetch(`${API}/producto/categoriaProducto`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json"},
                body: JSON.stringify({
                    categoriaProducto: 49
                }),
                mode: "cors"
            })

            if (!res.ok) {

                return toast.error('Ha ocurrido un error al listar los productos de Mujer. Contacte a Soporte.');

            } else {

                const resultadoData = await res.json();
                setlistaProductos(resultadoData);
                setmujeres(true);
                sethombres(false);

                // --- NUEVA LÓGICA ---
                const subcategorias = await listarSubcategoriaMujer(); // Carga y actualiza listaSubcategoria
                if (Array.isArray(subcategorias) && subcategorias.length > 0) {
                    setSubCategoria(String(subcategorias[0].id_subcategoria));
                } else {
                    setSubCategoria(undefined);
                }
                // --- FIN NUEVA LÓGICA ---
            }
        }catch(err){
            return toast.error('Ha ocurrido un error al listar los productos de Mujer. Contacte a Soporte.');
        }
    }


    async function cargarTodosProductos(){
        try {

            const res = await fetch(`${API}/producto/seleccionarProducto`, {
                method: 'GET',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                mode: 'cors'
            })

            if(!res.ok){
                return toast.error('No ha sido posible cargar los datos desde el servidor, contacte a soporte de NativeCode');
            }else{
                const dataProductos = await res.json();
                setlistaProductos(dataProductos);
            }
        }catch(error){
            return toast.error('Problema en cargar los dat desde el servidor contacte a soporte de NativeCode');
        }
    }

    useEffect(() => {
        if(seccion === 'hombre'){
            seleccionarProductosHombres ()
            setmujeres(false);
            sethombres(true);
        }else{
            sethombres(false);
            setmujeres(true);
        }
    },[seccion]);





    async function listarSubcategoriaHombre(){
        try {

            const res = await fetch(`${API}/subcategorias/seleccionarPorCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                'Content-Type': 'application/json'},
                body: JSON.stringify({id_categoriaProducto : 48}),
                mode: 'cors'
            })
            if (!res.ok) {
                toast.error("No se pueden listar subcategorias porque no hay hay respuesta desde el servidor.")
                return []; // Devuelve un array vacío en caso de error
            }else{

                const backendData = await res.json();
                setListaSubcategoria(backendData);
                return backendData; // Devuelve la lista
            }
        }catch(error){
            toast.error("No se pueden listar subcategorias porque no hay hay respuesta desde el servidor.")
            return []; // Devuelve un array vacío en caso de error
        }

    }



    async function listarSubcategoriaMujer(){
        try {

            const res = await fetch(`${API}/subcategorias/seleccionarPorCategoria`, {
                method: 'POST',
                headers: {Accept: 'application/json',
                    'Content-Type': 'application/json'},
                body: JSON.stringify({id_categoriaProducto : 49}),
                mode: 'cors'
            })
            if (!res.ok) {
                toast.error("No se pueden listar subcategorias porque no hay hay respuesta desde el servidor.")
                return []; // Devuelve un array vacío en caso de error
            }else{

                const backendData = await res.json();
                setListaSubcategoria(backendData);
                return backendData; // Devuelve la lista
            }
        }catch(error){
            toast.error("No se pueden listar subcategorias porque no hay hay respuesta desde el servidor.")
            return []; // Devuelve un array vacío en caso de error
        }

    }





    return (
        <div>
            <ToasterClient/>
            <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 flex items-center justify-center">
                <div className="w-full max-w-5xl px-4 py-10 sm:py-14 md:py-16">
                    <h1 className="mx-auto max-w-3xl text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white">
                        Catálogo de Servicios
                    </h1>

                    <p className="hidden md:block mx-auto mt-4 max-w-4xl text-center text-sm leading-relaxed tracking-wide text-white/95">
                        Diseñado para pacientes que buscan atención odontológica moderna, segura y efectiva. Nuestra planificación clínica combina tecnología y protocolos personalizados para mejorar tu salud oral y tu confianza desde la primera sesión.
                    </p>

                    <p className="md:hidden mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed tracking-wide text-white/95">
                        Diseñado para pacientes que buscan atención odontológica de excelencia.
                    </p>
                </div>
            </div>

     <div className="flex justify-center mt-8 px-4">
         <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/80 p-4 sm:p-6 shadow-lg ring-1 ring-indigo-100/80 backdrop-blur">
             {/* soft gradient glow */}
             <div className="pointer-events-none absolute -inset-16 bg-gradient-to-r from-purple-500/16 via-indigo-500/16 to-cyan-400/14 blur-3xl" />
             {/* top accent */}
             <div className="relative h-1 w-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

             <div className="relative mt-4">
                 <p className="mx-auto max-w-2xl text-center text-base sm:text-xl font-extrabold tracking-tight text-slate-800">
                     Selecciona tu categoría y descubre el plan ideal para tu salud oral
                 </p>
                 <p className="mx-auto mt-1 max-w-2xl text-center text-xs sm:text-sm text-slate-500">
                     Elige una categoría para ver servicios y valores referenciales.
                 </p>

                 <div className="mt-5 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                     {/* HOMBRE */}
                     <button
                         type="button"
                         onClick={seleccionarProductosHombres}
                         className={`group relative w-full max-w-[240px] rounded-2xl p-4 sm:p-5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${hombres ? 'ring-2 ring-amber-400/70 shadow-[0_0_0_1px_rgba(251,191,36,0.40),0_14px_44px_-28px_rgba(245,158,11,0.55)]' : 'ring-1 ring-slate-200 hover:ring-amber-300/60 hover:shadow-md'} bg-white/70`}
                     >
                         <div className="relative mx-auto flex h-[150px] w-[150px] sm:h-[180px] sm:w-[180px] items-center justify-center">
                             {/* glow */}
                             <div className="pointer-events-none absolute -inset-6 rounded-full bg-amber-300/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                             <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-100 ring-1 transition-all ${hombres ? 'ring-amber-300/70' : 'ring-indigo-100 group-hover:ring-amber-200/60'}`} />
                             <img
                                 src={"/hombre3.png"}
                                 alt={"Hombre"}
                                 width={180}
                                 height={180}
                                 className="relative z-10 h-full w-full rounded-full object-cover"
                             />
                         </div>

                         <div className="mt-4 text-center">
                             <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.24em] ${hombres ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'} transition-all duration-300`}
                             >
                                 HOMBRE
                             </span>

                         </div>
                     </button>

                     {/* MUJER */}
                     <button
                         type="button"
                         onClick={seleccionarProductosMujer}
                         className={`group relative w-full max-w-[240px] rounded-2xl p-4 sm:p-5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${mujeres ? 'ring-2 ring-amber-400/70 shadow-[0_0_0_1px_rgba(251,191,36,0.40),0_14px_44px_-28px_rgba(245,158,11,0.55)]' : 'ring-1 ring-slate-200 hover:ring-amber-300/60 hover:shadow-md'} bg-white/70`}
                     >
                         <div className="relative mx-auto flex h-[150px] w-[150px] sm:h-[180px] sm:w-[180px] items-center justify-center">
                             {/* glow */}
                             <div className="pointer-events-none absolute -inset-6 rounded-full bg-amber-300/25 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                             <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-100 ring-1 transition-all ${mujeres ? 'ring-amber-300/70' : 'ring-indigo-100 group-hover:ring-amber-200/60'}`} />
                             <img
                                 src={"/mujer1.png"}
                                 alt={"Mujer"}
                                 width={180}
                                 height={180}
                                 className="relative z-10 h-full w-full rounded-full object-cover"
                             />
                         </div>

                         <div className="mt-4 text-center">
                             <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[0.24em] ${mujeres ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-200' : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'} transition-all duration-300`}
                             >
                                 MUJER
                             </span>

                         </div>
                     </button>
                 </div>
             </div>
         </div>
     </div>


<div className="w-full mt-10 px-4">
    <div className="mx-auto w-full max-w-md">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-600">
            Filtrar servicios
        </p>

        <Select value={subCategoria} onValueChange={(value) => setSubCategoria(value)}>
            <SelectTrigger className="w-full justify-between rounded-2xl border border-indigo-200/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-indigo-100/60 backdrop-blur hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500/40">
                <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Filtrar por categoría</SelectLabel>
                    {listaSubcategoria.map((subcategoria) => (
                        <SelectItem
                            key={subcategoria.id_subcategoria}
                            value={String(subcategoria.id_subcategoria)}
                        >
                            {subcategoria.descripcionCategoria}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>

        <p className="mt-2 text-center text-[11px] text-slate-500">
            Tip: elige una categoría para ver solo los servicios relacionados.
        </p>
    </div>
</div>

            {mujeres && (
                <div className='w-full flex justify-center items-center gap-6 mt-20 px-4'>
                    <h1 className='bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-4xl md:text-5xl font-bold text-transparent bg-clip-text'>MUJERES</h1>
                </div>

            )}




            {hombres && (
                <div className='w-full flex justify-center items-center gap-6 mt-20 px-4'>
                    <h1 className='bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-4xl md:text-5xl font-bold text-transparent bg-clip-text'>HOMBRES</h1>
                </div>

            )}


            <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
                {listasubsubCategoria.map((subsubcategoria) => (
                    <div
                        key={subsubcategoria.id_subsubcategoria}
                        className="group relative flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-indigo-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                        {/* Glow / gradient border */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-cyan-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                        {/* Top accent */}
                        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

                        <div className="relative flex h-full flex-col p-6 sm:p-8">
                            {/* Imagen estandarizada */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-cyan-50 ring-1 ring-indigo-100">
                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10]">
                                    <img
                                        src={`https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${subsubcategoria.imagenReferencial}/card`}
                                        alt={subsubcategoria.descripcionSubSubCategoria || 'imagen'}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-indigo-900/20 via-transparent to-transparent" />
                                {/* Badge */}
                                <div className="absolute left-4 top-4">
                                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold tracking-[0.22em] text-slate-800 ring-1 ring-slate-200 backdrop-blur">
                                        CLÍNICA
                                    </span>
                                </div>
                            </div>

                            {/* Texto */}
                            <div className="mt-5 flex flex-1 flex-col">
                                <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                                    {subsubcategoria.descripcionSubSubCategoria}
                                </h1>
                                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                    Atención odontológica segura y planificada, con resultados progresivos según diagnóstico clínico.
                                </p>
                                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                                {/* Botón único */}
                                <button
                                    type="button"
                                    onClick={() => irProductosPorCategoria(subsubcategoria.id_subsubcategoria)}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 px-5 py-3 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-indigo-500/20 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                                >
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    COMPRAR
                                </button>
                                <p className="mt-3 text-center text-[11px] text-slate-500">
                                    Verás los servicios disponibles para esta categoría.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
