/*
 * FUENTE CENTRAL DE DATOS DE CONTACTO Y REDES SOCIALES
 *
 * Actualmente estos valores se leen del archivo .env (variables NEXT_PUBLIC_*).
 * Una vez que el backend esté listo, reemplazar cada constante por el valor
 * obtenido desde el endpoint: GET /datosEmpresa/seleccionarDatosEmpresa
 *
 * Este objeto (publicContact) es consumido por:
 *   - src/Componentes/Footer.jsx                    (contacto + redes en el footer)
 *   - src/Componentes/FlotanteInstagram.jsx         (botón flotante Instagram)
 *   - src/Componentes/FloatingWhatsApp.jsx          (botón flotante WhatsApp)
 *   - src/Componentes/WhatsAppFloatButton.jsx       (botón flotante WhatsApp alternativo)
 *   - src/app/(public)/contacto/page.jsx            (página de contacto completa)
 *   - src/app/(public)/reserva-hora/page.jsx        (nombre y dirección en reserva)
 *
 * IMPORTANTE: este archivo es importado por componentes de servidor (Server Components),
 * por eso no puede hacer fetch() directamente. Para conectar al backend hay que:
 *   a) Convertir los componentes que lo importan a 'use client' y hacer fetch en useEffect, O
 *   b) Crear un Server Action / Route Handler en Next.js que lea /datosEmpresa y exponga los datos.
 */
const EMPRESA_NOMBRE = process.env.NEXT_PUBLIC_EMPRESA_NOMBRE || "Agenda Clinica";
const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";
const CONTACT_WHATSAPP = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || CONTACT_PHONE;
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const CONTACT_ADDRESS = process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "";
const CONTACT_MAPS_URL = process.env.NEXT_PUBLIC_CONTACT_MAPS_URL || "";

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || "";
const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_HANDLE || "";
const FACEBOOK_URL = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL || "";
const TWITTER_URL = process.env.NEXT_PUBLIC_SOCIAL_TWITTER_URL || "";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL || "";
const TIKTOK_URL = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL || "";
const YOUTUBE_URL = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL || "";
const OTHER_SOCIAL_URL = process.env.NEXT_PUBLIC_SOCIAL_OTHER_URL || "";
const OTHER_SOCIAL_LABEL = process.env.NEXT_PUBLIC_SOCIAL_OTHER_LABEL || "Otra red";

function normalizeWhatsAppNumber(phone) {
  return phone.replace(/[^\d]/g, "");
}

export const publicContact = {
  companyName: EMPRESA_NOMBRE,
  phone: CONTACT_PHONE,
  whatsappNumber: CONTACT_WHATSAPP,
  whatsappUrl: CONTACT_WHATSAPP ? `https://wa.me/${normalizeWhatsAppNumber(CONTACT_WHATSAPP)}` : "",
  email: CONTACT_EMAIL,
  emailUrl: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : "",
  address: CONTACT_ADDRESS,
  mapsUrl: CONTACT_MAPS_URL,
  instagramHandle: INSTAGRAM_HANDLE,
  socials: {
    instagram: INSTAGRAM_URL,
    facebook: FACEBOOK_URL,
    twitter: TWITTER_URL,
    linkedin: LINKEDIN_URL,
    tiktok: TIKTOK_URL,
    youtube: YOUTUBE_URL,
    other: OTHER_SOCIAL_URL,
    otherLabel: OTHER_SOCIAL_LABEL,
  },
};
