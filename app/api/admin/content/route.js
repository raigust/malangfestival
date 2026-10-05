import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, DEFAULT_SITE_CONTENT, saveContent, ensureStoreLoaded } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  await ensureStoreLoaded();

  return NextResponse.json({
    success: true,
    data: store.siteContent || DEFAULT_SITE_CONTENT,
  });
}

export async function PUT(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  try {
    await ensureStoreLoaded();
    const body = await request.json();
    const current = store.siteContent || { ...DEFAULT_SITE_CONTENT };

    // Update only provided keys
    const allowedKeys = [
      "topTape",
      "heroEyebrow",
      "heroTitleLine1",
      "heroTitleLine2",
      "heroTitleItalic",
      "heroIntro",
      "heroPhotoUrl",
      "heroSideDate",
      "heroSideNote",
      "marqueeItems",
      "manifestoText",
      "footerTagline",
      "categories",
      "audioTrack",
    ];

    allowedKeys.forEach((key) => {
      if (body[key] !== undefined) {
        current[key] = body[key];
      }
    });

    await saveContent(current);

    return NextResponse.json({
      success: true,
      message: "Konten mading Malang Fest berhasil diperbarui!",
      data: store.siteContent,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
