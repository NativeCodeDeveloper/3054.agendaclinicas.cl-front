import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const CORREO = process.env.CORREO_OFICIAL;

const CTA1 = () => (
    <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
            <div className="flex flex-col text-center text-red-700 bg-red-50 rounded-md p-4 lg:p-14 gap-8 items-center">
                <div>
                    <Badge className="bg-red-100 text-red-700 border-red-300">Notificacion</Badge>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                        Su pago ha sido Rechazado.
                    </h3>
                    <p className="text-lg leading-relaxed tracking-tight text-red-800 text-muted-foreground max-w-xl">
                        Lamentablemente la transacción fue rechazada por la plataforma de pagos. Esto puede deberse a fondos insuficientes, verificación fallida o restricciones del banco emisor.

                        Por favor, intenta nuevamente con otro medio de pago o comunícate con tu banco para más información.
                        Si necesitas ayuda adicional, no dudes en escribirnos a: <br/>
                        {CORREO}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <Link href="/">
                        <Button className="gap-4 bg-red-200 text-red-800 hover:bg-red-300">
                            Volver a pagina principal <MoveRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default function PagoAprobadoPage() {
    return <CTA1 />;
}