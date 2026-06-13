import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function InfoButton({informacion}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-35  border border-indigo-200 bg-white text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                    <HelpCircle className="h-10 w-10" />
                 Informacion
                </Button>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="center"
                className="max-w-sm rounded-xl bg-white px-5 py-4 text-sm text-slate-700 shadow-xl leading-relaxed"
            >
                <div className="space-y-2">
                    {typeof informacion === "string"
                        ? informacion.split("\n").map((line, index) => (
                            <p key={index} className="text-slate-700">
                                {line}
                            </p>
                        ))
                        : informacion}
                </div>
            </TooltipContent>
        </Tooltip>
    )
}
