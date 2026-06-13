import Portada from "@/app/(public)/portada/page";
import Seccion1 from "@/app/(public)/seccion1/page";
import Seccion2 from "@/app/(public)/seccion2/page";
import Seccion3 from "@/app/(public)/seccion3/page";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Portada />
      <Seccion1 />
      <Seccion2 />
      <Seccion3 />
    </main>
  );
}
