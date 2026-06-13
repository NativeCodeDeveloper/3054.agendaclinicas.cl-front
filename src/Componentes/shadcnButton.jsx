import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ShadcnButton({ nombre, funcion, className}) {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button className={className} onClick={funcion}>
                {nombre}
            </Button>
        </div>
    )
}
