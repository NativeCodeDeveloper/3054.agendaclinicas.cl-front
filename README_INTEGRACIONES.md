# AgendaClínica 1.0.3 — Guía de Integraciones y Nuevas Funcionalidades

> **Para:** Equipo técnico (NativeCode) y desarrolladores futuros  
> **Estado:** Versión activa en producción. Incluye integraciones de v2.0 (Nicolás Rubio) + ajustes de diseño y UX. Columnas de BD marcadas con `[PENDIENTE BD]` requieren migración antes de persistir datos.  
> **Rama de respaldo pre-integración:** `backup/antes-merge-v2`

---

## 0. Integraciones v2.0 → v1.0.3 (mayo 2026)

Esta versión incorpora las funcionalidades desarrolladas por Nicolás Rubio en el repo `ACV2.0.1-FRONTEND`, integradas manualmente sobre la base de diseño de 1.0.3.

### 0.1 Funcionalidades integradas desde v2.0

**Calendario (`/dashboard/calendario`)**
- Horario extendido: 08:00 – 23:00 (antes 09:00 – 20:00)
- Tarifas por profesional: al seleccionar un profesional, el drawer carga sus servicios y precios disponibles via `GET /tarifasProfesional/seleccionarTarifasPorProfesional`
- Campos `monto_reserva` y `motivo_reserva` en la creación y edición de citas — se envían al backend y se muestran en las tarjetas
- Modal "Detalle del Bloqueo" al hacer clic sobre un bloqueo en el calendario o en la tabla lateral
- `encontrarBloqueoSolapado`: detección mejorada de bloqueos antes de permitir selección en el calendario
- `silenciarToastSolapamiento`: opción para no mostrar toast de overlap durante el drag (mejor UX)

**Panel de Citas (`/dashboard`)**
- Eliminar reserva desde el listado: botón en el menú de acciones, con confirmación — endpoint `POST /reservaPacientes/eliminarReserva`
- Exportar citas a Excel (librería `xlsx`): descarga con nombre + fecha del día
- Vista de tarjetas responsiva para mobile (< 1280px): muestra motivo y monto de la cita
- Columna "Motivo" en la tabla desktop: muestra servicio y monto
- KPI "Finalizadas" en el header de resumen

**Bloqueos de Agenda (`/dashboard/bloqueosAgenda`)**
- Modal "Ver detalle" al hacer clic en una fila: muestra profesional, motivo, fechas y botón eliminar
- Botón "Ver detalle" en la columna de acción (reemplaza el botón eliminar directo)

**Formulario de Reserva Pública (`/formularioReservaProfesional/[id_profesional]`)**
- Lee `fechaInicio`, `fechaFinalizacion`, `horaInicio`, `horaFin` desde URL params (flujo desde agenda pública)
- Valida que el servicio (motivo + monto) esté seleccionado antes de enviar
- Envía `nombreProfesional`, `monto_reserva` y `motivo_reserva` al backend

**Otros componentes**
- `FichasPacientes`: campo "Fecha de nacimiento" con `ShadcnDatePicker`
- `GestionPaciente`: `RutInput` en búsqueda de RUT (mejor formato y validación)
- `AppointmentDrawer`: selector de tarifa/servicio del profesional (`listaTarifasProfesional`)
- `RutInput`: `handleBeforeInput` + `handlePaste`, sin formato automático, uppercase, `maxLength={9}`
- `AppointmentCard`: `motivo_reserva` visible en tarjetas del calendario
- `agendaEspecificaProfersional`: `router.push` con params de fecha/hora al seleccionar un horario

### 0.2 Endpoints de backend requeridos por las nuevas funciones

| Endpoint | Método | Descripción |
|---|---|---|
| `/tarifasProfesional/seleccionarTarifasPorProfesional` | POST | Retorna tarifas/servicios del profesional |
| `/reservaPacientes/eliminarReserva` | POST | Elimina una reserva por `id_reserva` |

### 0.3 Columnas de BD requeridas (si no están aplicadas)

```sql
ALTER TABLE reservaciones ADD COLUMN monto_reserva VARCHAR(50) NULL;
ALTER TABLE reservaciones ADD COLUMN motivo_reserva VARCHAR(255) NULL;
ALTER TABLE reservaciones ADD COLUMN nombreProfesional VARCHAR(255) NULL;
```

> Todos los endpoints de SELECT de reservas deben retornar `monto_reserva` y `motivo_reserva` para que aparezcan en el dashboard y el calendario.

### 0.4 Ajustes de diseño y UX realizados sobre la integración

- **Paleta de estados unificada** en `src/lib/designTokens.js` — fuente única de verdad para calendario, dashboard y badges. Estado "Reservada" usa el violeta del proyecto (`#6E56CF`)
- **Tarjetas del calendario** rediseñadas: orden clínico (hora → estado → paciente → servicio → doctor), 3 tamaños responsivos según duración (< 15 min, 15-29 min, ≥ 30 min)
- **Modal de bloqueo** rediseñado con la paleta del proyecto (sin el gradiente oscuro de v2.0)
- **Botón "Nueva Reserva"** corregido: calcula el próximo slot válido en lugar de usar `new Date()` exacto
- **Edición de hora en el drawer**: al mover el inicio, el fin se arrastra manteniendo la duración original
- **Filtros sincronizados**: "No asiste" normaliza variantes `no asistio` / `no asistste` en dashboard y calendario
- **Sidebar**: "Vista General" removida, terminología clínica ("Panel de Citas" en lugar de "Inicio", "Calendario y Reservas" en lugar de "Nueva Reserva")
- **Tabla de bloqueos**: columnas con ancho proporcional (`table-fixed`), acción con ícono ojo, horas compactas

---

---

## Índice

1. [Resumen de lo implementado](#1-resumen-de-lo-implementado)
2. [Migraciones de Base de Datos requeridas](#2-migraciones-de-base-de-datos-requeridas)
3. [Endpoints de Backend a actualizar](#3-endpoints-de-backend-a-actualizar)
4. [Componentes nuevos](#4-componentes-nuevos)
5. [Buenas prácticas de seguridad](#5-buenas-prácticas-de-seguridad)
6. [Cómo ejecutar las migraciones](#6-cómo-ejecutar-las-migraciones)

---

## 1. Resumen de lo implementado

### 1.1 Rediseño visual premium (Apple / SaaS clínico)
- **Sidebar persistente**: menú lateral con acordeones que recuerdan su estado entre navegaciones (`sessionStorage`). El acordeón de la sección activa se abre automáticamente al entrar a cualquier ruta.
- **Paleta unificada**: fondo `#FAFAFB`, tarjetas `rounded-[28px]`, color primario `#6E56CF` (violeta) en toda la app.
- **AppointmentCard**: tarjetas de cita en calendario con tipo de consulta, modalidad y badges de estado/pago.
- **Calendarios (ambos)**: vista mes con "ver más" desplegable, vista semana/día con step=15min, scroll fijo a las 9:00.

### 1.2 Modalidad de atención por profesional `[PENDIENTE BD]`
Cada profesional puede configurar si atiende `presencial`, `online` o `ambas`.  
Visible en: **Configuración → Agenda & Servicios → Profesionales**.

### 1.3 Tipo de consulta y modalidad en reservas `[PENDIENTE BD]`
Al crear una cita desde el calendario, el operador puede:
- Seleccionar el **tipo de consulta** (dropdown con prestaciones del sistema).
- Indicar si es **Presencial** o **Online**.

Estos datos se muestran en las tarjetas del calendario y en el drawer de detalle.

### 1.4 Formateo universal de RUT chileno
- **Display**: en todos los listados, fichas, documentos y vistas, el RUT se muestra como `19.168.408-7`.
- **Input**: `RutInput` formatea automáticamente mientras el usuario escribe, valida 9 caracteres.
- El valor enviado al backend siempre es el RUT limpio sin puntos ni guión (`191684087`).

### 1.5 Teléfono con prefijo +569 integrado
- `PhoneInput`: muestra `+569` como prefijo fijo no editable.
- El usuario ingresa solo los 8 dígitos.
- El padre recibe `+56912345678` completo.
- Valida exactamente 8 dígitos.

### 1.6 Días bloqueados en agenda pública
En `/agendaEspecificaProfersional/[id_profesional]`, los días con bloqueo de jornada completa (09:00–22:00) aparecen en gris y no son seleccionables.

### 1.7 PDF de Presupuesto clínico
El PDF generado en la sección de Presupuesto de Tratamiento ahora tiene estilo de documento médico real:
- Solo colores neutros (negro, grises).
- Líneas de firma para profesional y paciente.
- Notas clínicas estándar (vigencia 30 días, IVA, contacto).
- Folio único por documento.

### 1.8 Botón "Carpeta del Paciente"
Presente en:
- `/dashboard/paciente/[id_paciente]`
- `/dashboard/NuevaFicha/[id_paciente]`
- `/dashboard/recetaPacientes/[id_paciente]`

Navega directamente a `/dashboard/FichasPacientes/[id_paciente]`.

---

## 2. Migraciones de Base de Datos requeridas

> ⚠️ **Ejecutar en orden.** Respaldar la BD antes de aplicar cambios.  
> El frontend ya envía estos campos; sin la migración simplemente se ignorarán.

### 2.1 Modalidad de atención del profesional

```sql
-- Tabla: profesionales
ALTER TABLE profesionales
  ADD COLUMN modalidad_atencion VARCHAR(20) NOT NULL DEFAULT 'ambas'
  COMMENT 'Valores: presencial | online | ambas';

-- Verificar
DESCRIBE profesionales;
```

### 2.2 Tipo de consulta y modalidad en reservas

```sql
-- Tabla: reservaciones (o la tabla que use el sistema para reservas)
ALTER TABLE reservaciones
  ADD COLUMN nombre_prestacion VARCHAR(255) NULL
  COMMENT 'Tipo de consulta seleccionado al agendar (ej: Consulta inicial, Control)',
  ADD COLUMN modalidad VARCHAR(20) NOT NULL DEFAULT 'presencial'
  COMMENT 'Modalidad de la atención: presencial | online';

-- Verificar
DESCRIBE reservaciones;
```

---

## 3. Endpoints de Backend a actualizar

Una vez aplicadas las migraciones, actualizar los siguientes endpoints:

### 3.1 Profesionales

| Endpoint | Cambio requerido |
|---|---|
| `POST /profesionales/insertarProfesional` | Aceptar y guardar `modalidad_atencion` |
| `POST /profesionales/actualizarProfesional` | Aceptar y actualizar `modalidad_atencion` |
| `GET /profesionales/seleccionarTodosProfesionales` | Retornar `modalidad_atencion` |
| `POST /profesionales/seleccionarProfesional` | Retornar `modalidad_atencion` |

**Ejemplo de body esperado (insertar/actualizar):**
```json
{
  "nombreProfesional": "Dr. Juan Pérez",
  "descripcionProfesional": "Médico general",
  "modalidad_atencion": "ambas"
}
```

### 3.2 Reservaciones / Agendamientos

> **Contexto clave:** el API ya hace JOIN con la tabla `profesionales` y retorna `nombreProfesional`
> en cada reserva. El mecanismo es exactamente el mismo para `nombre_prestacion` y `modalidad` —
> solo hay que agregar las columnas a `reservaciones` y sumarlas al SELECT.

#### Estado actual del objeto reserva (lo que devuelve el API hoy)

```json
{
  "id_reserva": 123,
  "nombrePaciente": "María",
  "apellidoPaciente": "López",
  "rut": "191684087",
  "telefono": "+56912345678",
  "email": "maria@correo.cl",
  "fechaInicio": "2026-05-20",
  "horaInicio": "09:00:00",
  "estadoReserva": "confirmada",
  "nombreProfesional": "Dra. Paula Madariaga"
}
```

> `nombreProfesional` ya llega porque el backend hace JOIN con la tabla `profesionales`.
> `nombre_prestacion` y `modalidad` NO llegan aún — falta la columna en `reservaciones`.

#### Por qué no aparece la prestación aunque la tabla `serviciosProfesionales` ya exista

La tabla de servicios (`serviciosProfesionales`) ya existe con todos los servicios creados.
El problema es que **la tabla `reservaciones` no tiene una columna que registre qué servicio
se eligió para esa reserva específica**. Sin esa columna, el backend no puede hacer el JOIN.

Es el mismo principio que con `nombreProfesional`: sin la columna `id_profesional` en
`reservaciones`, tampoco podría aparecer el nombre del profesional.

#### Endpoints a actualizar

| Endpoint | Cambio requerido |
|---|---|
| `POST /reservaPacientes/insertarReserva` | Aceptar `nombre_prestacion`, `modalidad` y guardarlos |
| `POST /reservaPacientes/insertarReservaPacienteFicha` | Ídem (usado desde la web pública) |
| `POST /reservaPacientes/actualizarReservacion` | Aceptar y actualizar ambos campos |
| `GET /reservaPacientes/seleccionarReservados` | Agregar `r.nombre_prestacion`, `r.modalidad` al SELECT |
| `POST /reservaPacientes/seleccionarPorProfesional` | Ídem |
| `POST /reservaPacientes/seleccionarEspecifica` | Ídem |

#### Ejemplo: cómo quedaría la query de SELECT (pseudocódigo)

```sql
-- ANTES (retorna solo los campos básicos + JOIN con profesionales):
SELECT r.*, p.nombreProfesional
FROM reservaciones r
JOIN profesionales p ON r.id_profesional = p.id_profesional

-- DESPUÉS (suma los nuevos campos):
SELECT r.*, p.nombreProfesional, r.nombre_prestacion, r.modalidad
FROM reservaciones r
JOIN profesionales p ON r.id_profesional = p.id_profesional
```

#### El frontend ya envía los datos (no requiere más cambios en front)

Desde el **dashboard** (AppointmentDrawer):
```javascript
nombre_prestacion: "Consulta inicial",  // seleccionado en el drawer
modalidad: "presencial"                 // toggle Online/Presencial
```

Desde la **web pública** (formularioReservaProfesional):
```javascript
nombre_prestacion: servicioSeleccionado, // el servicio que eligió el paciente
modalidad: "presencial"                  // por defecto (extensible)
```

El **AppointmentCard** ya lee automáticamente el campo cuando llega:
```javascript
const prestacion = reserva?.nombre_prestacion ?? "";  // ← ya funciona al recibir el dato
const profesional = reserva?._nombreProfesional ?? ""; // ← lookup local, ya funciona
```

#### Ejemplo de body completo al insertar reserva

```json
{
  "nombrePaciente": "María",
  "apellidoPaciente": "López",
  "rut": "191684087",
  "telefono": "+56912345678",
  "email": "maria@correo.cl",
  "fechaInicio": "2026-05-20",
  "horaInicio": "09:00:00",
  "fechaFinalizacion": "2026-05-20",
  "horaFinalizacion": "09:45:00",
  "estadoReserva": "reservada",
  "id_profesional": 3,
  "nombre_prestacion": "Consulta inicial",
  "modalidad": "presencial"
}
```

---

## 4. Componentes nuevos

### `src/Componentes/RutInput.jsx`
Input con autoformateo de RUT chileno en tiempo real.

```jsx
// Uso:
import { RutInput } from "@/Componentes/RutInput";

<RutInput
  value={rut}           // valor limpio: "191684087"
  onChange={(clean) => setRut(clean)}  // devuelve "191684087"
  label="RUT del Paciente"
/>
```

### `src/Componentes/PhoneInput.jsx`
Input de teléfono con prefijo `+569` fijo.

```jsx
import { PhoneInput } from "@/Componentes/PhoneInput";

<PhoneInput
  value={telefono}              // "+56912345678" o "12345678"
  onChange={(full) => setTelefono(full)}  // devuelve "+56912345678"
  label="Teléfono"
/>
```

### `src/app/dashboard/SidebarNav.jsx`
Navegación del sidebar como componente cliente. Persiste estado de acordeones en `sessionStorage` y resalta la ruta activa.

### `src/app/dashboard/UserMenu.jsx`
Menú de usuario en el footer del sidebar. Muestra nombre, rol y avatar del usuario Clerk. Opciones: **Volver a página web** y **Cerrar Sesión**.

---

## 5. Buenas prácticas de seguridad

### Datos de pacientes (RIESGO ALTO)
- Los RUTs y teléfonos viajan limpios al backend. **Nunca mostrar RUT sin formatear en logs**.
- En el backend, sanitizar y validar todos los campos antes de guardar en BD.
- El campo `nombre_prestacion` es texto libre — usar `sanitize` o `strip_tags` en el backend antes de guardar.

### Autenticación y roles
- El dashboard usa **Clerk** como proveedor de autenticación.
- Los metadatos de rol (`rol` o `role`) viven en `user.publicMetadata` de Clerk.
- Las rutas del dashboard están protegidas por el middleware `src/middleware.ts`.
- **No exponer rutas de API al público**: verificar que todos los endpoints de `/reservaPacientes`, `/pacientes`, `/profesionales` requieran token de sesión.

### Variables de entorno
```env
# .env.local — NUNCA subir al repositorio
NEXT_PUBLIC_API_URL=https://tu-backend.com/api
NEXT_PUBLIC_EMPRESA_NOMBRE=NombreClinica
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```
- `NEXT_PUBLIC_*` son visibles en el cliente. **No poner secrets aquí**.
- `CLERK_SECRET_KEY` va solo en el servidor.

### BD
- Crear un usuario de BD con permisos mínimos (solo las tablas necesarias).
- No usar `root` en producción.
- Habilitar SSL en la conexión a la BD.
- Respaldar la BD antes de cada migración.

---

## 6. Cómo ejecutar las migraciones

### Paso 1 — Respaldar la base de datos

```bash
# MySQL / MariaDB
mysqldump -u usuario -p nombre_bd > backup_$(date +%Y%m%d).sql
```

### Paso 2 — Conectarse a la BD

```bash
mysql -u usuario -p nombre_bd
```

### Paso 3 — Ejecutar las migraciones en orden

```sql
-- 1. Modalidad del profesional
ALTER TABLE profesionales
  ADD COLUMN modalidad_atencion VARCHAR(20) NOT NULL DEFAULT 'ambas';

-- 2. Campos en reservaciones
ALTER TABLE reservaciones
  ADD COLUMN nombre_prestacion VARCHAR(255) NULL,
  ADD COLUMN modalidad VARCHAR(20) NOT NULL DEFAULT 'presencial';

-- 3. Verificar
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('profesionales', 'reservaciones')
  AND COLUMN_NAME IN ('modalidad_atencion', 'nombre_prestacion', 'modalidad');
```

### Paso 4 — Actualizar el backend

1. En el controlador de `insertarProfesional`: recibir y guardar `modalidad_atencion`.
2. En el controlador de `insertarReserva`: recibir y guardar `nombre_prestacion` y `modalidad`.
3. En todos los SELECT de reservas: incluir `nombre_prestacion` y `modalidad` en el `SELECT`.
4. Reiniciar el servicio del backend.

### Paso 5 — Verificar en el dashboard

1. Ir a **Configuración → Profesionales** → seleccionar un profesional → verificar que muestra las opciones de modalidad.
2. Ir al **Calendario → Nueva Reserva** → crear una cita → verificar que los campos "Tipo de consulta" y "Modalidad" aparecen y se guardan.
3. Ver la tarjeta de esa cita en el calendario → verificar que muestra el tipo de consulta y la modalidad.

---

## Lista rápida de lo nuevo

| Feature | Estado frontend | Requiere BD | Detalle |
|---|---|---|---|
| Sidebar persistente (acordeones) | ✅ Completo | No | sessionStorage + usePathname |
| Tema Apple premium unificado | ✅ Completo | No | bg-[#FAFAFB], rounded-[28px], violeta #6E56CF |
| Profesional en tarjeta de cita | ✅ Completo | No | Lookup local en listaProfesionales |
| Tipo de consulta (prestación) en tarjeta | ✅ Frontend listo | **Sí** | ALTER TABLE + SELECT en backend |
| Modalidad online/presencial en tarjeta | ✅ Frontend listo | **Sí** | ALTER TABLE + SELECT en backend |
| Modalidad por profesional (config) | ✅ Frontend listo | **Sí** | ALTER TABLE profesionales |
| RutInput con autoformateo | ✅ Completo | No | Formato XX.XXX.XXX-X en tiempo real |
| PhoneInput +569 integrado | ✅ Completo | No | Prefijo fijo, 8 dígitos restantes |
| formatRut en toda la app | ✅ Completo | No | Todos los listados, fichas y vistas |
| Días bloqueados grises en agenda web | ✅ Completo | No | Fetch bloqueosPorProfesional al cargar |
| PDF presupuesto clínico | ✅ Completo | No | Sin gradientes, firmas, notas clínicas |
| Botón "Carpeta del Paciente" | ✅ Completo | No | En paciente, NuevaFicha, recetaPacientes |
| UserMenu con avatar Clerk | ✅ Completo | No | Volver al sitio + Cerrar Sesión |
| Calendarios mejorados | ✅ Completo | No | step=15min, scroll 9:00, "ver más" custom |

### ¿Por qué prestación y modalidad requieren BD si serviciosProfesionales ya existe?

La tabla `serviciosProfesionales` contiene el **catálogo** de servicios disponibles.
Lo que falta es la columna en `reservaciones` que registre **cuál servicio eligió ese
paciente en esa reserva específica**. Es el mismo principio que `nombreProfesional`:
el API ya hace JOIN con `profesionales` porque `reservaciones.id_profesional` existe.
Cuando exista `reservaciones.nombre_prestacion`, el mismo JOIN retornará el servicio
y el AppointmentCard lo mostrará automáticamente — sin más cambios en el frontend.

---

## Sesión de mejoras — AgendaClínica 1.0.3 (2026-05-15)

### Cambios aplicados en esta sesión

---

### A. RUT — Contrato limpio en todo el proyecto

**Problema resuelto:** el RUT se enviaba al backend en distintos formatos (con y sin puntos/guión) según el lugar del código, lo que podía generar pacientes duplicados al tener el mismo RUT almacenado de formas distintas.

**Regla implementada:**
- **Display (frontend):** siempre usar `formatRut(rut)` → `19.168.408-7`
- **API / BD:** siempre usar `cleanRut(rut)` o `normalizarRut(rut)` → `191684087`

**Archivos corregidos:**

| Archivo | Función corregida | Problema que tenía |
|---|---|---|
| `src/app/dashboard/page.jsx` | `crearPacienteDesdeReserva()` | Enviaba `rutFormateado` (con puntos) a `pacientesInsercion` |
| `src/app/dashboard/page.jsx` | `buscarPorRut()` | Enviaba el RUT sin limpiar al API de reservas |
| `src/app/dashboard/agendaCitas/page.jsx` | `buscarPorRut()` | Ídem |
| `src/app/dashboard/FichaClinica/page.jsx` | `buscarRutSimilar()` | Ídem |
| `src/app/dashboard/GestionPaciente/page.jsx` | `buscarRutSimilar()` | Ídem |
| `src/app/dashboard/listaPacientes/page.jsx` | `buscarRutSimilar()` | Ídem |
| `src/app/dashboard/calendario/page.jsx` | `ingresarPacienteDesdeAgenda()` | Usaba `rutLimpio` (solo `.trim()`) en inserción, en vez de `rutNormalizado` |
| `src/app/dashboard/calendario/page.jsx` | `insertarNuevaReserva()` | No normalizaba el RUT antes de enviarlo al API |
| `src/app/dashboard/calendario/page.jsx` | `actualizarInformacionReserva()` | Ídem |

**`cleanRut` ya existía en `src/lib/designTokens.js`** — solo faltaba usarlo consistentemente.

---

### B. Dropdown de servicios en agenda pública

**Ruta:** `/agendaEspecificaProfersional/[id_profesional]`

**Cambio:** la lista de servicios del profesional pasó de mostrarse siempre desplegada (todos los ítems visibles) a un **dropdown que se cierra automáticamente** al seleccionar una opción. También se cierra al hacer clic fuera.

**Archivos modificados:**
- `src/app/(public)/agendaEspecificaProfersional/[id_profesional]/page.jsx`
  - Agregado estado `dropdownServicios` y `dropdownRef`
  - `useEffect` para cerrar al hacer clic fuera
  - `seleccionarServicio()` ahora llama `setDropdownServicios(false)`
  - La tarjeta contenedora tiene `relative z-10` para evitar que el calendario renderizado debajo tape el dropdown (fix de stacking context creado por `backdrop-blur`)

---

### C. Campos comentados — pendientes de migración BD

Dos bloques de UI fueron comentados (no eliminados) porque dependen de migraciones de BD no aplicadas aún. Cada bloque tiene la instrucción SQL exacta para reactivarlo.

| Componente | Campo comentado | Archivo |
|---|---|---|
| `AppointmentDrawer` | Tipo de consulta + Modalidad (presencial/online) | `src/Componentes/AppointmentDrawer.jsx` |
| Profesionales | Modalidad de atención del profesional | `src/app/dashboard/profesionales/page.jsx` |

Para reactivar: buscar el comentario `PENDIENTE BD` en cada archivo y descomentar el bloque JSX.

---

### D. Fix de hidratación — SidebarNav

**Error:** React lanzaba advertencia de hydration mismatch porque el `useState` del sidebar leía `sessionStorage` en su inicializador, que el servidor no puede ejecutar, generando HTML distinto entre servidor y cliente.

**Fix en `src/app/dashboard/SidebarNav.jsx`:**
- El `useState` inicial ahora solo calcula el acordeón activo (seguro para SSR)
- Un `useEffect` separado restaura los acordeones guardados en `sessionStorage` **después del montaje**

---

### E. Drawer de calendario — orden de campos

**Ruta:** `/dashboard/calendario`

**Cambio:** en el formulario lateral de nueva reserva (`AppointmentDrawer`), los campos Teléfono y Correo estaban en un `grid-cols-2` (lado a lado), lo que reducía el espacio disponible para escribir. Ahora están apilados verticalmente, Teléfono primero y Correo después, cada uno con ancho completo.

**Archivo:** `src/Componentes/AppointmentDrawer.jsx`

---

### F. Rediseño visual — páginas del dashboard

Se unificó el estilo de todas las páginas del dashboard con el sistema de diseño establecido. Las reglas del sistema son:

- Fondo: `bg-[#FAFAFB]`
- Tarjetas: `rounded-[28px]`, `border border-slate-200`, `shadow-sm`
- Color primario: `#6E56CF` (violeta) — botones, labels de sección, íconos de sección
- Sin gradientes oscuros, sin `backdrop-blur` en headers de página
- Sin sombras pesadas (`shadow-[0_18px_50px_...]`)
- Tabla headers: fondo `bg-slate-50`, texto `text-slate-400`

**Páginas rediseñadas:**

| Página | Ruta | Cambios principales |
|---|---|---|
| Ficha de Paciente | `/dashboard/paciente/[id]` | Eliminado hero oscuro; avatar con iniciales en violeta claro; datos en grid de celdas blancas |
| Nueva Ficha Clínica | `/dashboard/NuevaFicha/[id]` | Fondo limpio, tarjeta de paciente sin gradiente, formulario con headers de sección consistentes, botón con `#6E56CF` |
| Receta del Paciente | `/dashboard/recetaPacientes/[id]` | Eliminado fondo radial, headers oscuros y colores cyan; resumen lateral en celdas blancas; tabla sin header degradado |
| Solicitud de Exámenes | `/dashboard/examenDocumento` | Chips de resumen en slate, headers de sección con ícono, botones gradiente → sólido |
| Receta de Lentes | `/dashboard/recetaLentes` | Sombras pesadas → `shadow-sm`, fondos con gradiente → `bg-slate-50/50` |
| Servicios de Agendamiento | `/dashboard/serviciosAgendamiento` | Sombras, bordes y botón "Seleccionar" corregidos |
| Tarifas por Profesional | `/dashboard/tarifaServicio` | Tabla header oscuro → `bg-slate-50`, fila hover indigo → slate, botón → violeta |
| Profesionales | `/dashboard/profesionales` | Fondo radial-gradient → `bg-[#FAFAFB]`, sombras y bordes corregidos, botón → violeta |
| Receta Rápida | `/dashboard/recetaRapida` | Sombras pesadas → `shadow-sm`, fondos de sección corregidos |

---

### G. Lista rápida actualizada

| Feature | Estado | Requiere BD | Detalle |
|---|---|---|---|
| RUT limpio en toda la app (BD + API) | ✅ Completo | No | `cleanRut()` en todas las funciones que envían al backend |
| Dropdown de servicios en agenda pública | ✅ Completo | No | Se cierra al seleccionar y al hacer clic fuera |
| Tipo de consulta en drawer | ⏸ Comentado | **Sí** | Descomentar en AppointmentDrawer cuando BD esté migrada |
| Modalidad en drawer | ⏸ Comentado | **Sí** | Ídem |
| Modalidad en formulario de profesional | ⏸ Comentado | **Sí** | Descomentar en profesionales/page.jsx |
| Fix hidratación SidebarNav | ✅ Completo | No | sessionStorage leído solo en useEffect post-montaje |
| Teléfono antes que correo en drawer | ✅ Completo | No | Campos apilados verticalmente con ancho completo |
| Rediseño visual dashboard | ✅ Completo | No | 9 páginas unificadas al sistema de diseño |

---

---

### H. Servicio y precio en el flujo completo de reserva pública

**Objetivo:** que el nombre del servicio y su precio aparezcan en todos los puntos del flujo: formulario, comprobante, correo y WhatsApp.

#### Estado antes de este cambio

| Punto del flujo | Servicio | Precio |
|---|---|---|
| Sección "Servicio" del formulario | ✅ Visible | ✅ Visible |
| Sección "Resumen de tu cita" del formulario | ❌ No mostraba nombre | ✅ Visible |
| Comprobante `/reserva-hora` | ✅ Visible | ❌ No llegaba |
| Correo de confirmación | ❌ No incluido | ❌ No incluido |
| WhatsApp de confirmación | ❌ No incluido | ❌ No incluido |

#### Cambios aplicados en frontend

**`src/app/(public)/formularioReservaProfesional/[id_profesional]/page.jsx`**
1. Sección "Resumen de tu cita": agregada fila con el **nombre del servicio** (se muestra si `servicioNombre` tiene valor).
2. `irAlComprobante()`: ahora pasa `precio` en los query params hacia `/reserva-hora`.
3. `agendarSinPago()`: ahora incluye `precio_prestacion: totalPago || null` en el body del API — el backend ya lo recibe, solo falta usarlo.

**`src/app/(public)/reserva-hora/page.jsx`**
1. Lee el query param `precio` desde la URL.
2. Si `precio > 0`, muestra una fila "Valor del servicio" en verde en el card de confirmación.

#### Cambios pendientes en backend (Node/PHP) — sin modificar BD

El endpoint `POST /reservaPacientes/insertarReservaPacienteFicha` ya recibe en el body:

```json
{
  "nombre_prestacion": "Depilación láser",
  "precio_prestacion": 100000
}
```

El equipo de backend debe leer estos campos y usarlos en los templates de notificación:

**Template correo:**
```
Servicio reservado: {{nombre_prestacion}}
Valor del servicio:   ${{precio_prestacion | formato_clp}}
```

**Template WhatsApp:**
```
✅ Reserva confirmada
📋 Servicio: {{nombre_prestacion}}
💰 Valor:    ${{precio_prestacion | formato_clp}}
📅 Fecha:    {{fechaInicio}} {{horaInicio}}
👨‍⚕️ Profesional: {{nombreProfesional}}
```

> Estos campos **no necesitan guardarse en BD** para aparecer en el correo/WhatsApp. Basta con leerlos del request y pasarlos al template en el mismo flujo de inserción.

> Cuando se aplique la migración de BD (`nombre_prestacion` en tabla `reservaciones`), el backend pasará a leerlo desde la BD en vez del request — sin cambiar el frontend.

---

*Actualizado por NativeCode — AgendaClínica 1.0.3 — 2026-05-15*
