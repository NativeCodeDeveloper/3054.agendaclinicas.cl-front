const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/calendarioGeneral/page.jsx', 'utf8');

// 1. Remove the bulky header and actions
const oldBulkyHeaderRegex = /<div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">[\s\S]*?<div className="mb-6 rounded-\[20px\] border border-slate-200 bg-white p-4 shadow-sm">[\s\S]*?<\/div>\s*<\/div>/;
const newCompactHeader = `                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">Visualización</p>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Calendario General</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <InfoButton informacion={"Vista general de todos los horarios agendados y bloqueos de agenda registrados."}/>
                    </div>
                </div>`;

page = page.replace(oldBulkyHeaderRegex, newCompactHeader);

// 2. Adjust the calendar container to fill more space
page = page.replace(
    'className="relative px-3 pb-3 h-[calc(100vh-150px)] md:h-[calc(100vh-130px)]"',
    'className="relative px-2 pb-2 h-[calc(100vh-140px)] md:h-[calc(100vh-110px)]"'
);

fs.writeFileSync('src/app/dashboard/calendarioGeneral/page.jsx', page);
console.log("Calendario General Cleaned!");
