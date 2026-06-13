export default function MediaCardImage({ imagenProducto, tituloProducto }) {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden bg-gray-50">
            <img
                src={imagenProducto}
                alt={tituloProducto}
                className="object-contain max-w-full max-h-full"
            />
        </div>
    );
}