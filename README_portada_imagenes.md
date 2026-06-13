# Cómo integrar imágenes de portada diferentes para escritorio y celular en Next.js + Tailwind

## 1. Importa el componente Image de Next.js
```jsx
import Image from "next/image";
```

## 2. Estructura del contenedor de la imagen de fondo
Coloca este bloque en tu componente de portada:

```jsx
<div className="absolute inset-0 z-0 w-full h-[40vh] sm:h-[60vh] md:h-screen" aria-hidden="true">
  {/* Imagen para celulares */}
  <Image
    src="/maxuscel.png" // Ruta de la imagen para móviles
    alt="Fondo Maxus Mobile"
    fill
    priority
    className="object-cover object-center w-full h-full opacity-90 block md:hidden"
  />
  {/* Imagen para escritorio/tablet */}
  <Image
    src={maxusBg} // Variable o ruta de la imagen para desktop
    alt="Fondo Maxus"
    fill
    priority
    className="object-cover object-center w-full h-full opacity-90 hidden md:block"
  />
</div>
```

## 3. Explicación de las clases Tailwind
- `block md:hidden`: Muestra la imagen solo en móviles (menor a md).
- `hidden md:block`: Muestra la imagen solo en escritorio/tablet (md en adelante).
- `object-cover object-center`: La imagen cubre todo el contenedor y se centra.
- `opacity-90`: Da transparencia a la imagen.
- `w-full h-full`: Ocupa todo el ancho y alto del contenedor.

## 4. Ubicación recomendada
Coloca este bloque al inicio del return de tu componente de portada, antes de overlays y contenido principal.

## 5. Resultado
- En móviles, se verá la imagen maxuscel.png.
- En escritorio/tablet, se verá la imagen de escritorio (maxusBg).
- Ambas imágenes serán responsivas y cubrirán el área de la portada correctamente.

---
