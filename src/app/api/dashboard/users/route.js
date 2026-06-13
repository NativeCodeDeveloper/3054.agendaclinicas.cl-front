import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  canAccessDashboardPath,
  getAssignableDashboardRoles,
  getDashboardRoleFromClaims,
  normalizeDashboardRole,
} from "@/lib/dashboard-access";

const ASSIGNABLE_ROLE_SET = new Set(getAssignableDashboardRoles().map((role) => role.value));

function badRequest(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return badRequest("Debes iniciar sesion para crear usuarios.", 401);
    }

    const requesterRole = getDashboardRoleFromClaims(sessionClaims);

    if (!canAccessDashboardPath(requesterRole, "/dashboard/createUser")) {
      return badRequest("No tienes permisos para crear usuarios.", 403);
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return badRequest("No se pudo leer el formulario enviado.");
    }

    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const role = normalizeDashboardRole(body?.role);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest("Debes ingresar un correo valido.");
    }

    if (password.length < 8) {
      return badRequest("La contrasena debe tener al menos 8 caracteres.");
    }

    if (!ASSIGNABLE_ROLE_SET.has(role)) {
      return badRequest("El perfil seleccionado no es valido.");
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: [email],
      password,
      publicMetadata: {
        role,
        rol: role,
        createdByNativeCodeUserId: userId,
        createdAtNativeCode: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || email,
        role,
      },
    });
  } catch (error) {
    console.error("POST /api/dashboard/users failed", error);

    const clerkMessage =
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      "No se pudo crear el usuario en Clerk.";

    const status = Number(error?.status) || 500;

    return NextResponse.json(
      {
        error: clerkMessage,
        details: error?.errors || null,
      },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
