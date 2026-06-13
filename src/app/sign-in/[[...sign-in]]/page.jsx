"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Michroma } from "next/font/google";
import { motion } from "framer-motion";
import OrbBackground from "@/components/OrbBackground";

const michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });

/* SF Pro en Apple, Inter/Helvetica en otros */
const SF = `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Inter", Arial, sans-serif`;

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  { label: "Agenda inteligente",         icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Fichas clínicas digitales",  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Recordatorios automáticos",  icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
];

const trustItems = [
  { value: "99.9%",   label: "Disponibilidad" },
  { value: "256‑bit", label: "Cifrado" },
  { value: "24/7",    label: "Soporte" },
];

export default function Page() {
  const router = useRouter();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [error,      setError]      = useState("");

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) router.replace("/dashboard");
  }, [isAuthLoaded, isSignedIn, router]);

  if (!isLoaded || !isAuthLoaded || isSignedIn) {
    return (
      <main style={{ background: "#fff", fontFamily: SF }}
            className="grid min-h-screen place-items-center">
        <div className="text-sm text-slate-400">Cargando...</div>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await signIn.create({ identifier: email.trim(), password });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Se requiere un factor adicional para completar el ingreso.");
      }
    } catch (err) {
      setError(err?.errors?.[0]?.message || "No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      setError(err?.errors?.[0]?.message || "No fue posible continuar con el proveedor.");
    }
  }

  return (
    <OrbBackground orbX={0.72} orbY={0.44} bg="#ffffff">
      <div style={{ fontFamily: SF }} className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">

          {/* ── Top bar ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AgendaClinica" className="h-10 w-10 object-contain drop-shadow-sm" />
              <div>
                <p className={michroma.className + " text-[13px] tracking-wide text-slate-900"}>
                  AgendaClinica
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Healthcare OS · v1.0.3
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3.5 py-1.5 shadow-sm sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-slate-500">Sistemas operativos</span>
            </div>
          </motion.div>

          {/* ── Contenido principal ── */}
          <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-0">

            {/* ── Columna izquierda — oculta en móvil ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="hidden lg:block max-w-lg">

              <span className="inline-block rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm">
                Healthcare Information System
              </span>

              <img src="/logoac5.png" alt="AgendaClínica" className="mt-5 h-50 w-auto object-contain" />

              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-slate-500">
                Panel de administración clínica. Gestiona citas, fichas y profesionales desde un solo lugar.
              </p>

              {/* Features */}
              <ul className="mt-7 space-y-3">
                {features.map((f, i) => (
                  <motion.li key={f.label}
                    variants={fadeUp} initial="hidden" animate="visible" custom={1.4 + i * 0.15}
                    className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                      <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                      </svg>
                    </div>
                    <span className="text-[13px] font-medium text-slate-700">{f.label}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Trust stats */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="mt-8 grid grid-cols-3 gap-3">
                {trustItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 shadow-sm">
                    <p className="text-base font-bold tracking-tight text-slate-900">{item.value}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{item.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Columna derecha: formulario ── */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1.8}
              className="w-full lg:justify-self-end">

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/88 p-6 sm:p-8"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 24px 60px rgba(109,40,217,0.10), 0 4px 20px rgba(15,23,42,0.08)",
                }}>

                {/* Header */}
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-500">
                    Acceso seguro
                  </p>
                  <h2 className="mt-2 text-[17px] font-semibold tracking-tight text-slate-900">
                    Iniciar sesión
                  </h2>
                  <p className="mt-1 text-[12px] text-slate-400">
                    Accede a tu panel de administración clínica.
                  </p>
                </div>

                {/* OAuth Google */}
                <button type="button" onClick={() => handleOAuth("google")}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-slate-700 transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.99]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.5-7.6 21-18v-6.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16.1 3 9.2 7.4 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.4 5C9.1 41.7 16 45 24 45z"/>
                    <path fill="#1976D2" d="M45 24c0-1.4-.1-2.4-.4-3.5H24v8h11.3c-.5 2.6-2 4.8-4.1 6.3l6.2 5.1C40.7 37.4 45 31.4 45 24z"/>
                  </svg>
                  Continuar con Google
                </button>

                {/* Divider */}
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[11px] font-medium text-slate-400">o continúa con correo</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                      htmlFor="email">
                      Correo electrónico
                    </label>
                    <input
                      id="email" type="email" autoComplete="email" required
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 text-[13px] text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                      htmlFor="password">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="password" type={showPass ? "text" : "password"} required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 pr-11 text-[13px] text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:border-violet-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08)]"
                      />
                      <button type="button" tabIndex={-1}
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-opacity hover:opacity-80">
                        {showPass ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-rose-800/50 bg-rose-950/40 px-4 py-3">
                      <p className="text-[12px] text-rose-400">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="mt-1 h-11 w-full rounded-xl bg-slate-900 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40">
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#06141B]/30 border-t-[#06141B]" />
                        Ingresando...
                      </span>
                    ) : "Ingresar"}
                  </button>
                </form>

                {/* Footer form */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-[11px] text-slate-400">
                    Sin acceso? Contacta al administrador.
                  </p>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3 w-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span className="text-[11px] text-slate-400">SSL Secured</span>
                  </div>
                </div>
              </div>

              {/* Pie */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 lg:justify-start">
                <span>AgendaClínica v1.0.3</span>
                <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                <span>Powered by NativeCode</span>
                <span className="hidden h-3 w-px bg-slate-200 sm:block" />
                <span>HIPAA Ready</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </OrbBackground>
  );
}
