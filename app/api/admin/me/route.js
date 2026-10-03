import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function GET(request) {
  const { admin, error } = getAuthenticatedAdmin(request);
  if (error) return error;

  return NextResponse.json({ success: true, data: admin });
}
