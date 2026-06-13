import { Star } from "lucide-react";

export default function TestimonialCard({
                                            nombre,
                                            puntuacion = 5,
                                            servicio,
                                            comentario,
                                        }) {
    const iniciales = nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between transition-all hover:shadow-xl">

            {/* Rating */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    strokeWidth={1.5}
                    color={i < puntuacion ? "#facc15" : "#fde68a"}
                    fill={i < puntuacion ? "#facc15" : "#fde68a"}
                    className={i < puntuacion ? "" : "opacity-70"}
                  />
                ))}
            </div>

            {/* Comentario */}
            <p className="text-gray-600 text-lg italic leading-relaxed mb-8">
                “{comentario}”
            </p>

            {/* Footer */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {iniciales}
                </div>

                <div>
                    <p className="font-semibold text-gray-900">{nombre}</p>
                    <p className="text-sm text-gray-500">{servicio}</p>
                </div>
            </div>
        </div>
    );
}