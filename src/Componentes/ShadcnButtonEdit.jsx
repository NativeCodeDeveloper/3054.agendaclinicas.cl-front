import { Button } from "@/components/ui/button"

export function ShadcnButtonEdit({ className, nombreBoton }) {
    return (
        <Button
            variant="outline"
            className={className}
        >
            {nombreBoton}
        </Button>
    )
}