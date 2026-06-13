import { AnimatedList } from "./animated-list";
import { cn } from "@/lib/utils";

const itemsDefault = [
  {
    name: "Cobertura nacional",
    description: "Despacho seguro y rápido a todo Chile.",
    color: "#00C9A7",
    time: "Siempre disponible"
  },
  {
    name: "Mantenciones integrales",
    description: "Soluciones completas para vehículos Maxus.",
    color: "#1E86FF",
    time: "Servicio especializado"
  },
  {
    name: "Repuestos originales",
    description: "Garantía de calidad y compatibilidad.",
    color: "#FFB800",
    time: "Stock permanente"
  },
  {
    name: "Entrega eficiente",
    description: "Tiempos de entrega optimizados para su negocio.",
    color: "#FF3D71",
    time: "Entrega récord"
  },
  {
    name: "Soporte postventa",
    description: "Acompañamiento profesional en cada etapa.",
    color: "#0057B8",
    time: "Atención personalizada"
  },
];

function Notification({ name, description, color, time }) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-gray-700 dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function AnimatedListDemo({ items = itemsDefault, className, delay = 120 }) {
  return (
    <div className={cn("relative flex w-full flex-col overflow-hidden p-2", className)}>
      <AnimatedList delay={delay}>
        {items.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t" />
    </div>
  );
}
