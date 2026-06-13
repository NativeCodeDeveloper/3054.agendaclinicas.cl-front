const fs = require('fs');
let page = fs.readFileSync('src/app/dashboard/calendarioGeneral/page.jsx', 'utf8');

const startTag = '                                <div className="flex items-center justify-between gap-4 mb-4">';
const endTag = '                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">';

const startIndex = page.indexOf(startTag);
const endIndex = page.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = `                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">Visualización</p>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Calendario General</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <InfoButton informacion={"Vista general de todos los horarios agendados y bloqueos de agenda registrados."}/>
                    </div>
                </div>

`;
    const result = page.slice(0, startIndex) + newContent + page.slice(endIndex);
    fs.writeFileSync('src/app/dashboard/calendarioGeneral/page.jsx', result);
    console.log("Syntax fixed!");
} else {
    console.log("Could not find tags", { startIndex, endIndex });
}
