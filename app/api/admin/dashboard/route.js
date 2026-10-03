import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, PUBLIC_STATUSES } from "@/lib/store";

export async function GET(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const now = new Date().getTime();
  const totalEvents = store.events.length;
  const drafts = store.events.filter((e) => e.status === "DRAFT").length;
  const live = store.events.filter(
    (e) => PUBLIC_STATUSES.includes(e.status) && new Date(e.date).getTime() >= now
  ).length;
  const applause = store.events.reduce((acc, curr) => acc + (curr.likesCount || 0), 0);
  const categories = new Set(store.events.map((e) => e.category));
  const categoryCount = categories.size;

  const recentEvents = [...store.events]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      title: e.title,
      status: e.status,
      updatedAt: e.updatedAt,
      borderStyle: e.borderStyle,
    }));

  return NextResponse.json({
    success: true,
    data: {
      totalEvents,
      drafts,
      live,
      applause,
      categoryCount,
      recentEvents,
    },
  });
}
