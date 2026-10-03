import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { store, DEFAULT_SITE_CONTENT } from "@/lib/store";

export async function POST(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  store.siteContent = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));

  return NextResponse.json({
    success: true,
    message: "Konten website berhasil dikembalikan ke standar bawaan Malang Fest.",
    data: store.siteContent,
  });
}
