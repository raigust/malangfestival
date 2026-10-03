import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  return { url: url.trim(), key: key.trim(), isConfigured: Boolean(url && key) };
}

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(config.url, config.key, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

// Convert DB snake_case row to JS camelCase event
export function eventFromRow(row, stickers = []) {
  if (!row) return null;
  return {
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
    category: row.category,
    posterUrl: row.poster_url,
    borderStyle: row.border_style || "washi-tape",
    pinRotation: Number(row.pin_rotation) || 0,
    date: row.date,
    time: row.time,
    venue: row.venue,
    venueAddress: row.venue_address || "",
    priceType: row.price_type || "Gratis",
    price: row.price,
    ticketUrl: row.ticket_url || "",
    performer: row.performer || "",
    curator: row.curator || "",
    synopsis: row.synopsis || "",
    highlight: row.highlight || "",
    status: row.status || "UPCOMING",
    likesCount: Number(row.likes_count) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stickers: (stickers || []).map(stickerFromRow),
  };
}

export function eventToRow(event) {
  return {
    title: event.title,
    slug: event.slug,
    category: event.category,
    poster_url: event.posterUrl,
    border_style: event.borderStyle || "washi-tape",
    pin_rotation: Math.round(Number(event.pinRotation) || 0),
    date: event.date,
    time: event.time,
    venue: event.venue,
    venue_address: event.venueAddress || null,
    price_type: event.priceType || "Gratis",
    price: event.price,
    ticket_url: event.ticketUrl || null,
    performer: event.performer,
    curator: event.curator || null,
    synopsis: event.synopsis,
    highlight: event.highlight || null,
    status: event.status || "UPCOMING",
    likes_count: Number(event.likesCount) || 0,
    updated_at: new Date().toISOString(),
  };
}

export function stickerFromRow(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    eventId: Number(row.event_id),
    text: row.text,
    color: row.color || "#FFE600",
    rotation: Number(row.rotation) || 0,
    isCuratorBadge: Boolean(row.is_curator_badge),
    createdAt: row.created_at,
  };
}

export function stickerToRow(sticker) {
  return {
    event_id: Number(sticker.eventId),
    text: sticker.text,
    color: sticker.color || "#FFE600",
    rotation: Number(sticker.rotation) || 0,
    is_curator_badge: Boolean(sticker.isCuratorBadge),
    created_at: sticker.createdAt || new Date().toISOString(),
  };
}

export async function testSupabaseConnection() {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return {
      connected: false,
      configured: false,
      message: "Environment variables Supabase belum diisi (NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY).",
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { connected: false, configured: true, message: "Gagal menginisialisasi klien Supabase." };
  }

  try {
    // Check events table
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("id")
      .limit(1);

    if (eventsError) {
      if (eventsError.code === "42P01") {
        return {
          connected: false,
          configured: true,
          schemaMissing: true,
          message:
            "Koneksi Supabase aktif, tetapi tabel 'events' belum ditemukan. Silakan jalankan script 'supabase-schema.sql' di SQL Editor dashboard Supabase Anda.",
        };
      }
      return {
        connected: false,
        configured: true,
        message: `Koneksi Supabase gagal: ${eventsError.message} (Kode: ${eventsError.code || "unknown"})`,
      };
    }

    // Check site_content table
    const { error: contentError } = await supabase.from("site_content").select("key").limit(1);
    // Check stickers table
    const { error: stickersError } = await supabase.from("stickers").select("id").limit(1);

    return {
      connected: true,
      configured: true,
      schemaReady: !eventsError && !contentError && !stickersError,
      message: "Supabase terhubung dengan sukses! Data disimpan permanen di database PostgreSQL cloud.",
      url: config.url,
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      message: `Gagal menghubungi Supabase: ${err.message}`,
    };
  }
}
