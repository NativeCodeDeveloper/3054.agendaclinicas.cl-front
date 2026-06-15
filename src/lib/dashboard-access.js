const DASHBOARD_ROLES = [
  "default",
  "admin",
  "super-usuario-nativecode",
  "recepcionista",
  "secretaria",
  "cancelado",
  "basico",
  "centro-estetico",
  "clinico-medico",
  "odontologico",
  "oftalmologia",
  "agenda",
  "configuracion",
];

const DASHBOARD_ROLE_SET = new Set(DASHBOARD_ROLES);
const globallyDeniedDashboardMatchers = [
  /^\/dashboard\/agendaCitas$/,
];

const routeMatchersByRole = {
  "super-usuario-nativecode": [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/createUser$/,
  ],
  recepcionista: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/paciente\/[^/]+$/,
  ],
  secretaria: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/paciente\/[^/]+$/,
  ],
  cancelado: [
    /^\/dashboard\/suscripcion-cancelada$/,
  ],
  basico: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
  ],
  "centro-estetico": [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/categoriasProductos$/,
  ],
  "clinico-medico": [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/examenesClinicos$/,
  ],
  odontologico: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/examenesClinicos$/,
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/presupuestoTratamiento$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/categoriasProductos$/,
  ],
  oftalmologia: [
    /^\/dashboard$/,
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/recetaLentes$/,
  ],
  agenda: [
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/calendario$/,
    // /^\/dashboard\/calendarioGeneral$/,
    /^\/dashboard\/agendaCitas$/,
    /^\/dashboard\/bloqueosAgenda$/,
    /^\/dashboard\/AgendaDetalle\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/GestionPaciente$/,
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/paciente\/[^/]+$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/archivosPacientes\/[^/]+$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
  ],
  configuracion: [
    /^\/dashboard\/no-access$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/fichasClinicasPlantillas$/,
    /^\/dashboard\/fichasClinicasCategorias\/[^/]+$/,
    /^\/dashboard\/fichaCampo\/[^/]+$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/categoriasProductos$/,
    /^\/dashboard\/subCategorias\/[^/]+$/,
    /^\/dashboard\/subsubcategoria\/[^/]+$/,
    /^\/dashboard\/EspecificacionProductos\/[^/]+$/,
    /^\/dashboard\/examenesClinicos$/,
  ],
};

const routeDenyMatchersByRole = {
  secretaria: [
    /^\/dashboard\/FichaClinica$/,
    /^\/dashboard\/fichasClinicasCategorias\/[^/]+$/,
    /^\/dashboard\/fichasClinicasPlantillas$/,
    /^\/dashboard\/FichasPacientes\/[^/]+$/,
    /^\/dashboard\/listaPacientes$/,
    /^\/dashboard\/EdicionFicha\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/NuevaFicha\/[^/]+$/,
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/recetaPacientes\/[^/]+$/,
    /^\/dashboard\/recetaRapida$/,
    /^\/dashboard\/recetaLentes$/,
    /^\/dashboard\/examenDocumento$/,
    /^\/dashboard\/datosEmpresa$/,
    /^\/dashboard\/portadaEdit$/,
    /^\/dashboard\/publicacionesTituloDescripcion$/,
    /^\/dashboard\/publicaciones$/,
    /^\/dashboard\/edicionPagina$/,
    /^\/dashboard\/profesionales$/,
    /^\/dashboard\/serviciosAgendamiento$/,
    /^\/dashboard\/tarifaServicio$/,
    /^\/dashboard\/categoriasProductos$/,
    /^\/dashboard\/fichaCampo\/[^/]+$/,
    /^\/dashboard\/subCategorias\/[^/]+$/,
    /^\/dashboard\/subsubcategoria\/[^/]+$/,
    /^\/dashboard\/EspecificacionProductos\/[^/]+$/,
    /^\/dashboard\/examenesClinicos$/,
    /^\/dashboard\/gestionStock$/,
    /^\/dashboard\/pedidosCompras$/,
    /^\/dashboard\/pedidosDetalle$/,
    /^\/dashboard\/cupones$/,
    /^\/dashboard\/createUser$/,
    /^\/dashboard\/presupuestoTratamiento$/,
  ],
  "clinico-medico": [
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/recetaLentes$/,
    /^\/dashboard\/categoriasProductos$/,
  ],
  odontologico: [
    /^\/dashboard\/recetaLentes$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
  ],
  oftalmologia: [
    /^\/dashboard\/odontogramasPaciente\/[^/]+$/,
    /^\/dashboard\/ingresoProductos$/,
    /^\/dashboard\/categoriasProductos$/,
    /^\/dashboard\/edicionPlantillaEspecifica\/[^/]+$/,
  ],
};

const DASHBOARD_NAV_SECTIONS = [
  {
    id: "principal",
    title: "Principal",
    items: [
      { label: "Panel de Reservas", href: "/dashboard", icon: "home" },
      { label: "Crear Usuarios", href: "/dashboard/createUser", icon: "shield" },
    ],
  },
  {
    id: "agenda",
    title: "Agenda",
    accordionLabel: "Agenda",
    icon: "calendar",
    items: [
      // { label: "Calendario General", href: "/dashboard/calendarioGeneral", icon: "panels" },
      { label: "Calendario y Reserva", href: "/dashboard/calendario", icon: "calendarDays" },
      { label: "Bloqueos", href: "/dashboard/bloqueosAgenda", icon: "lock" },
    ],
  },
  {
    id: "pacientes",
    title: "Pacientes y Fichas",
    accordionLabel: "Pacientes y Fichas",
    icon: "users",
    items: [
      { label: "Ver Pacientes", href: "/dashboard/listaPacientes", icon: "users" },
      { label: "Registrar Paciente", href: "/dashboard/GestionPaciente", icon: "users" },
      { label: "Ficha Clinica", href: "/dashboard/FichaClinica", icon: "fileText" },
    ],
  },
  {
    id: "documentos",
    title: "Documentos",
    accordionLabel: "Documentos Clinicos",
    icon: "document",
    items: [
      { label: "Receta Medica", href: "/dashboard/recetaRapida", icon: "fileText" },
      { label: "Receta de Lentes", href: "/dashboard/recetaLentes", icon: "fileText" },
      { label: "Solicitar Examenes", href: "/dashboard/examenDocumento", icon: "fileText" },
    ],
  },
  {
    id: "presupuestos",
    title: "Presupuestos",
    accordionLabel: "Presupuestos",
    icon: "budget",
    items: [
      { label: "Generar Presupuesto", href: "/dashboard/presupuestoTratamiento", icon: "budget" },
      { label: "Tratamientos Disponibles", href: "/dashboard/ingresoProductos", icon: "budget" },
      { label: "Categorias", href: "/dashboard/categoriasProductos", icon: "budget" },
    ],
  },
  {
    id: "configuracion",
    title: "Configuracion Clinica",
    accordionLabel: "Configuracion Clinica",
    icon: "settings",
    items: [
      { label: "Profesionales y Agendas", href: "/dashboard/profesionales", icon: "settings" },
      { label: "Servicios Agendables", href: "/dashboard/serviciosAgendamiento", icon: "settings" },
      { label: "Tarifas de Consulta", href: "/dashboard/tarifaServicio", icon: "settings" },
      { label: "Examenes Clinicos", href: "/dashboard/examenesClinicos", icon: "folder" },
    ],
  },
  {
    id: "plantillas",
    title: "Plantillas",
    accordionLabel: "Plantillas y Examenes",
    icon: "folder",
    items: [
      { label: "Modelos de Fichas", href: "/dashboard/fichasClinicasPlantillas", icon: "folder" },
    ],
  },
  {
    id: "contenido",
    title: "Contenido web",
    accordionLabel: "Contenido web",
    icon: "image",
    items: [
      { label: "Datos de la Página Web", href: "/dashboard/datosEmpresa", icon: "settings" },
      { label: "Banners de Portada", href: "/dashboard/portadaEdit", icon: "monitor" },
      { label: "Tratamientos Destacados", href: "/dashboard/publicacionesTituloDescripcion", icon: "image" },
      { label: "Publicaciones Web", href: "/dashboard/publicaciones", icon: "layout" },
    ],
  },
  {
    id: "capacitaciones",
    title: "CAPACITACIONES",
    accordionLabel: "Capacitaciones",
    icon: "academy",
    items: [
      { label: "Academia", href: "https://academia.agendaclinicas.cl/dashboard", icon: "academy" },
    ],
  },
];

const DASHBOARD_ROLE_DETAILS = {
  admin: {
    label: "Administrador",
    description: "Acceso total al dashboard.",
  },
  "super-usuario-nativecode": {
    label: "Super Usuario NativeCode",
    description: "Puede crear usuarios en Clerk y asignar perfiles del sistema.",
  },
  recepcionista: {
    label: "Recepcionista",
    description: "Gestiona agenda, pacientes basicos y detalle de reservas.",
  },
  secretaria: {
    label: "Secretaria",
    description: "Gestiona agenda y flujo administrativo de reservas.",
  },
  cancelado: {
    label: "Cancelado",
    description: "Suscripcion cancelada, acceso suspendido hasta regularizar pagos.",
  },
  basico: {
    label: "Basico",
    description: "Acceso clinico y operativo limitado, sin recetas ni examenes.",
  },
  "centro-estetico": {
    label: "Centro Estetico",
    description: "Base operativa mas catalogo de tratamientos y categorias.",
  },
  "clinico-medico": {
    label: "Clinico Medico",
    description: "Puede trabajar fichas, recetas medicas y solicitudes de examenes.",
  },
  odontologico: {
    label: "Odontologico",
    description: "Incluye flujo clinico con odontograma y catalogo odontologico.",
  },
  oftalmologia: {
    label: "Oftalmologia",
    description: "Incluye flujo clinico mas receta de lentes.",
  },
  agenda: {
    label: "Agenda",
    description: "Enfocado en agenda, pacientes y continuidad de fichas.",
  },
  configuracion: {
    label: "Configuracion",
    description: "Mantiene catalogos, contenido y configuraciones maestras.",
  },
  default: {
    label: "Default",
    description: "Rol por defecto con acceso administrativo completo.",
  },
  unknown: {
    label: "Sin permisos",
    description: "Rol no reconocido por el sistema.",
  },
};

function normalizeDashboardRole(input) {
  const raw = String(input || "").trim().toLowerCase();

  if (!raw) {
    return "default";
  }

  if (raw === "default" || raw === "admin") {
    return "admin";
  }

  return DASHBOARD_ROLE_SET.has(raw) ? raw : "unknown";
}

function hasFullDashboardAccess(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return normalizedRole === "admin" || normalizedRole === "default";
}

function canAccessDashboardPath(role, pathname) {
  if (!pathname?.startsWith("/dashboard")) {
    return true;
  }

  if (globallyDeniedDashboardMatchers.some((matcher) => matcher.test(pathname))) {
    return false;
  }

  if (hasFullDashboardAccess(role)) {
    return true;
  }

  const normalizedRole = normalizeDashboardRole(role);
  const denyMatchers = routeDenyMatchersByRole[normalizedRole] || [];

  if (denyMatchers.some((matcher) => matcher.test(pathname))) {
    return false;
  }

  const matchers = routeMatchersByRole[normalizedRole] || [];
  return matchers.some((matcher) => matcher.test(pathname));
}

function getVisibleDashboardSections(role) {
  return DASHBOARD_NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessDashboardPath(role, item.href)),
    }))
    .filter((section) => section.items.length > 0);
}

function getDashboardRoleLabel(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return DASHBOARD_ROLE_DETAILS[normalizedRole]?.label || normalizedRole;
}

function getDashboardRoleDescription(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return DASHBOARD_ROLE_DETAILS[normalizedRole]?.description || "";
}

function getAssignableDashboardRoles() {
  return DASHBOARD_ROLES
    .filter((role) => !["default", "admin"].includes(role))
    .map((role) => ({
      value: role,
      label: getDashboardRoleLabel(role),
      description: getDashboardRoleDescription(role),
    }));
}

function getRoleFromClerkData(source) {
  return (
    source?.metadata?.role ||
    source?.publicMetadata?.role ||
    source?.public_metadata?.role ||
    source?.unsafeMetadata?.role ||
    source?.unsafe_metadata?.role ||
    source?.publicMetadata?.rol ||
    source?.public_metadata?.rol ||
    source?.unsafeMetadata?.rol ||
    source?.unsafe_metadata?.rol ||
    null
  );
}

function getDashboardRoleFromClaims(claims) {
  return normalizeDashboardRole(getRoleFromClerkData(claims));
}

function getDashboardRoleFromUser(user) {
  return normalizeDashboardRole(getRoleFromClerkData(user));
}

function canAccessOdontograma(role) {
  return hasFullDashboardAccess(role) || normalizeDashboardRole(role) === "odontologico";
}

function canAccessRecetasEnFicha(role) {
  const normalizedRole = normalizeDashboardRole(role);
  return hasFullDashboardAccess(role) || ["clinico-medico", "odontologico", "oftalmologia", "agenda"].includes(normalizedRole);
}

export {
  DASHBOARD_NAV_SECTIONS,
  DASHBOARD_ROLE_DETAILS,
  DASHBOARD_ROLES,
  canAccessDashboardPath,
  canAccessOdontograma,
  canAccessRecetasEnFicha,
  getDashboardRoleFromClaims,
  getDashboardRoleFromUser,
  getDashboardRoleDescription,
  getDashboardRoleLabel,
  getAssignableDashboardRoles,
  getVisibleDashboardSections,
  globallyDeniedDashboardMatchers,
  hasFullDashboardAccess,
  normalizeDashboardRole,
  routeDenyMatchersByRole,
  routeMatchersByRole,
};
