import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { store, signAdminToken, publicAdmin } from "@/lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const admin = store.admin.username === username ? store.admin : null;
    const isValid = admin && (await bcrypt.compare(password, admin.passwordHash));

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Username atau password tidak tepat." },
        { status: 401 }
      );
    }

    const token = signAdminToken(admin);
    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: publicAdmin(admin),
        expiresIn: "8h",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
