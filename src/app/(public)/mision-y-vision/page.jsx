"use client";

import Image from "next/image";
import Link from "next/link";

export default function MisionVisionPage() {
  return (
    <main className="bg-transparent text-[#fff4ee]">
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(249,210,216,0.19),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(230,185,121,0.16),transparent_42%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-[1.1fr_1fr] lg:items-center xl:px-12 xl:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f0d8cb]/72">
              Centro Integral ESSENZA
            </p>
            <h1 className="mt-5 text-4xl leading-tight text-[#fff1e8] sm:text-5xl">Mision y vision</h1>
            <p className="mt-7 text-justify text-sm leading-relaxed text-[#f6e0d5]/82 sm:text-base">
              Nuestra mision es brindar bienestar completo con un enfoque integrador que une medicina, psicologia y estetica en un solo lugar. Entregamos una atencion personalizada, profesional y cercana para acompanarte en cada etapa de tu proceso.
            </p>
            <p className="mt-5 max-w-2xl text-justify text-sm leading-relaxed text-[#f6e0d5]/82 sm:text-base">
              Nuestra vision es consolidarnos como referente regional en salud y bienestar integral, impulsando resultados visibles y sostenibles que equilibren cuerpo, mente y belleza.
            </p>

            <Link
              href="/contacto"
              className="mt-10 inline-flex rounded-full border border-[#f8dcc5]/45 bg-[linear-gradient(135deg,#f7dfcc_0%,#e7b27c_100%)] px-7 py-3 text-sm font-semibold text-[#2f1a12] transition hover:brightness-105"
            >
              Solicitar evaluacion
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[#f4d7c8]/18 bg-[#2a1915] shadow-[0_24px_70px_-38px_rgba(0,0,0,0.56)]">
            <Image
              src="/logoagendaclinica.png"
              alt="Mision y vision Centro Integral ESSENZA"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
