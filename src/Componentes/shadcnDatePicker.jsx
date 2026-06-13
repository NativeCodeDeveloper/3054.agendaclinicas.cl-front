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

export default function ShadcnDatePicker({label = "Fecha", value, onChange}) {
    const [open, setOpen] = React.useState(false)
    const initialDate = value ? new Date(value) : undefined
    const [date, setDate] = React.useState(initialDate)

    function formatDate(d) {
        if (!d) return ""
        return d.toLocaleDateString()
    }

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                    >
                        {date ? formatDate(date) : "Select date"}
                        <ChevronDownIcon/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(selectedDate) => {
                            setDate(selectedDate)
                            setOpen(false)
                            if (onChange && selectedDate) {
                                // Emitir yyyy-mm-dd en hora local (evita desfase UTC)
                                const y = selectedDate.getFullYear()
                                const m = String(selectedDate.getMonth() + 1).padStart(2, "0")
                                const d = String(selectedDate.getDate()).padStart(2, "0")
                                onChange(`${y}-${m}-${d}`)
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
