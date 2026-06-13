"use client";

/**
 * PhoneInput.jsx
 * Input especializado para teléfono móvil chileno.
 * - Prefijo "+569" fijo, no editable (siempre presente)
 * - El usuario ingresa solo los 8 dígitos restantes
 * - El onChange devuelve el número COMPLETO: "+569XXXXXXXX"
 * - Valida que los 8 dígitos estén completos
 * - Si el valor que llega del padre ya incluye "+569", lo extrae y muestra solo los 8 dígitos
 *
 * Uso:
 *   <PhoneInput
 *     value={telefono}                           // "+56912345678" o "12345678"
 *     onChange={(full) => setTelefono(full)}     // devuelve "+56912345678"
 *   />
 */

import { useEffect, useState } from "react";

const PREFIX = "+569";
const DIGITS = 8; // dígitos después del prefijo

function extractDigits(val = "") {
    const raw = String(val).replace(/\D/g, ""); // solo dígitos
    // Si empieza con 569, quita ese prefijo
    if (raw.startsWith("569") && raw.length >= 3) return raw.slice(3, 3 + DIGITS);
    // Si empieza con 56, quita
    if (raw.startsWith("56") && raw.length >= 2) return raw.slice(2, 2 + DIGITS);
    // Si empieza con 9, quita
    if (raw.startsWith("9") && raw.length >= 1) return raw.slice(1, 1 + DIGITS);
    return raw.slice(0, DIGITS);
}

export function PhoneInput({
    value = "",
    onChange,
    className = "",
    label = "",
    disabled = false,
}) {
    const [digits, setDigits]   = useState(extractDigits(value));
    const [touched, setTouched] = useState(false);
    const [error,   setError]   = useState("");

    // Sincroniza cuando el padre actualiza el valor (carga de BD / reset)
    useEffect(() => {
        setDigits(extractDigits(value));
    }, [value]);

    function validate(d) {
        if (!d) return "";
        const clean = d.replace(/\D/g, "");
        if (clean.length < DIGITS) return `Faltan ${DIGITS - clean.length} dígito(s)`;
        return "";
    }

    function handleChange(e) {
        const raw = e.target.value.replace(/\D/g, "").slice(0, DIGITS);
        setDigits(raw);
        onChange?.(raw.length > 0 ? `${PREFIX}${raw}` : "");
        if (touched) setError(validate(raw));
    }

    function handleBlur() {
        setTouched(true);
        setError(validate(digits));
    }

    const hasError = touched && !!error;
    const isOk     = touched && !error && digits.replace(/\D/g, "").length === DIGITS;

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {label}
                </label>
            )}
            <div className="flex overflow-hidden rounded-xl border border-slate-200 transition-all focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100 has-[input:focus]">
                {/* Prefijo fijo */}
                <div className="flex items-center border-r border-slate-200 bg-slate-100 px-3 text-[13px] font-semibold text-slate-500 select-none flex-shrink-0">
                    {PREFIX}
                </div>
                {/* Campo de 8 dígitos */}
                <input
                    type="tel"
                    value={digits}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="12345678"
                    maxLength={DIGITS}
                    disabled={disabled}
                    inputMode="numeric"
                    autoComplete="tel"
                    className={`h-10 flex-1 min-w-0 bg-white px-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 ${
                        hasError ? "bg-red-50" : isOk ? "bg-emerald-50/30" : ""
                    } ${className}`}
                />
                {/* Indicador validez */}
                {isOk && (
                    <div className="flex items-center pr-3 bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                )}
            </div>
            {/* Error */}
            {hasError && (
                <p className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                    {error}
                </p>
            )}
            {/* Hint */}
            {!touched && (
                <p className="text-[11px] text-slate-400">
                    Ingresa los 8 dígitos de tu número móvil
                </p>
            )}
        </div>
    );
}
