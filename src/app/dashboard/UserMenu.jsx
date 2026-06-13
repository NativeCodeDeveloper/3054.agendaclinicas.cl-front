"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { getDashboardRoleFromUser, getDashboardRoleLabel } from "@/lib/dashboard-access";

export default function UserMenu() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();

    if (!isLoaded) {
        return (
            <div className="px-3 pb-3 pt-2 border-t border-[#EAEAEC]">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    const name = user?.fullName || user?.firstName || "Usuario";
    const role = getDashboardRoleFromUser(user);
    const roleLabel = getDashboardRoleLabel(role);
    const avatar = user?.imageUrl;

    return (
        <div className="px-3 pb-3 pt-2 border-t border-[#EAEAEC]">
            <details className="group">
                <summary className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 select-none list-none [&::-webkit-details-marker]:hidden transition-all hover:border-slate-300 hover:shadow-sm group-open:border-violet-200 group-open:shadow-sm">

                    {/* Avatar */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#EDE9FE]">
                        {avatar ? (
                            <img src={avatar} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold text-[#6E56CF]">{name.charAt(0)}</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-[13px] font-semibold text-slate-800 leading-tight">
                            {name}
                        </p>
                        <p className="truncate text-[11px] text-slate-400 leading-tight mt-0.5 capitalize">
                            {roleLabel}
                        </p>
                    </div>

                    {/* Chevron */}
                    <svg
                        className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180 flex-shrink-0"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </summary>

                {/* Dropdown */}
                <div className="mt-1 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 px-4 py-3 text-[12px] font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-[#6E56CF] border-b border-slate-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Volver a página web</span>
                    </Link>

                    <button
                        onClick={() => signOut({ redirectUrl: "/sign-in" })}
                        className="flex w-full items-center gap-2.5 px-4 py-3 text-[12px] font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </details>
        </div>
    );
}
