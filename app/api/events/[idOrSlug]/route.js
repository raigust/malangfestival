import { NextResponse } from "next/server";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function GET(_request, { params }) {
  const { idOrSlug } = params;
  const isNumeric = /^\d+$/.test(idOrSlug);
  const numericId = isNumeric ? Number(idOrSlug) : null;

  const event = store.events.find((e) =>
    (numericId ? e.id === numericId : e.slug === idOrSlug) &&
    PUBLIC_STATUSES.includes(e.status)
  );

  if (!event) {
    return NextResponse.json(
      { success: false, message: "Pertunjukan tidak ditemukan di mading." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: event });
}
