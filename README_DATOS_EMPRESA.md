# Módulo: Datos de la Empresa / Página Web

> **Para:** Desarrollador backend  
> **Estado:** Frontend 100% listo. Pendiente: crear tabla, endpoints y conectar los archivos marcados en el frontend.  
> **Ruta del formulario en el dashboard:** `/dashboard/datosEmpresa`

---

## ¿Qué hace este módulo?

Permite que cada cliente del sistema ingrese, edite y guarde los datos de su negocio directamente desde el dashboard: nombre de la empresa, teléfono, WhatsApp, email, dirección, redes sociales y textos de "Sobre nosotros".

Estos datos reemplazan las variables `NEXT_PUBLIC_*` del archivo `.env` que actualmente están hardcodeadas por cliente. Una vez integrado el backend, cada cliente gestiona sus propios datos sin tocar archivos de configuración.

---

## 1. Tabla SQL a crear: `datos_empresa`

Esta tabla tiene **siempre un solo registro por instalación** (`id_datosEmpresa = 1`). No hay inserción múltiple.

```sql
CREATE TABLE datos_empresa (
  id_datosEmpresa         INT AUTO_INCREMENT PRIMARY KEY,

  -- Datos generales
  empresaNombre           VARCHAR(200)  DEFAULT '',

  -- Contacto
  contactoTelefono        VARCHAR(30)   DEFAULT '',
  contactoWhatsapp        VARCHAR(30)   DEFAULT '',
  contactoEmail           VARCHAR(150)  DEFAULT '',
  contactoDireccion       VARCHAR(300)  DEFAULT '',
  contactoUrlMapa         TEXT,

  -- Sobre nosotros (sección "Acerca de" del inicio)
  sobreNosotrosTitulo     VARCHAR(200)  DEFAULT '',
  sobreNosotrosParrafo1   TEXT,
  sobreNosotrosParrafo2   TEXT,

  -- Redes sociales
  -- IMPORTANTE: si el campo está vacío (''), el frontend NO muestra el ícono/enlace
  socialInstagramUrl      TEXT,
  socialInstagramHandle   VARCHAR(100)  DEFAULT '',
  socialFacebookUrl       TEXT,
  socialTwitterUrl        TEXT,
  socialLinkedinUrl       TEXT,
  socialTiktokUrl         TEXT,
  socialYoutubeUrl        TEXT,
  socialOtraUrl           TEXT,
  socialOtraEtiqueta      VARCHAR(100)  DEFAULT '',

  -- Control de fechas
  fechaCreacion           DATETIME     DEFAULT NOW(),
  fechaActualizacion      DATETIME     ON UPDATE NOW()
);

-- Insertar el registro único al crear la base de datos
INSERT INTO datos_empresa (id_datosEmpresa) VALUES (1);
```

---

## 2. Endpoints requeridos

El frontend usa el mismo patrón que el resto del proyecto: `GET` para leer, `POST` para escribir.

### 2.1 Leer datos de la empresa

```
GET /datosEmpresa/seleccionarDatosEmpresa
```

**Respuesta esperada (JSON):**
```json
{
  "id_datosEmpresa": 1,
  "empresaNombre": "Glow Sister LC",
  "contactoTelefono": "+56948466615",
  "contactoWhatsapp": "+56948466615",
  "contactoEmail": "lopezcifuentesp@gmail.com",
  "contactoDireccion": "",
  "contactoUrlMapa": "",
  "sobreNosotrosTitulo": "Glow Sister LC",
  "sobreNosotrosParrafo1": "Enfermera Universitaria...",
  "sobreNosotrosParrafo2": "Procedimientos estéticos...",
  "socialInstagramUrl": "",
  "socialInstagramHandle": "",
  "socialFacebookUrl": "",
  "socialTwitterUrl": "",
  "socialLinkedinUrl": "",
  "socialTiktokUrl": "",
  "socialYoutubeUrl": "",
  "socialOtraUrl": "",
  "socialOtraEtiqueta": "",
  "fechaCreacion": "2026-06-01T00:00:00.000Z",
  "fechaActualizacion": null
}
```

> Puede devolver el objeto directamente **o** dentro de un array `[{...}]`. El frontend maneja ambos casos: `const d = Array.isArray(data) ? data[0] : data`.

---

### 2.2 Guardar / actualizar datos de la empresa

```
POST /datosEmpresa/actualizarDatosEmpresa
Content-Type: application/json
```

**Body recibido (todos los campos):**
```json
{
  "empresaNombre": "Glow Sister LC",
  "contactoTelefono": "+56948466615",
  "contactoWhatsapp": "+56948466615",
  "contactoEmail": "lopezcifuentesp@gmail.com",
  "contactoDireccion": "",
  "contactoUrlMapa": "",
  "sobreNosotrosTitulo": "Glow Sister LC",
  "sobreNosotrosParrafo1": "Enfermera Universitaria...",
  "sobreNosotrosParrafo2": "Procedimientos estéticos...",
  "socialInstagramUrl": "",
  "socialInstagramHandle": "",
  "socialFacebookUrl": "",
  "socialTwitterUrl": "",
  "socialLinkedinUrl": "",
  "socialTiktokUrl": "",
  "socialYoutubeUrl": "",
  "socialOtraUrl": "",
  "socialOtraEtiqueta": ""
}
```

**Lógica SQL en el backend:**
```sql
UPDATE datos_empresa
SET
  empresaNombre         = :empresaNombre,
  contactoTelefono      = :contactoTelefono,
  contactoWhatsapp      = :contactoWhatsapp,
  contactoEmail         = :contactoEmail,
  contactoDireccion     = :contactoDireccion,
  contactoUrlMapa       = :contactoUrlMapa,
  sobreNosotrosTitulo   = :sobreNosotrosTitulo,
  sobreNosotrosParrafo1 = :sobreNosotrosParrafo1,
  sobreNosotrosParrafo2 = :sobreNosotrosParrafo2,
  socialInstagramUrl    = :socialInstagramUrl,
  socialInstagramHandle = :socialInstagramHandle,
  socialFacebookUrl     = :socialFacebookUrl,
  socialTwitterUrl      = :socialTwitterUrl,
  socialLinkedinUrl     = :socialLinkedinUrl,
  socialTiktokUrl       = :socialTiktokUrl,
  socialYoutubeUrl      = :socialYoutubeUrl,
  socialOtraUrl         = :socialOtraUrl,
  socialOtraEtiqueta    = :socialOtraEtiqueta
WHERE id_datosEmpresa = 1;
```

**Respuesta esperada (éxito):**
```json
{ "message": true }
```

**Respuesta en error:**
```json
{ "message": false }
```

---

## 3. Conexiones pendientes en el frontend

Una vez que los endpoints estén funcionando, hay **9 archivos** del frontend que deben conectarse. Todos tienen un comentario `/* CONEXIÓN PENDIENTE */` marcando exactamente qué cambiar.

### 3.1 Fuente central — `src/lib/publicContact.js`

Este archivo es el **punto de entrada principal**. Actualmente lee todo del `.env`. Es importado por casi todos los demás archivos de la lista.

**Qué hacer:** Convertirlo en una función async que haga `fetch` al endpoint, o migrar los componentes que lo usan a `'use client'` con un `useEffect` que cargue los datos.

> ⚠️ **Importante:** Este archivo es usado por Server Components (sin `'use client'`). Para conectar el backend sin romper el SSR, la opción más limpia es crear un Route Handler en Next.js (`/api/datos-empresa`) que llame al backend y exponga los datos, y que los Server Components llamen a ese endpoint interno.

---

### 3.2 Mapa completo de conexiones

| Archivo | Datos que necesita | Campo en `datos_empresa` |
|---|---|---|
| `src/lib/publicContact.js` | **Todo** (es la fuente central) | Todos los campos |
| `src/app/(public)/portada/page.jsx` | Redes sociales del Hero (hardcodeadas con `href:"#"`) | `socialInstagramUrl`, `socialFacebookUrl`, `contactoWhatsapp` |
| `src/Componentes/Footer.jsx` | Teléfono, email, dirección, redes | `contactoTelefono`, `contactoEmail`, `contactoDireccion`, `contactoUrlMapa`, `social*` |
| `src/Componentes/FlotanteInstagram.jsx` | Instagram flotante | `socialInstagramUrl`, `socialInstagramHandle` |
| `src/Componentes/FloatingWhatsApp.jsx` | WhatsApp flotante | `contactoWhatsapp`, `empresaNombre` |
| `src/Componentes/WhatsAppFloatButton.jsx` | WhatsApp flotante alternativo | `contactoWhatsapp`, `empresaNombre` |
| `src/app/(public)/contacto/page.jsx` | Página completa de contacto | Todos los campos de contacto y social |
| `src/app/(public)/seccion1/page.jsx` | Sección "Sobre nosotros" del inicio | `sobreNosotrosTitulo`, `sobreNosotrosParrafo1`, `sobreNosotrosParrafo2` |
| `src/app/(public)/reserva-hora/page.jsx` | Nombre empresa y dirección | `empresaNombre`, `contactoDireccion` |

---

### 3.3 Detalle: qué reemplazar en cada archivo

#### `src/app/(public)/portada/page.jsx`
Buscar el array `socialLinks` (tiene comentario `CONEXIÓN PENDIENTE`):
```js
// ANTES (hardcodeado)
const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook,  href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

// DESPUÉS (conectado)
// Hacer fetch de GET /datosEmpresa/seleccionarDatosEmpresa en useEffect
// y construir el array filtrando los que tengan URL:
const socialLinks = [
  datos.socialInstagramUrl && { icon: Instagram, href: datos.socialInstagramUrl, label: "Instagram" },
  datos.socialFacebookUrl  && { icon: Facebook,  href: datos.socialFacebookUrl,  label: "Facebook" },
  datos.contactoWhatsapp   && { icon: MessageCircle, href: `https://wa.me/${datos.contactoWhatsapp.replace(/\D/g,'')}`, label: "WhatsApp" },
].filter(Boolean);
```

#### `src/app/(public)/seccion1/page.jsx`
Buscar el comentario `CONEXIÓN PENDIENTE`. Actualmente lee de `.env` y del endpoint legacy `/titulo` + `/textos`. Reemplazar ambas fuentes por el nuevo endpoint:
```js
// Reemplazar:
const fallbackSobreNosotrosTitulo = process.env.NEXT_PUBLIC_ABOUT_TITLE || "..."
// Y los fetch a /titulo y /textos

// Por:
// GET /datosEmpresa/seleccionarDatosEmpresa
// → d.sobreNosotrosTitulo
// → d.sobreNosotrosParrafo1
// → d.sobreNosotrosParrafo2
```

#### `src/Componentes/FloatingWhatsApp.jsx` y `WhatsAppFloatButton.jsx`
Buscar el comentario `CONEXIÓN PENDIENTE`. Actualmente usa `publicContact.whatsappNumber` y `publicContact.companyName`. Reemplazar con datos del endpoint:
```js
// contactoWhatsapp  → número del WhatsApp (sin formatear)
// empresaNombre     → nombre que aparece en el chat de WhatsApp
```

---

## 4. Regla de redes sociales vacías

Esta regla **ya está implementada en el frontend** y no requiere cambios.

Si un campo de red social está vacío (`""` o `null`), el componente correspondiente no muestra el ícono ni el enlace. El backend solo necesita devolver `""` o `null` cuando no hay valor — el frontend lo filtra solo.

Ejemplo en `Footer.jsx`:
```js
// Ya implementado — filtra automáticamente los que no tienen href
const socialLinks = [...].filter((item) => item.href);
```

---

## 5. Flujo completo resumido

```
Cliente ingresa datos en /dashboard/datosEmpresa
        ↓
POST /datosEmpresa/actualizarDatosEmpresa
        ↓
UPDATE datos_empresa WHERE id = 1
        ↓
Los visitantes de la web pública ven los datos actualizados
vía GET /datosEmpresa/seleccionarDatosEmpresa
        ↓
Componentes que muestran los datos:
  - Hero/Portada (redes sociales)
  - Footer (contacto + redes)
  - Página de Contacto
  - Sección "Sobre Nosotros"
  - Botón flotante WhatsApp
  - Botón flotante Instagram
  - Página de Reserva de Hora
```