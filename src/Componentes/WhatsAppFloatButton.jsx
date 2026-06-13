import { MessageCircle } from "lucide-react";
/*
 * CONEXIÓN PENDIENTE — Botón flotante de WhatsApp (alternativo)
 * Usa publicContact.whatsappUrl y publicContact.companyName.
 * Si contactoWhatsapp está vacío, el componente ya retorna null (no aparece).
 * Una vez conectado el backend, estos valores vienen de:
 *   GET /datosEmpresa/seleccionarDatosEmpresa → d.contactoWhatsapp (construir URL: https://wa.me/NUMERO), d.empresaNombre
 */
import { publicContact } from "@/lib/publicContact";

export default function WhatsAppFloatButton() {
  if (!publicContact.whatsappUrl) return null;

  return (
    <a
      href={publicContact.whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir WhatsApp de ${publicContact.companyName}`}
      className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3a8a] text-white shadow-[0_18px_45px_-10px_rgba(30,58,138,0.55)] transition duration-300 ease-out hover:scale-105 hover:bg-[#1e40af]"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
