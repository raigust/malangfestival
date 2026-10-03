import { NextResponse } from "next/server";
import { store, DEFAULT_SITE_CONTENT } from "@/lib/store";

export async function GET() {
  const content = store.siteContent || DEFAULT_SITE_CONTENT;
  return NextResponse.json({
    success: true,
    data: content,
  });
}
