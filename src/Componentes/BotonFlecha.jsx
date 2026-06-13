import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BotonFlecha({ onComprar, onAgregarCarrito }) {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button variant="outline" onClick={onComprar}>
                Comprar
            </Button>
            <Button
                variant="outline"
                size="icon"
                aria-label="Agregar al carrito"
                onClick={onAgregarCarrito}
            >
                <ShoppingCart className="h-4 w-4" />
            </Button>
        </div>
    );
}