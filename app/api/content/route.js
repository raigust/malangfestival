import { NextResponse } from "next/server";
import { store, DEFAULT_SITE_CONTENT, ensureStoreLoaded } from "@/lib/store";

export async function GET() {
  await ensureStoreLoaded();
  const content = store.siteContent || DEFAULT_SITE_CONTENT;
  return NextResponse.json({
    success: true,
    data: content,
  });
}
