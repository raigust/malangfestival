import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, addSticker, ensureStoreLoaded } from "@/lib/store";

export async function GET(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  await ensureStoreLoaded();

  const allStickers = [];
  store.events.forEach((ev) => {
    if (Array.isArray(ev.stickers)) {
      ev.stickers.forEach((st) => {
        allStickers.push({
          ...st,
          eventId: ev.id,
          eventTitle: ev.title,
          eventCategory: ev.category,
        });
      });
    }
  });

  allStickers.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  return NextResponse.json({
    success: true,
    count: allStickers.length,
    data: allStickers,
  });
}

export async function POST(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const eventId = Number(body.eventId);
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const color = (typeof body.color === "string" ? body.color.trim() : "") || "#FFE600";

    if (!eventId || !text) {
      return NextResponse.json(
        { success: false, message: "Pilih poster dan isi teks stiker." },
        { status: 400 }
      );
    }

    const event = store.events.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Poster tujuan tidak ditemukan." },
        { status: 404 }
      );
    }

    const sticker = {
      id: store.nextStickerId++,
      eventId: event.id,
      text,
      color,
      rotation: Number((Math.random() * 16 - 8).toFixed(1)),
      createdAt: new Date().toISOString(),
      isCuratorBadge: true,
    };

    await addSticker(sticker);
    event.updatedAt = new Date().toISOString();

    return NextResponse.json(
      {
        success: true,
        message: `Stiker kurator berhasil ditempel pada poster "${event.title}".`,
        data: sticker,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
