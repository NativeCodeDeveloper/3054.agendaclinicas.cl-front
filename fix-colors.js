const fs = require('fs');

// Fix page.jsx buttons
let page = fs.readFileSync('src/app/dashboard/calendario/page.jsx', 'utf8');
page = page.replace(
  /className="inline-flex items-center gap-2 rounded-xl bg-\[#6E56CF\] px-4 py-2\.5 text-\[13px\] font-semibold text-white shadow-sm transition-all hover:bg-\[#5a46b0\] hover:shadow-md"/g,
  `className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: "#6E56CF" }}`
);
page = page.replace(
  /className=\{`px-4 py-2 text-\[13px\] font-semibold transition-colors border-r border-slate-200 last:border-r-0 \$\{\n\s*vistaActiva === key\n\s*\? "bg-\[#6E56CF\] text-white"\n\s*: "text-slate-600 hover:bg-slate-50"\n\s*\}\`\}/g,
  `className={\`px-4 py-2 text-[13px] font-semibold transition-colors border-r border-slate-200 last:border-r-0 \${vistaActiva === key ? "text-white" : "text-slate-600 hover:bg-slate-50"}\`} style={vistaActiva === key ? { backgroundColor: "#6E56CF" } : {}}`
);
fs.writeFileSync('src/app/dashboard/calendario/page.jsx', page);

// Fix StatusFilterChips.jsx
let chips = fs.readFileSync('src/Componentes/StatusFilterChips.jsx', 'utf8');
chips = chips.replace(
  /\? isTodas\n\s*\? "border-violet-300 bg-violet-600 text-white shadow-sm"/g,
  `? isTodas\n                  ? "border-violet-300 text-white shadow-sm"`
);
chips = chips.replace(
  /className=\{`([^`]+)`\}/,
  `className={\`$1\`} style={{ ...(isActive && isTodas ? { backgroundColor: '#6E56CF', color: '#ffffff' } : {}) }}`
);
fs.writeFileSync('src/Componentes/StatusFilterChips.jsx', chips);

// Fix AppointmentDrawer.jsx time inputs
let drawer = fs.readFileSync('src/Componentes/AppointmentDrawer.jsx', 'utf8');
drawer = drawer.replace(
  /className=\{inputClass\}/g,
  `className={inputClass} style={{ colorScheme: "light" }}`
);
fs.writeFileSync('src/Componentes/AppointmentDrawer.jsx', drawer);

console.log("Fixed colors!");
