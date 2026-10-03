import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, deleteSticker, ensureStoreLoaded } from "@/lib/store";

export async function DELETE(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  await ensureStoreLoaded();

  const id = Number(params.id);
  let found = false;

  for (const ev of store.events) {
    if (Array.isArray(ev.stickers)) {
      const idx = ev.stickers.findIndex((st) => st.id === id);
      if (idx !== -1) {
        found = true;
        break;
      }
    }
  }

  if (!found) {
    return NextResponse.json(
      { success: false, message: "Stiker tidak ditemukan." },
      { status: 404 }
    );
  }

  await deleteSticker(id);

  return NextResponse.json({
    success: true,
    message: "Stiker berhasil dicopot / dimoderasi.",
  });
}
