"use client"

import * as React from "react"
import {ChevronDownIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Label} from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function ShadcnFechaHora({onChange, minDate, onInvalidDate}) {
    const [open, setOpen] = React.useState(false)
    // Guardamos fecha como {year, month, day} para que nunca se pierda al cambiar hora
    const [selectedDate, setSelectedDate] = React.useState(null)
    const [hour, setHour] = React.useState("10")
    const [minute, setMinute] = React.useState("30")

    // Ref para evitar notificar al padre en el primer render
    const isFirstRender = React.useRef(true)

    // Construir el Date solo cuando se necesita notificar
    const buildDateTime = React.useCallback((d, hh, mm) => {
        if (!d) return null
        return new Date(d.year, d.month, d.day, Number(hh), Number(mm), 0, 0)
    }, [])

    const normalizeDate = React.useCallback((date) => {
        if (!date) return null
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }, [])

    // Notificar al padre cuando cambia fecha u hora
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (!selectedDate || !onChange) return

        const dt = buildDateTime(selectedDate, hour, minute)
        if (dt) onChange(dt)
    }, [selectedDate, hour, minute])

    const handleDateSelect = React.useCallback((d) => {
        if (!d) return
        const selected = normalizeDate(d)
        const min = normalizeDate(minDate)

        if (min && selected < min) {
            onInvalidDate?.()
            return
        }

        // Guardamos solo año/mes/día como valores planos
        setSelectedDate({year: d.getFullYear(), month: d.getMonth(), day: d.getDate()})
        setOpen(false)
    }, [minDate, normalizeDate, onInvalidDate])

    // Texto para mostrar la fecha seleccionada
    const dateLabel = selectedDate
        ? `${String(selectedDate.day).padStart(2, "0")}/${String(selectedDate.month + 1).padStart(2, "0")}/${selectedDate.year}`
        : "Seleccionar"

    // Reconstruir un Date para el Calendar selected (solo para marcar el día)
    const calendarSelected = selectedDate
        ? new Date(selectedDate.year, selectedDate.month, selectedDate.day)
        : undefined

    return (
        <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-3">
                <Label className="px-1">Fecha</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline"
                                className="w-36 justify-between font-normal bg-blue-900 text-white hover:bg-blue-800">
                            {dateLabel}
                            <ChevronDownIcon/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <div className="bg-blue-900 text-white p-3 rounded-md">
                            <Calendar
                                mode="single"
                                selected={calendarSelected}
                                onSelect={handleDateSelect}
                                disabled={minDate ? {before: normalizeDate(minDate)} : undefined}
                            />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Label className="px-1">Hora</Label>
                <div className="flex items-center gap-1">
                    <select
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        className="w-16 h-9 bg-blue-900 text-white rounded-md px-2 py-1 text-sm border-0 cursor-pointer"
                    >
                        {Array.from({length: 24}, (_, i) => (
                            <option key={i} value={String(i)}>{String(i).padStart(2, "0")}</option>
                        ))}
                    </select>
                    <span className="text-slate-700 font-bold">:</span>
                    <select
                        value={minute}
                        onChange={(e) => setMinute(e.target.value)}
                        className="w-16 h-9 bg-blue-900 text-white rounded-md px-2 py-1 text-sm border-0 cursor-pointer"
                    >
                        {Array.from({length: 12}, (_, i) => i * 5).map((m) => (
                            <option key={m} value={String(m)}>{String(m).padStart(2, "0")}</option>
                        ))}
                    </select>
                    <span className="text-xs text-slate-500 ml-1">hrs</span>
                </div>
            </div>
        </div>
    )
}
