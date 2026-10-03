import { NextResponse } from "next/server";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function POST(_request, { params }) {
  const { idOrSlug } = params;
  const isNumeric = /^\d+$/.test(idOrSlug);
  const numericId = isNumeric ? Number(idOrSlug) : null;

  const event = store.events.find((e) =>
    (numericId ? e.id === numericId : e.slug === idOrSlug) &&
    PUBLIC_STATUSES.includes(e.status)
  );

  if (!event) {
    return NextResponse.json(
      { success: false, message: "Poster tidak ditemukan." },
      { status: 404 }
    );
  }

  event.likesCount = (event.likesCount || 0) + 1;
  event.updatedAt = new Date().toISOString();

  return NextResponse.json({ success: true, likesCount: event.likesCount });
}
