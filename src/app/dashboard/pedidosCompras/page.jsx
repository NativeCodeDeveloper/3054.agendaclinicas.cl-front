"use client"
import {useEffect, useState} from "react";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {InfoButton} from "@/Componentes/InfoButton";

export default function PedidosCompra() {
    const [pedidos, setPedidos] = useState([]);
    const [comprador, setComprador] = useState("");

    const API = process.env.NEXT_PUBLIC_API_URL;

    const router = useRouter();

    const verDetalle = (id) =>{
        router.push(`/dashboard/pedidosDetalle?id=${id}`);
    }



    function formatearFecha(fecha) {
        const date = new Date(fecha);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        return `${year}-${month}-${day}`;
    }


    async function filtrarSimilitudNombre(nombre_comprador) {
        try {
            const res = await fetch(`${API}/pedidos/seleccionarPorComprador`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json",},
                body: JSON.stringify({nombre_comprador}),
                cache: "no-cache",
            })

            if (!res.ok) {
                return toast.error('Debe indicar un nombre para realizar el filtro (NO APELLIDO)');
            }else{
                const dataFiltradoPorNombre = await res.json();
                setPedidos(dataFiltradoPorNombre);
            }

        }catch (error) {
            console.log(error);
            return toast.error('Se ha Producido el siguiente error , contacte a soporte de NativeCode: '  + error);
        }
    }


    async function filtrarPorEstado(estado_pedido) {
        try {
            if(!estado_pedido){
                return toast.error('Debe seleccionar una categoria para realizar el filtro');
            }
            const res = await fetch(`${API}/pedidos/seleccionarPorEstados`, {
                method: "POST",
                headers: {Accept: "application/json",
                "Content-Type": "application/json",},
                body: JSON.stringify({estado_pedido}),
                mode: "cors"
            })
            if(!res.ok){
                return toast.error('Se ha Producido el siguiente error , contacte a soporte de NativeCode' );
            }else {
                const dataPedidosFiltrados = await res.json();
                setPedidos(dataPedidosFiltrados);
            }
        }catch(error) {
            console.log(error);
            return toast.error('Se ha Producido el siguiente error , contacte a soporte de NativeCode: '  + error);
        }
    }

    async function listarPedidos() {
        try {
            const resultado = await fetch(`${API}/pedidos/seleccionarPedidos`, {
                method: "GET",
                headers: {Accept: "application/json"},
                mode: "cors"
            });
            if (!resultado.ok) {
                return toast('Ha ocurrido un problema al listar los pedidos contacte a soporte de NativeCode')
            }else{
                const data = await resultado.json();
                setPedidos(data);
            }
        }catch (error) {
            console.log(error);
            return toast.error('Se ha Producido el siguiente error , contacte a soporte de NativeCode: '  + error);
        }
    }

    useEffect(() => {
        listarPedidos();
    }, [])

    return(
        <div className="">



            {/*PAGINA PEDIDO DEL DASHBOARD EN PANTALLAS DE CELULARES*/}
            <div className="mt-10 block md:hidden">
                <ToasterClient></ToasterClient>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="w-full sm:max-w-xl">
                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                Dashboard · Ecommerce Pro
                            </p>
                            <h1 className="mt-2 text-base font-semibold text-gray-900 sm:text-3xl">
                                Gestión de Pedidos
                            </h1>
                            <p className="mt-1 text-xs text-gray-600">
                                Revisa, filtra y haz seguimiento al historial de pedidos generados en tu tienda.
                            </p>

                            <div className="mt-8">
                                <p className="mb-2 text-xs font-medium  tracking-wide text-gray-500">
                                    Buscar pedido por nombre
                                </p>
                                <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm text-xs">
                                    <ShadcnInput
                                        value={comprador}
                                        onChange={e => setComprador(e.target.value)}
                                        placeholder={"Busca por similitud en nombres"}
                                        className="flex-1 border-none bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
                                    />

                                </div>
                                <br/>


                                <ShadcnButton
                                    nombre={"Buscar Pedido"}
                                    className="text-xs bg-purple-800"

                                    funcion={() => filtrarSimilitudNombre(comprador)}
                                />
                                <br/>
                                <p className="mt-1 text-xs text-gray-400">
                                    IMPORTANTE: Escribe solo el nombre del comprador, sin apellidos.
                                </p>

                            </div>
                        </div>

                        <div className="mt-2 w-full sm:mt-0 sm:w-auto">
                            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
                                <ShadcnButton className="w-30 text-xs bg-purple-800"  funcion={()=> listarPedidos()} nombre={'Total Pedidos'}></ShadcnButton>
                                <ShadcnButton className="w-30 text-xs bg-purple-800"  funcion={()=> filtrarPorEstado(1)} nombre={'Pendientes'}></ShadcnButton>
                                <ShadcnButton className="w-30 text-xs bg-purple-800"   funcion={()=> filtrarPorEstado(2)} nombre={'Confirmados'}></ShadcnButton>
                                <ShadcnButton className="w-30 text-xs bg-purple-800"  funcion={()=> filtrarPorEstado(3)} nombre={'Completados'}></ShadcnButton>
                                <ShadcnButton className="w-30 text-xs bg-purple-800"  funcion={()=> filtrarPorEstado(4)} nombre={'Anulados'}></ShadcnButton>
                                <ShadcnButton className="w-30 text-xs bg-purple-800"  funcion={()=> filtrarPorEstado("0")} nombre={'Pagos Pend.'}></ShadcnButton>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Comprador
                                    </th>


                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                {pedidos.map((pedido) => (
                                    <tr
                                        key={pedido.id_pedido}
                                        className="transition-colors hover:bg-gray-50"
                                    >

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {formatearFecha(pedido.fecha_pedido)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            <Link href={`/dashboard/pedidosDetalle?id=${pedido.id_pedido}`}>

                                                {pedido.nombre_comprador + ' ' + pedido.apellidosComprador}
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>






            {/*PAGINA PEDIDO DEL DASHBOARD EN PANTALLAS GRANDES*/}
            <div className="mt-10 hidden md:block">
                <ToasterClient></ToasterClient>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className='flex justify-end '>
                        <InfoButton informacion={"En este apartado, usted puede visualizar los precios y valores de las transacciones que se van realizando en el sistema, junto con su estado según el flujo de entrega del producto o servicio.\n" +
                            "El sistema contempla cinco estados, los cuales representan cada etapa del proceso de pago y entrega:\n" +
                            "\t•\tPAGO SIN COMPLETAR: corresponde a clientes que tuvieron la intención de pagar y llegaron hasta la pasarela de pago, pero la transacción no se concretó.\n" +
                            "\t•\tPAGO REALIZADO: indica que el pago fue realizado correctamente, pero aún está pendiente la entrega del producto o servicio.\n" +
                            "\t•\tCOMPRA ANULADA: corresponde a un proceso opcional y manual, utilizado para anular la compra y mantener trazabilidad en caso de que un cliente exija una devolución.\n" +
                            "Para ver el detalle de cada compra, usted debe seleccionar el nombre del pedido dentro del listado, lo que lo llevará a la vista detallada de ese pedido en particular."}/>
                    </div>
                    <br/>
                    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="w-full sm:max-w-xl">
                            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                Panel de Administrador · Revision de compras.
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                                Compras en linea
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Revisa, filtra y haz seguimiento al historial de pedidos generados en tu tienda.
                            </p>

                            <div className="mt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Buscar pedido por nombre
                                </p>
                                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                                    <ShadcnInput
                                        value={comprador}
                                        onChange={e => setComprador(e.target.value)}
                                        placeholder={"Busca por similitud en nombres"}
                                        className="flex-1 border-none bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <ShadcnButton
                                        nombre={"Buscar Pedido"}
                                        funcion={() => filtrarSimilitudNombre(comprador)}
                                    />
                                </div>
                                <p className="mt-1 text-[11px] text-gray-400">
                                    IMPORTANTE: Escribe solo el nombre del comprador, sin apellidos.
                                </p>
                            </div>
                        </div>

                        <div className="mt-2 w-full sm:mt-0 sm:w-auto">
                            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
                                <ShadcnButton  funcion={()=> listarPedidos()} nombre={'VER TODOS'}></ShadcnButton>
                                <ShadcnButton  funcion={()=> filtrarPorEstado(1)} nombre={'COMPRAS REALIZADAS'}></ShadcnButton>
                                <ShadcnButton  funcion={()=> filtrarPorEstado(4)} nombre={'COMPRAS ANULADAS'}></ShadcnButton>
                                <ShadcnButton  funcion={()=> filtrarPorEstado("0")} nombre={'PAGO SIN COMPLETAR'}></ShadcnButton>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        N° Pedido
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Fecha
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Comprador
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Total pagado
                                    </th>
                                    <th
                                        scope="col"
                                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Estado
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                {pedidos.map((pedido) => (
                                    <tr
                                        key={pedido.id_pedido}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                            #{pedido.id_pedido}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                            {formatearFecha(pedido.fecha_pedido)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            <Link href={`/dashboard/pedidosDetalle?id=${pedido.id_pedido}`}>

                                                {pedido.nombre_comprador + ' ' + pedido.apellidosComprador}
                                            </Link>
                                        </td>


                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900">
                                            ${" "}{pedido.totalPagado}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm ">
                                         <span className={

                                             pedido.estado_pedido === 1 ? "bg-green-200  rounded-lg p-2 font-bold w-24 text-center"
                                                         :pedido.estado_pedido === 0 ? "text-red-600 bg-red-100 rounded-lg p-2 font-bold w-24 text-center"

                                                             : "text-gray-600 bg-red-50 rounded-lg p-2 font-bold w-24 text-center"}


                                         >
                                             {pedido.estado_pedido ===  1 ? "COMPRA REALIZADA"
                                                         : pedido.estado_pedido === 0 ? "PAGO SIN COMPLETAR"
                                                             : "Anulado"}
                                         </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}