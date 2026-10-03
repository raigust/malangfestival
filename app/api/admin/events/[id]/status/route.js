import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, EVENT_STATUSES } from "@/lib/store";

export async function POST(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const id = Number(params.id);
  const event = store.events.find((e) => e.id === id);

  if (!event) {
    return NextResponse.json(
      { success: false, message: "Poster tidak ditemukan." },
      { status: 404 }
    );
  }

  try {
    const { status } = await request.json();
    if (!status || !EVENT_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Status tidak valid. Pilihan: ${EVENT_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    event.status = status;
    event.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Status poster "${event.title}" diubah menjadi ${status}.`,
      data: event,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
