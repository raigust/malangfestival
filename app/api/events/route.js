import { NextResponse } from "next/server";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const borderStyle = searchParams.get("borderStyle");
  const search = searchParams.get("search");

  let events = store.events.filter((e) => PUBLIC_STATUSES.includes(e.status));

  if (category && category !== "Semua") {
    events = events.filter((e) => e.category === category);
  }

  if (borderStyle && borderStyle !== "all") {
    events = events.filter((e) => e.borderStyle === borderStyle);
  }

  if (search) {
    const query = search.toLowerCase();
    events = events.filter((e) =>
      (e.title || "").toLowerCase().includes(query) ||
      (e.venue || "").toLowerCase().includes(query) ||
      (e.performer || "").toLowerCase().includes(query) ||
      (e.synopsis || "").toLowerCase().includes(query)
    );
  }

  // sort by date asc
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return NextResponse.json({
    success: true,
    count: events.length,
    data: events,
  });
}
