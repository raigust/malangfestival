import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { saveAudioTrack, store, DEFAULT_SITE_CONTENT, ensureStoreLoaded } from "@/lib/store";
import { extractYouTubeId } from "@/lib/audio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  await ensureStoreLoaded();
  const track = store.siteContent?.audioTrack || DEFAULT_SITE_CONTENT.audioTrack;
  return NextResponse.json(
    { success: true, data: track },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function POST(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const rawUrl = (body.url || "").trim();
    const rawYtId = (body.youtubeId || "").trim();
    const extractedId = extractYouTubeId(rawYtId || rawUrl);

    const payload = {
      enabled: body.enabled !== false,
      title: (body.title || "Nocturne di Kayutangan").trim(),
      artist: (body.artist || "Malang Classical Ensemble").trim(),
      type: body.type === "audio_url" ? "audio_url" : "youtube",
      url: rawUrl,
      youtubeId: extractedId || (body.type !== "audio_url" ? rawUrl : ""),
      autoplay: body.autoplay !== false,
      volume: typeof body.volume === "number" ? body.volume : 50,
    };

    const updated = await saveAudioTrack(payload);

    return NextResponse.json({
      success: true,
      message: `Lagu "${payload.title}" berhasil disimpan dan langsung aktif di web!`,
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
