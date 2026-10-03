import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase";
import { ensureStoreLoaded } from "@/lib/store";

export async function GET() {
  try {
    const status = await testSupabaseConnection();
    if (status.connected) {
      await ensureStoreLoaded();
    }
    return NextResponse.json({ success: true, data: status });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Gagal memeriksa status Supabase.",
        data: { connected: false, configured: false, message: err.message },
      },
      { status: 500 }
    );
  }
}
