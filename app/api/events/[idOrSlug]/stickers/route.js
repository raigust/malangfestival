import { NextResponse } from "next/server";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function POST(request, { params }) {
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

  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const color = (typeof body.color === "string" ? body.color.trim() : "") || "#FFE600";

    if (!text || text.length > 42) {
      return NextResponse.json(
        { success: false, message: "Teks stiker wajib diisi (maksimum 42 karakter)." },
        { status: 400 }
      );
    }

    const sticker = {
      id: store.nextStickerId++,
      eventId: event.id,
      text,
      color,
      rotation: Number((Math.random() * 16 - 8).toFixed(1)),
      createdAt: new Date().toISOString()
    };

    if (!event.stickers) event.stickers = [];
    event.stickers.unshift(sticker);
    event.updatedAt = new Date().toISOString();

    return NextResponse.json(
      { success: true, message: "Stiker apresiasi berhasil ditempelkan.", data: sticker },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menempelkan stiker." },
      { status: 400 }
    );
  }
}
