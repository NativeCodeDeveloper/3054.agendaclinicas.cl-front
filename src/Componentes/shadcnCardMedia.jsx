import {
    CardFlip,
    CardFlipFront,
    CardFlipBack,
    CardFlipHeader,
    CardFlipFooter,
    CardFlipTitle,
    CardFlipDescription,
    CardFlipContent,
    CardFlipAction,
} from "@/components/ui/card-flip";

export default function ShadcnCardMedia({titulo, descripcion, precio, imagen}) {
    return (
        <div className="w-full max-w-[240px] min-h-[340px]">
            <CardFlip >
                <CardFlipFront>
                    <CardFlipHeader>
                        <CardFlipTitle>{titulo}</CardFlipTitle>
                    </CardFlipHeader>
                    <CardFlipContent>
                        <p>{descripcion}</p>
                    </CardFlipContent>
                </CardFlipFront>

                <CardFlipBack>
                    <CardFlipHeader>
                        <CardFlipTitle>${precio}</CardFlipTitle>
                    </CardFlipHeader>
                    <CardFlipContent>
                        <img src={imagen} alt={titulo} className="w-full h-40 rounded-md object-cover" />
                    </CardFlipContent>
                </CardFlipBack>
            </CardFlip>
        </div>
    )
}