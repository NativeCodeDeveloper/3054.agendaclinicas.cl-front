import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const CORREO = process.env.CORREO_OFICIAL;

const CTA1 = () => (
    <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
            <div className="flex flex-col text-center text-amber-700 bg-amber-50 rounded-md p-4 lg:p-14 gap-8 items-center">
                <div>
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300">Notificacion</Badge>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                        Su pago se encuentra en proceso.
                    </h3>
                    <p className="text-lg leading-relaxed tracking-tight text-amber-800 text-muted-foreground max-w-xl">
                        Tu pago se encuentra en proceso de validación
                        La plataforma de pagos está verificando la transacción. Este proceso puede tardar algunos minutos dependiendo del método de pago o del banco emisor.

                        Te notificaremos automáticamente cuando el pago sea aprobado o rechazado.
                        Si necesitas asistencia mientras tanto, puedes escribirnos a: <br/>

                        {CORREO}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
                    <Link href="/">
                        <Button className="gap-4 bg-amber-200 text-amber-800 hover:bg-amber-300">
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