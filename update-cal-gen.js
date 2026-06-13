const fs = require('fs');

let page = fs.readFileSync('src/app/dashboard/calendarioGeneral/page.jsx', 'utf8');

// 1. Import AppointmentCard
if (!page.includes('import {AppointmentCard}')) {
    page = page.replace(
        'import {SelectDinamic} from "@/Componentes/SelectDinamic";',
        'import {SelectDinamic} from "@/Componentes/SelectDinamic";\nimport {AppointmentCard} from "@/Componentes/AppointmentCard";'
    );
}

// 2. Replace the CSS block
const newCSS = `        const style = document.createElement('style');
        style.textContent = \`
            .rbc-calendar, .rbc-time-view, .rbc-month-view { border: 0 !important; background: transparent !important; }
            .rbc-time-header-content, .rbc-time-content, .rbc-time-view, .rbc-timeslot-group, .rbc-day-bg + .rbc-day-bg, .rbc-month-row + .rbc-month-row, .rbc-header + .rbc-header, .rbc-time-header-content + .rbc-time-header-content { border-color: #F1F5F9 !important; }
            .rbc-time-view .rbc-time-gutter .rbc-label { font-size: 11px !important; color: #94a3b8 !important; font-weight: 500 !important; padding-right: 8px !important; }
            .rbc-time-slot { transition: background-color 120ms ease !important; border-top: none !important; }
            .rbc-timeslot-group { border-bottom: 1px solid #F1F5F9 !important; }
            .rbc-day-slot .rbc-time-slot:hover { background: rgba(168, 85, 247, 0.04) !important; }
            .rbc-today { background: rgba(248, 250, 252, 0.5) !important; }
            .rbc-current-time-indicator { background-color: #7c3aed !important; height: 2px !important; }
            .rbc-slot-selection { background: rgba(124, 58, 237, 0.12) !important; border: 1px solid rgba(124, 58, 237, 0.3) !important; border-radius: 12px !important; }
            .rbc-selected-cell { background: rgba(124, 58, 237, 0.04) !important; }
            .rbc-event, .rbc-background-event { border-radius: 8px !important; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06) !important; overflow: hidden !important; border: none !important; background: transparent !important; }
            .rbc-background-event { background-color: rgba(107, 114, 128, 0.08) !important; border-left: 4px solid rgba(71, 85, 105, 0.4) !important; }
            .rbc-addons-dnd-resizable { border-radius: 16px !important; }
            .rbc-addons-dnd-resize-anchor { width: 100% !important; height: 6px !important; }
            .rbc-month-view .rbc-event { min-height: 0 !important; height: auto !important; padding: 2px 3px !important; line-height: 1.1 !important; white-space: normal !important; overflow: visible !important; word-break: break-word !important; font-size: 55% !important; }
            .rbc-time-view .rbc-event { min-height: 0 !important; padding: 1px 2px !important; line-height: 1.1 !important; white-space: normal !important; overflow: hidden !important; word-break: break-word !important; font-size: 48% !important; }
            .rbc-month-view .rbc-day-slot { min-height: 80px !important; }
            .rbc-row-segment { z-index: 1 !important; }
            .rbc-event-label, .rbc-event-content { white-space: normal !important; overflow: visible !important; word-break: break-word !important; font-size: 40% !important; }
            .rbc-time-view .rbc-event-label, .rbc-time-view .rbc-event-content { font-size: 48% !important; }
            .rbc-event-label { display: none !important; }
            @media (min-width: 768px) { .rbc-month-view .rbc-event-label, .rbc-month-view .rbc-event-content { font-size: 55% !important; } }
            @media (max-width: 767px) { .rbc-time-view, .rbc-time-content, .rbc-day-slot, .rbc-time-column { touch-action: pan-y !important; } .rbc-toolbar { flex-wrap: wrap !important; } .rbc-toolbar button { min-height: 38px !important; } }
        \`;
        document.head.appendChild(style);`;

page = page.replace(/const style = document\.createElement\('style'\);[\s\S]*?document\.head\.appendChild\(style\);/, newCSS);

// 3. Update Calendar components
page = page.replace(
    /components=\{\{\n\s*event: EventComponent,\n\s*day: \{event: TitleOnlyEvent\},\n\s*agenda: \{event: TitleOnlyEvent\}\n\s*\}\}/,
    `components={{ event: ({event}) => <AppointmentCard event={event} /> }}`
);

// 4. Update the popup header to match Apple style
page = page.replace(
    /className="flex cursor-move touch-none items-center justify-between rounded-t-\[24px\] border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100\/80 px-4 py-3"/,
    `className="flex cursor-move touch-none items-center justify-between rounded-t-[24px] border-b border-slate-100 bg-white px-5 py-4"`
);

// 5. Update header text styling
page = page.replace(
    /<p className="text-\[10px\] font-semibold uppercase tracking-\[0.15em\] text-slate-400">/g,
    `<p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500">`
);
page = page.replace(
    /<h3 className="text-\[14px\] font-bold leading-tight text-slate-800">/g,
    `<h3 className="text-[16px] font-bold leading-snug text-slate-800 mt-0.5">`
);

// 6. Update action buttons in the popup
page = page.replace(
    /className="rounded-full border border-slate-200 bg-white p-2 text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-600"/g,
    `className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"`
);

// 7. Update status pill in the popup
page = page.replace(
    /style=\{\{\n\s*backgroundColor: paleta\.backgroundColor,\n\s*color: paleta\.color,\n\s*border: `1px solid \$\{paleta\.borderColor\}`\n\s*\}\}/g,
    `className="rounded-full border px-2.5 py-0.5" style={{ backgroundColor: paleta.backgroundColor, color: paleta.color, border: \`1px solid \$\{paleta.borderColor\}\` }}`
);

// 8. Make the popup body use a white background
page = page.replace(
    /className="flex flex-col gap-3 p-4"/,
    `className="flex flex-col gap-4 p-5 bg-white"`
);

fs.writeFileSync('src/app/dashboard/calendarioGeneral/page.jsx', page);
console.log("Updated!");
