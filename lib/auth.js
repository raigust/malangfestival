import { NextResponse } from "next/server";
import { verifyAdminToken, store, publicAdmin } from "./store";

export function getAuthenticatedAdmin(request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return {
      error: NextResponse.json(
        { success: false, message: "Login admin diperlukan." },
        { status: 401 }
      ),
    };
  }

  const payload = verifyAdminToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { success: false, message: "Sesi admin tidak valid atau sudah berakhir." },
        { status: 401 }
      ),
    };
  }

  const admin = store.admin;
  if (!admin || admin.id !== Number(payload.sub) || admin.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { success: false, message: "Akses khusus admin ditolak." },
        { status: 403 }
      ),
    };
  }

  return { admin: publicAdmin(admin) };
}
