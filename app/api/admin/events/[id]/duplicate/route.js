import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, uniqueSlug } from "@/lib/store";

export async function POST(request, { params }) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  const id = Number(params.id);
  const source = store.events.find((e) => e.id === id);

  if (!source) {
    return NextResponse.json(
      { success: false, message: "Poster asal tidak ditemukan." },
      { status: 404 }
    );
  }

  const duplicatedTitle = `${source.title} (Salinan)`;
  const duplicated = {
    ...JSON.parse(JSON.stringify(source)),
    id: store.nextEventId++,
    title: duplicatedTitle,
    slug: uniqueSlug(duplicatedTitle),
    status: "DRAFT",
    likesCount: 0,
    stickers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.events.push(duplicated);

  return NextResponse.json({
    success: true,
    message: `Poster berhasil diduplikasi sebagai draf baru: "${duplicated.title}".`,
    data: duplicated,
  });
}
