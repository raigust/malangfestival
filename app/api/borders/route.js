import { NextResponse } from "next/server";
import { BORDER_STYLES } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ success: true, data: BORDER_STYLES });
}
