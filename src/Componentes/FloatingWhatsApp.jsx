"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";
/*
 * CONEXIÓN PENDIENTE — Botón flotante de WhatsApp (react-floating-whatsapp)
 * Usa publicContact.whatsappNumber y publicContact.companyName.
 * Si contactoWhatsapp está vacío, el componente ya retorna null (no aparece).
 * Una vez conectado el backend, estos valores vienen de:
 *   GET /datosEmpresa/seleccionarDatosEmpresa → d.contactoWhatsapp, d.empresaNombre
 */
import { publicContact } from "@/lib/publicContact";

export default function WhatsAppButton() {
    if (!publicContact.whatsappNumber) return null;

    return (
        <FloatingWhatsApp
            phoneNumber={publicContact.whatsappNumber}
            accountName={publicContact.companyName}
            avatar="/logodifort.png" // opcional: logo o imagen en public/
            statusMessage=""
            chatMessage={`Hola, gracias por contactar a ${publicContact.companyName}. ¿En que podemos ayudarte?`}
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}
