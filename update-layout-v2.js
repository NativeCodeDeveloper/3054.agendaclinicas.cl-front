const fs = require('fs');

let layout = fs.readFileSync('src/app/dashboard/layout.jsx', 'utf8');

// 1. Add Michroma import
if (!layout.includes('next/font/google')) {
    layout = layout.replace(
        'import { ClerkProvider } from "@clerk/nextjs";',
        'import { ClerkProvider } from "@clerk/nextjs";\nimport { Michroma } from "next/font/google";\n\nconst michroma = Michroma({ weight: "400", subsets: ["latin"], display: "swap" });'
    );
}

// 2. Add UserAccordion helper
if (!layout.includes('function UserAccordion')) {
    const userAccordion = `
function UserAccordion({ name, role, avatar, children }) {
    return (
        <details className="group mt-auto border-t border-[#EAEAEC] p-3">
            <summary className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-all hover:bg-slate-50 select-none list-none [&::-webkit-details-marker]:hidden">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] overflow-hidden border border-[#EAEAEC]">
                    {avatar ? (
                        <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-[14px] font-bold text-[#6E56CF]">
                            {name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-bold text-slate-800 leading-tight">
                        {name}
                    </p>
                    <p className="truncate text-[11px] text-slate-400 leading-tight">
                        {role}
                    </p>
                </div>
                <svg className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </summary>
            <div className="mt-1 flex flex-col gap-0.5 px-2 pb-1">
                {children}
            </div>
        </details>
    );
}
`;
    layout = layout.replace('function NavGroup({ label }) {', userAccordion + '\nfunction NavGroup({ label }) {');
}

// 3. Update Brand section
const newBrand = `                        {/* ── Brand ── */}
                        <div className="flex items-center gap-3 border-b border-[#EAEAEC] px-4 py-6 flex-shrink-0">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6E56CF] shadow-lg flex-shrink-0">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="h-7 w-7 object-contain brightness-0 invert"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className={\`truncate text-[12px] font-bold text-[#6E56CF] tracking-tight \${michroma.className}\`}>
                                    AGENDA
                                </p>
                                <p className={\`truncate text-[12px] font-bold text-slate-800 tracking-tight \${michroma.className}\`}>
                                    CLÍNICA
                                </p>
                            </div>
                        </div>`;

layout = layout.replace(/{\/\* ── Brand ── \*\/}[\s\S]*?<\/div>\s*<\/div>/, newBrand);

// 4. Update Footer with UserAccordion
const newFooter = `                        {/* ── Footer: Profile Accordion ── */}
                        <UserAccordion 
                            name="Dra. Paula M." 
                            role="Administradora" 
                            avatar="/avatar-sample.png" 
                        >
                            <Link
                                href="/"
                                className="group flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] font-medium text-slate-500 transition-all duration-150 hover:bg-[#F3F0FF] hover:text-[#6E56CF]"
                            >
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-[#EDE9FE] group-hover:text-[#6E56CF]">
                                    {IcoSitio}
                                </div>
                                <span className="leading-none">Volver al sitio</span>
                            </Link>
                            <div className="mt-1 pt-1 border-t border-slate-100">
                                <SignOutBtn />
                            </div>
                        </UserAccordion>`;

layout = layout.replace(/{\/\* ── Footer: acceso al sitio \+ logout ── \*\/}[\s\S]*?<\/aside>/, newFooter + '\n                    </aside>');

fs.writeFileSync('src/app/dashboard/layout.jsx', layout);
console.log("Layout v2 updated!");
