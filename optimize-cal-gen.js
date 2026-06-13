const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/calendarioGeneral/page.jsx', 'utf8');

// 1. Optimize height and padding
page = page.replace(
    'className="relative p-4 md:p-6 h-[700px]"',
    'className="relative px-3 pb-3 h-[calc(100vh-150px)] md:h-[calc(100vh-130px)]"'
);

// 2. Reduce header spacing
page = page.replace(
    'className="flex flex-col gap-4 p-4 md:p-6"',
    'className="flex flex-col gap-3 px-3 py-4 md:px-5 md:py-5"'
);

// 3. Make the professional selector more compact
page = page.replace(
    'className="relative min-w-[200px]"',
    'className="relative min-w-[180px] scale-95 origin-left"'
);

// 4. Update the popup header font size to match Apple
page = page.replace(
    'className="mt-1 truncate text-base font-bold text-slate-800"',
    'className="mt-0.5 truncate text-[15px] font-bold text-slate-800 tracking-tight"'
);

fs.writeFileSync('src/app/dashboard/calendarioGeneral/page.jsx', page);
console.log("Calendario General Optimized!");
