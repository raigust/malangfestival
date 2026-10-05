import { NextResponse } from "next/server";
import { store, DEFAULT_SITE_CONTENT, ensureStoreLoaded } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await ensureStoreLoaded();
  const current = store.siteContent || DEFAULT_SITE_CONTENT;
  const content = {
    ...DEFAULT_SITE_CONTENT,
    ...current,
    audioTrack: {
      ...DEFAULT_SITE_CONTENT.audioTrack,
      ...(current.audioTrack || {}),
    },
  };

  return NextResponse.json(
    {
      success: true,
      data: content,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
