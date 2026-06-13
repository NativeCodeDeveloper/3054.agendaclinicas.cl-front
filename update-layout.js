const fs = require('fs');

let layout = fs.readFileSync('src/app/dashboard/layout.jsx', 'utf8');

// 1. Add NavAccordion and SubNavItem components
if (!layout.includes('function NavAccordion')) {
    const helpers = `
function NavAccordion({ label, icon, defaultOpen = false, children }) {
    return (
        <details className="group mt-1" open={defaultOpen}>
            <summary className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-600 transition-all duration-150 hover:bg-[#F3F0FF] hover:text-[#6E56CF] group-open:bg-[#F3F0FF] group-open:text-[#6E56CF] select-none list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-150 group-hover:bg-[#EDE9FE] group-hover:text-[#6E56CF] group-open:bg-[#EDE9FE] group-open:text-[#6E56CF]">
                        {icon}
                    </span>
                    <span className="leading-none">{label}</span>
                </div>
                <svg className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <div className="mt-1 flex flex-col gap-0.5 pl-[3.25rem] pr-2 pb-1">
                {children}
            </div>
        </details>
    );
}

function SubNavItem({ href, label }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-medium text-slate-500 transition-all duration-150 hover:bg-[#F3F0FF] hover:text-[#6E56CF]"
        >
            <div className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors group-hover:bg-[#6E56CF]" />
            <span className="leading-tight">{label}</span>
        </Link>
    );
}
`;
    layout = layout.replace('function NavGroup({ label }) {', helpers + '\nfunction NavGroup({ label }) {');
}

// 2. Replace the old menu with the new accordion menu
const newMenu = `<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <NavItem href="/dashboard" icon={IcoHome} label="Dashboard" />

                            <NavAccordion label="Agenda Clínica" icon={IcoCalendar} defaultOpen={true}>
                                <SubNavItem href="/dashboard/calendario" label="Ingresar Agendamiento" />
                                <SubNavItem href="/dashboard/calendarioGeneral" label="Vista General" />
                                <SubNavItem href="/dashboard/bloqueosAgenda" label="Bloqueo Masivo" />
                            </NavAccordion>

                            <NavAccordion label="Registros Clínicos" icon={IcoPacientes}>
                                <SubNavItem href="/dashboard/listaPacientes" label="Listado de Pacientes" />
                                <SubNavItem href="/dashboard/GestionPaciente" label="Ingreso de Pacientes" />
                                <SubNavItem href="/dashboard/FichaClinica" label="Carpeta del paciente" />
                            </NavAccordion>

                            <NavAccordion label="Documentos" icon={IcoDocumentos}>
                                <SubNavItem href="/dashboard/presupuestoTratamiento" label="Generación Presupuesto" />
                                <SubNavItem href="/dashboard/recetaRapida" label="Receta Rápida" />
                                <SubNavItem href="/dashboard/recetaLentes" label="Receta Lentes" />
                                <SubNavItem href="/dashboard/examenDocumento" label="Solicitar Exámenes" />
                            </NavAccordion>

                            <NavAccordion label="Contenido Web" icon={IcoContenido}>
                                <SubNavItem href="/dashboard/portadaEdit" label="Carrusel de Portada" />
                                <SubNavItem href="/dashboard/publicacionesTituloDescripcion" label="Carrusel Sección 1" />
                                <SubNavItem href="/dashboard/publicaciones" label="Carrusel Sección 2" />
                            </NavAccordion>

                            <NavAccordion label="Configuraciones" icon={IcoAjustes}>
                                <SubNavItem href="/dashboard/profesionales" label="Registro de Agendas" />
                                <SubNavItem href="/dashboard/ingresoProductos" label="Tratamientos y Servicios" />
                                <SubNavItem href="/dashboard/serviciosAgendamiento" label="Prestaciones" />
                                <SubNavItem href="/dashboard/tarifaServicio" label="Cobro por Consulta" />
                                <SubNavItem href="/dashboard/fichasClinicasPlantillas" label="Fichas Clínicas" />
                                <SubNavItem href="/dashboard/categoriasProductos" label="Categorías" />
                                <SubNavItem href="/dashboard/examenesClinicos" label="Exámenes Clínicos" />
                            </NavAccordion>
                        </nav>`;

layout = layout.replace(/<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 \[scrollbar-width:none\] \[-ms-overflow-style:none\] \[&::-webkit-scrollbar\]:hidden">[\s\S]*?<\/nav>/, newMenu);

fs.writeFileSync('src/app/dashboard/layout.jsx', layout);
console.log("Layout updated with accordions!");
