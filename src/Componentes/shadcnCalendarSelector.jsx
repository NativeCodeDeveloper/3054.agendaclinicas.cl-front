"use client"

import * as React from "react"
import {CalendarIcon} from "lucide-react"
import { es } from "date-fns/locale"
import { format, parseISO } from "date-fns"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Input} from "@/components/ui/input"
import {Label}from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date) {
    if (!date) return ""
    // Usar date-fns para formatear
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
}

function formatISODateOnly(date) {
    if (!date) return undefined // undefined en lugar de null para consistencia con selected prop
    return format(date, "yyyy-MM-dd"); // Formato ISO para el backend
}

function isValidDate(date) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

export function Calendar28({ nombre, onChange, value }) {
    const [open, setOpen] = React.useState(false);

    // Estado interno para el objeto Date utilizado por el componente Calendar
    // Si la prop 'value' existe, se analiza para crear un objeto Date. De lo contrario, null.
    const internalDate = React.useMemo(() => {
        if (value) {
            const parsedDate = parseISO(value); // Usar parseISO
            return isValidDate(parsedDate) ? parsedDate : undefined;
        }
        return undefined;
    }, [value]); // Se recalcula cuando cambia la prop 'value'

    // Estado interno para la cadena de visualización en el campo Input
    const displayValue = React.useMemo(() => formatDate(internalDate), [internalDate]);

    // Estado interno para el mes que se muestra en el calendario, permitiendo la navegación
    const [displayMonth, setDisplayMonth] = React.useState(internalDate || new Date());

    // Sincronizar displayMonth cuando internalDate cambia (por ejemplo, cuando se selecciona una nueva fecha)
    React.useEffect(() => {
        setDisplayMonth(internalDate || new Date());
    }, [internalDate]);

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {nombre}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    readOnly
                    value={displayValue} // Usar el displayValue derivado
                    placeholder="dd/mm/aaaa"
                    className="bg-white text-slate-900 border border-gray-200 rounded-md pr-10 py-2 shadow-sm"
                    onClick={() => setOpen(true)} // Añadir esto para abrir el Popover al hacer clic en el Input
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5"/>
                            <span className="sr-only">Seleccionar fecha</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-3 bg-white text-slate-900 rounded-lg border border-gray-200 shadow-lg"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            key={displayMonth ? displayMonth.toISOString() : 'no-date'} // Añadir esta key
                            mode="single"
                            selected={internalDate} // Usar el internalDate derivado de la prop
                            captionLayout="dropdown"
                            locale={es}
                            month={displayMonth} // Usar el estado interno para la navegación
                            onMonthChange={(nextMonth) => {
                                if (!isValidDate(nextMonth)) return;
                                setDisplayMonth(nextMonth); // Actualizar el estado del mes visible
                            }}
                            onSelect={(selectedDate) => {
                                if (!isValidDate(selectedDate)) return;

                                setOpen(false);

                                // Pasa la cadena ISO al componente padre
                                onChange?.(formatISODateOnly(selectedDate));
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
