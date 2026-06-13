"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function NoAccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="max-w-md w-full p-10 bg-white/90 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            🚫 Acceso Restringido
          </h2>
          <p className="mt-3 text-gray-600 text-base leading-relaxed">
            Esta sección está limitada a usuarios autorizados.
            Si crees que deberías tener acceso, contacta con el administrador.
          </p>
        </div>

        <div className="mt-8">
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push("/")}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              paddingY: "10px",
              fontSize: "1rem",
              backgroundColor: "#b08968",
              boxShadow: "0px 4px 12px rgba(176, 137, 104, 0.3)",
              "&:hover": {
                backgroundColor: "#8b6b4f",
                boxShadow: "0px 6px 16px rgba(139, 107, 79, 0.4)",
              },
            }}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
