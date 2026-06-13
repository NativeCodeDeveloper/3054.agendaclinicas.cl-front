import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CORREO = process.env.CORREO_OFICIAL;

const CTA1 = () => (
    <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
            <div className="flex flex-col text-center text-sky-700 bg-blue-50 rounded-md p-4 lg:p-14 gap-8 items-center">
                <div>
                    <Badge className="bg-sky-100 text-sky-700 border-sky-300">Notificacion</Badge>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                        Tu pago ha sido aprobado!
                    </h3>
                    <p className="text-lg leading-relaxed tracking-tight text-sky-800 text-muted-foreground max-w-xl">
                        Tu pedido esta pendiente de confirmación.

                        En cuanto comencemos a prepararlo te notificaremos inmediatamente a los datos de contacto que nos entregaste. Podrás seguir cada etapa del trayecto y conocer en qué parte del proceso se encuentra tu compra. Si tienes dudas o necesitas asistencia, escríbenos a: <br/>

                        {CORREO}
                    </p>
                </div>
                <div className="flex flex-row gap-4">
<Link href="/">
    <Button className="gap-4 bg-sky-200 text-sky-800 hover:bg-sky-300">
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