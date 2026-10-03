import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store } from "@/lib/store";

export async function DELETE(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const id = Number(params.id);
  let found = false;

  store.events.forEach((ev) => {
    if (Array.isArray(ev.stickers)) {
      const idx = ev.stickers.findIndex((st) => st.id === id);
      if (idx !== -1) {
        ev.stickers.splice(idx, 1);
        ev.updatedAt = new Date().toISOString();
        found = true;
      }
    }
  });

  if (!found) {
    return NextResponse.json(
      { success: false, message: "Stiker tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Stiker berhasil dicopot / dimoderasi.",
  });
}
