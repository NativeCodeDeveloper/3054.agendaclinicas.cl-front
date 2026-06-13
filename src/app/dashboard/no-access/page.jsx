"use client";

import Link from "next/link";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
import OrbBackground from "@/components/OrbBackground";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const highlights = [
  "Acceso restringido",
  "Validacion por permisos",
  "Gestion centralizada",
];

export default function NoAccessPage() {
  return (
    <OrbBackground orbX={0.72} orbY={0.44}>
      <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-[0_14px_35px_rgba(14,165,233,0.28)]">
                <span className="text-[10px] font-black leading-none text-white">AC</span>
              </div>
              <div>
                <p className={michroma.className + " text-[13px] text-slate-900"}>AgendaClinica</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Healthcare OS</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3.5 py-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              <span className="text-[11px] text-slate-500">Acceso controlado por permisos</span>
            </div>
          </motion.div>

          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="max-w-xl"
            >
              <div className="mb-4 inline-flex items-center rounded-full border border-cyan-100 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-sm">
                Healthcare Information System
              </div>

              <h1 className={michroma.className + " text-[2rem] leading-[1.08] text-slate-900 sm:text-[2.4rem] lg:text-[3rem]"}>
                <span className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-indigo-700 bg-clip-text text-transparent">
                  AgendaClinica
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-[14px] leading-6 text-slate-600">
                El modulo de agenda clinica se encuentra protegido por permisos de acceso. Si necesitas utilizar esta seccion, solicita habilitacion al administrador del sistema.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={1.4 + index * 0.2}
                    className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm"
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="w-full lg:justify-self-end"
            >
              <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-6">
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-700">Sin acceso</p>
                  <h2 className={michroma.className + " mt-2.5 text-[18px] text-slate-900"}>Modulo restringido</h2>
                  <p className="mt-2 text-[13px] leading-6 text-slate-500">
                    Sin acceso a este modulo de agenda clinica, contacte al administrador.
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(254,243,199,0.92))] px-4 py-4 shadow-[0_18px_40px_rgba(217,119,6,0.12)]">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-300/40 blur-2xl" />
                  <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
                  <div className="relative flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_12px_24px_rgba(217,119,6,0.24)]">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">Estado de acceso</p>
                      <p className={michroma.className + " mt-1 text-[15px] text-amber-950"}>Permisos insuficientes</p>
                      <p className="mt-2 text-[12px] leading-5 text-amber-800/90">
                        Tu usuario no tiene habilitado el acceso a esta seccion. Si esto es un error, solicita revision al administrador.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-700 text-[12px] font-semibold text-white shadow-[0_18px_40px_rgba(14,165,233,0.28)] transition-all hover:from-cyan-500 hover:to-indigo-600"
                  >
                    Volver al dashboard
                  </Link>
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-center text-[11px] text-slate-400">
                    Si necesitas este modulo para tu rol, pide habilitacion de permisos.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2.6}
            className="mt-6 flex items-center justify-between text-[10px] text-slate-400"
          >
            <span>AgendaClinica v2.0</span>
            <span>Powered by NativeCode</span>
          </motion.div>
        </div>
      </div>
    </OrbBackground>
  );
}
