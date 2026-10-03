import { NextResponse } from "next/server";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function GET() {
  const publicEvents = store.events.filter((e) => PUBLIC_STATUSES.includes(e.status));
  const totalEvents = publicEvents.length;
  const categories = new Set(publicEvents.map((e) => e.category));
  const totalCategories = categories.size;
  const totalApplause = publicEvents.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);
  const totalStickers = store.events.reduce((acc, curr) => acc + (curr.stickers ? curr.stickers.length : 0), 0);

  return NextResponse.json({
    success: true,
    data: {
      totalEvents,
      totalCategories,
      totalApplause,
      totalStickers,
    },
  });
}
