import { publicContact } from "@/lib/publicContact";

const legalCompanyName = publicContact.companyName || "la empresa";
const legalAddress = publicContact.address || "la direccion publicada en este sitio";
const legalEmail = publicContact.email || "el correo oficial publicado en este sitio";
const legalPhone = publicContact.phone || "el telefono oficial publicado en este sitio";
const legalInstagram = publicContact.instagramHandle || "la cuenta oficial de Instagram publicada en este sitio";

const sections = [
  {
    title: "1. Identificacion del prestador",
    body: [
      `${legalCompanyName} presta servicios de salud y bienestar en la direccion ${legalAddress}.`,
      `Canales oficiales de contacto: ${legalEmail}, WhatsApp ${legalPhone} e Instagram ${legalInstagram}.`,
    ],
  },
  {
    title: "2. Alcance de los servicios",
    body: [
      "Nuestros servicios incluyen medicina general, medicina familiar, psicologia, nutricion, fonoaudiologia, cosmetologia, masoterapia y terapias complementarias.",
      "Cada atencion se adapta a la condicion de salud, antecedentes y objetivos de cada paciente.",
    ],
  },
  {
    title: "3. Reserva, cambios y asistencia",
    body: [
      "Las reservas pueden gestionarse por los canales oficiales publicados en este sitio.",
      "Para reagendar o cancelar una hora solicitamos aviso con al menos 24 horas de anticipacion.",
      "La inasistencia sin aviso puede afectar la disponibilidad de nuevas reservas.",
    ],
  },
  {
    title: "4. Evaluacion previa y plan personalizado",
    body: [
      "Antes de iniciar procedimientos, el equipo realiza una evaluacion para determinar pertinencia clinica y recomendaciones.",
      "Los resultados pueden variar segun condiciones individuales, adherencia y controles indicados.",
    ],
  },
  {
    title: "5. Consentimiento informado",
    body: [
      "Todo procedimiento que lo requiera se realiza con consentimiento informado y explicacion de beneficios, cuidados y posibles riesgos.",
      "El paciente debe informar antecedentes medicos, medicamentos y condiciones relevantes para su seguridad.",
    ],
  },
  {
    title: "6. Pagos y comprobantes",
    body: [
      "Los valores, medios de pago disponibles y condiciones comerciales vigentes se informan al momento de la reserva o atencion.",
      "Los comprobantes correspondientes se emiten segun la normativa tributaria chilena aplicable.",
    ],
  },
  {
    title: "7. Privacidad y datos personales",
    body: [
      "Los datos entregados por pacientes y usuarios se utilizan exclusivamente para gestion de atenciones, contacto, seguimiento y cumplimiento legal.",
      `${legalCompanyName} adopta medidas razonables de resguardo y confidencialidad conforme a la normativa chilena vigente.`,
      `Puedes solicitar actualizacion o eliminacion de datos en ${legalEmail}.`,
    ],
  },
  {
    title: "8. Propiedad intelectual",
    body: [
      `Los contenidos del sitio, incluyendo textos, imagenes, identidad visual y materiales informativos, son de uso exclusivo de ${legalCompanyName} o sus titulares.`,
      "No esta permitido copiar, reproducir o distribuir contenido sin autorizacion previa y por escrito.",
    ],
  },
  {
    title: "9. Modificaciones y vigencia",
    body: [
      `${legalCompanyName} puede actualizar estos terminos para reflejar cambios operativos, legales o de servicio.`,
      "La version publicada en esta pagina es la vigente y reemplaza versiones anteriores.",
    ],
  },
  {
    title: "10. Legislacion aplicable",
    body: [
      "Estos terminos se interpretan conforme a las leyes de la Republica de Chile.",
      "Cualquier controversia sera conocida por los tribunales competentes en Chile.",
    ],
  },
];

export default function TerminosYCondiciones() {
  return (
    <main className="bg-transparent text-[#fff4ee]">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(248,211,216,0.2),transparent_34%),radial-gradient(circle_at_90%_2%,rgba(230,185,121,0.16),transparent_40%)]" />

        <div className="relative mx-auto w-full max-w-5xl px-6 md:px-10 xl:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f1d8cb]/74">
            {legalCompanyName}
          </p>
          <h1 className="mt-4 text-4xl leading-tight text-[#fff1e8] sm:text-5xl">
            Terminos y Condiciones
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[#f6dfd4]/82 sm:text-base">
            Documento informativo sobre el uso del sitio, reservas y condiciones generales de atencion.
            Ultima actualizacion: marzo de 2026.
          </p>

          <div className="mt-10 space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-[#f2d4c7]/14 bg-[linear-gradient(160deg,rgba(64,38,33,0.58)_0%,rgba(24,14,12,0.9)_100%)] p-6 sm:p-7"
              >
                <h2 className="text-lg font-medium text-[#fff0e6] sm:text-xl">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-[#f6dfd4]/80 sm:text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
