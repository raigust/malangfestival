import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function POST(request) {
  const { error } = getAuthenticatedAdmin(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("poster");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "Pilih berkas poster terlebih dahulu." },
        { status: 400 }
      );
    }

    const mime = file.type;
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) {
      return NextResponse.json(
        { success: false, message: "Format poster harus JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran poster maksimal 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64Data}`;
    const filename = `${Date.now()}-${file.name || "poster"}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          url: dataUrl,
          filename,
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unggah poster gagal: " + err.message },
      { status: 400 }
    );
  }
}
