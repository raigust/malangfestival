import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {
  getSupabaseClient,
  eventFromRow,
  eventToRow,
  stickerFromRow,
  stickerToRow,
} from "./supabase";

export const BORDER_STYLES = [
  { id: "washi-tape", name: "Papan Mading Lakban & Pin", description: "Kertas karton mading dengan potongan lakban washi tape dan paku payung merah.", accentColor: "#FFE600", badge: "Mading Klasik" },
  { id: "baroque-gold", name: "Bingkai Ukir Klasik Emas", description: "Border ukiran seni opera bergaya barok emas dengan plakat galeri.", accentColor: "#F59E0B", badge: "Opera & Megah" },
  { id: "postage-stamp", name: "Perangko Seni Bergerigi", description: "Tepi perforasi perangko pos tempo dulu dengan cap Malang.", accentColor: "#EF4444", badge: "Vintage Heritage" },
  { id: "ticket-stub", name: "Karcis Teater Klasik", description: "Sobekan tiket pertunjukan opera dan teater dengan detail perforasi.", accentColor: "#8B5CF6", badge: "Lakon & Karcis" },
  { id: "riso-zine", name: "Risograph Neon Punk Zine", description: "Gaya cetak sablon risograph dua warna kontras dengan bayangan offset.", accentColor: "#EC4899", badge: "Eksperimental" },
  { id: "classic-wood", name: "Galeri Kayu Jati Gajayana", description: "Bingkai kayu gelap tebal khas galeri seni murni dengan plakat kuningan.", accentColor: "#78350F", badge: "Gedung Kesenian" },
  { id: "wavy-doodle", name: "Gelombang Psikedelik Neobrutal", description: "Garis kontur asimetris tebal khas poster konser jazz dan festival alternatif.", accentColor: "#06B6D4", badge: "Jazz & Konser" },
];

export const EVENT_STATUSES = ["DRAFT", "UPCOMING", "PUBLISHED", "ARCHIVED"];
export const PUBLIC_STATUSES = ["UPCOMING", "PUBLISHED"];

export const DEFAULT_SITE_CONTENT = {
  topTape: "MADING SENI MALANG · KABAR PANGGUNG, BUNYI, DAN RUPA · EDISI OKTOBER 2026 ✦ MARI MERIAHKAN KOTA",
  heroEyebrow: "KOTA MALANG, INDONESIA • RUANG SENI TERBUKA",
  heroTitleLine1: "Yang hidup",
  heroTitleLine2: "di kota ini,",
  heroTitleItalic: "jangan lewat.",
  heroIntro: "Konser, lakon, opera, pameran, dan gerak yang sedang mencari penontonnya. Semua ditempel di satu mading.",
  heroPhotoUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1300&q=85",
  heroSideDate: "03/10/26",
  heroSideNote: "CATAT. DATANG. BERISIK.",
  marqueeItems: ["♫ KONSER", "✦ PAMERAN", "♧ PERTUNJUKAN", "◉ OPERA", "☄ TEATER", "☕ DISKUSI SENI", "♫ KONSER", "✦ PAMERAN"],
  manifestoText: "Malang Fest adalah mading digital untuk hal-hal yang membuat kota ini berbunyi, bergerak, dan berpikir.",
  footerTagline: "Bukan mesin tiket. Ini papan kabar untuk yang berkarya.",
  categories: ["Semua", "Musik & Konser", "Opera & Klasik", "Teater & Drama", "Tari & Budaya", "Pameran Seni & Rupa", "Seni Rupa"],
  audioTrack: {
    enabled: true,
    title: "Nocturne di Kayutangan (Akustik & Klasik Santai)",
    artist: "Malang Classical & Heritage Ensemble",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    youtubeId: "jfKfPfyJRdk",
    autoplay: true,
    volume: 50
  }
};

export const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Opera Carmen van Oost-Java: Epos Romantika Klasik",
    slug: "opera-carmen-van-oost-java",
    category: "Opera & Klasik",
    posterUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "baroque-gold",
    pinRotation: -2,
    date: new Date("2026-10-18T19:30:00Z").toISOString(),
    time: "19:30 - 22:30 WIB",
    venue: "Gedung Kesenian Gajayana",
    venueAddress: "Jl. Nusakambangan No.19, Kasin, Kec. Klojen, Kota Malang",
    priceType: "Berbayar",
    price: "Rp 65.000 - Rp 150.000",
    ticketUrl: "https://tiket.malangfest.id/carmen-oost-java",
    performer: "Malang Classical Opera Ensemble ft. Soprano Sekar Arum & Surabaya Chamber Philharmonic",
    curator: "Maestro Hendro Sasongko (Dewan Kesenian Jatim)",
    synopsis: "Pementasan opera megah 4 babak yang mengadaptasi karya agung Georges Bizet 'Carmen' dengan sentuhan orkestrasi gamelan slendro malangan dan tata panggung neobrutalisme kolonial. Mengisahkan gairah cinta membara dan nasib tragis di pelataran stasiun trem tua.",
    highlight: "★ Pementasan Opera Megah Pertama Tahun Ini di Gedung Kesenian Gajayana!",
    status: "UPCOMING",
    likesCount: 128,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 1, eventId: 1, text: "Apik Pol! 🎭", color: "#FFE600", rotation: -4, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 2, eventId: 1, text: "Wajib Nonton!", color: "#00F0FF", rotation: 5, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() },
      { id: 3, eventId: 1, text: "Mbois Ilakes!", color: "#FF4365", rotation: -2, createdAt: new Date("2026-10-01T13:00:00Z").toISOString() }
    ]
  },
  {
    id: 2,
    title: "Simfoni Suropati: Masterpieces of Tchaikovsky & Gombloh",
    slug: "simfoni-suropati-tchaikovsky-gombloh",
    category: "Musik & Konser",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "classic-wood",
    pinRotation: 1,
    date: new Date("2026-10-25T19:00:00Z").toISOString(),
    time: "19:00 - 22:00 WIB",
    venue: "Graha Cakrawala Universitas Negeri Malang",
    venueAddress: "Jl. Semarang No.5, Sumbersari, Kec. Lowokwaru, Kota Malang",
    priceType: "Berbayar",
    price: "Rp 50.000 - Rp 120.000",
    ticketUrl: "https://tiket.malangfest.id/simfoni-suropati",
    performer: "Brawijaya Symphony Orchestra ft. Paduan Suara Mahasiswa Gitasurya UM",
    curator: "Dr. FX. Sutopo, M.Sn",
    synopsis: "Kolaborasi simfoni 60-piece orchestra yang meleburkan melodi klasik Tchaikovsky '1812 Overture' dengan repertoar legendaris Gombloh dalam aransemen megah. Menggetarkan gedung dengan brass section menggelegar dan visual lighting analog eksperimental.",
    highlight: "★ 60 Musisi Orkestra Klasik + 40 Vokalis Paduan Suara!",
    status: "UPCOMING",
    likesCount: 215,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 4, eventId: 2, text: "Merinding! 🎻", color: "#00D664", rotation: -6, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 5, eventId: 2, text: "Mahakarya!", color: "#FFE600", rotation: 3, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  },
  {
    id: 3,
    title: "Lakon Arok Dedes: Tragedi Cinta, Keris & Tahta Singhasari",
    slug: "lakon-arok-dedes-tragedi-tahta",
    category: "Teater & Drama",
    posterUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "ticket-stub",
    pinRotation: -3,
    date: new Date("2026-11-05T20:00:00Z").toISOString(),
    time: "20:00 - 22:30 WIB",
    venue: "Gedung Dewan Kesenian Malang (DKM)",
    venueAddress: "Jl. Majapahit No.3, Kauman, Kec. Klojen, Kota Malang",
    priceType: "Berbayar",
    price: "Rp 40.000 - Rp 90.000",
    ticketUrl: "https://tiket.malangfest.id/arok-dedes-dkm",
    performer: "Teater Kanjuruhan ft. Aktor Teater Tradisi Jawa Timur",
    curator: "Bambang Karsono",
    synopsis: "Eksplorasi teater panggung kontemporer mengenai kutukan tujuh turunan keris Mpu Gandring. Menghadirkan dramaturgi gelap dengan kostum tenun lurik Malang dan tata lampu kinetik bernuansa misteri abad pertengahan.",
    highlight: "★ Tata Suara & Efek Suasana Alam Singhasari yang Menghentak!",
    status: "UPCOMING",
    likesCount: 142,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 6, eventId: 3, text: "Aktornya Juara! 🗡️", color: "#FF4365", rotation: 4, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 7, eventId: 3, text: "Plot Twist!", color: "#FFE600", rotation: -2, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  },
  {
    id: 4,
    title: "Sang Panji Pulang Jiwa: Sendratari Topeng Malangan",
    slug: "sang-panji-pulang-jiwa-topeng-malangan",
    category: "Tari & Budaya",
    posterUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "postage-stamp",
    pinRotation: 2,
    date: new Date("2026-11-12T18:30:00Z").toISOString(),
    time: "18:30 - 21:00 WIB",
    venue: "Padepokan Seni Topeng Asmorobangun",
    venueAddress: "Kedungmonggo, Karangpandan, Kec. Pakisaji, Kabupaten Malang",
    priceType: "Gratis",
    price: "Gratis (Donasi Kebudayaan Terbuka)",
    ticketUrl: "https://tiket.malangfest.id/topeng-panji-kedungmonggo",
    performer: "Sanggar Asmorobangun pimpinan Ki Tri Handoyo",
    curator: "Dewan Kebudayaan Malang",
    synopsis: "Kisah kepulangan Raden Panji Asmarabangun menembus hutan rimba belantara untuk menemukan kembali Sekartaji. Diiringi tabuhan gamelan laras pelog kental yang dimainkan langsung di pendopo berlantai tanah liat.",
    highlight: "★ Menyaksikan Langsung Warisan Maestro Topeng Malangan Asli!",
    status: "UPCOMING",
    likesCount: 198,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 8, eventId: 4, text: "Bangga Malang! 🪵", color: "#00F0FF", rotation: -5, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 9, eventId: 4, text: "Lestarikan!", color: "#00D664", rotation: 2, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  },
  {
    id: 5,
    title: "Retrospeksi Kuas Semeru: Pameran Lukisan & Instalasi Rupa",
    slug: "retrospeksi-kuas-semeru",
    category: "Pameran Seni & Rupa",
    posterUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "riso-zine",
    pinRotation: -1,
    date: new Date("2026-11-20T10:00:00Z").toISOString(),
    time: "10:00 - 21:00 WIB (Berlangsung 7 Hari)",
    venue: "Galeri Dewan Kesenian Malang & Ruang Terbuka Hijau",
    venueAddress: "Jl. Majapahit No.3, Kauman, Kec. Klojen, Kota Malang",
    priceType: "Gratis",
    price: "Gratis (Registrasi Pengunjung)",
    ticketUrl: "https://tiket.malangfest.id/kuas-semeru-exhibition",
    performer: "18 Seniman Rupa Arek Malang & Kolektif Perupa Lereng Bromo",
    curator: "Agus 'Koecink' Sukamto",
    synopsis: "Pameran seni visual bertaraf nasional yang menampilkan 45 lukisan kanvas cat minyak, instalasi bambu kinetik, dan video-art pemandangan lanskap spiritual Gunung Semeru dan Malang tempo doeloe. Disertai art talk dan demo live painting.",
    highlight: "★ Eksplorasi Garis & Warna Neobrutalisme Seni Murni Jawa Timuran",
    status: "UPCOMING",
    likesCount: 167,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 10, eventId: 5, text: "Estetik Parah! 🎨", color: "#FFE600", rotation: 6, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 11, eventId: 5, text: "Kuas Gahar!", color: "#FF4365", rotation: -4, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  },
  {
    id: 6,
    title: "Nocturne di Kayutangan: String Quartet & Harpsichord Recital",
    slug: "nocturne-di-kayutangan-recital",
    category: "Opera & Klasik",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "washi-tape",
    pinRotation: 3,
    date: new Date("2026-11-28T20:00:00Z").toISOString(),
    time: "20:00 - 22:00 WIB",
    venue: "Rumah Heritage 1870 Kayutangan",
    venueAddress: "Koridor Utama Jl. Basuki Rahmat No.56, Kauman, Klojen, Kota Malang",
    priceType: "Berbayar",
    price: "Rp 75.000 (Termasuk Kopi & Kue Tradisional)",
    ticketUrl: "https://tiket.malangfest.id/nocturne-kayutangan",
    performer: "Kayutangan Chamber Quartet ft. Pianis & Harpsichordist Daniel Kristianto",
    curator: "Komunitas Musik Klasik Malang",
    synopsis: "Pertunjukan malam intim di beranda rumah peninggalan kolonial abad ke-19. Mengalunkan karya-karya malam karya Chopin, Vivaldi, dan Bach yang dipadukan dengan kidung Jawa klasik. Dikelilingi temaram lampu teplok dan semilir angin dingin Malang tempo dulu.",
    highlight: "★ Kapasitas Sangat Terbatas (Hanya 60 Kursi Eksklusif)!",
    status: "UPCOMING",
    likesCount: 189,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 12, eventId: 6, text: "Syahdu Pol! ☕", color: "#00F0FF", rotation: 1, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 13, eventId: 6, text: "Vibe Klasik!", color: "#FFE600", rotation: -3, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  },
  {
    id: 7,
    title: "Malang Vintage Brass & Big Band Jazz Nocturnal 2026",
    slug: "malang-vintage-brass-jazz-2026",
    category: "Musik & Konser",
    posterUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
    borderStyle: "wavy-doodle",
    pinRotation: -2,
    date: new Date("2026-12-04T18:00:00Z").toISOString(),
    time: "18:00 - 23:00 WIB",
    venue: "Amphitheater Taman Krida Budaya Jawa Timur (TKBJ)",
    venueAddress: "Jl. Soekarno - Hatta No.7, Jatimulyo, Kec. Lowokwaru, Kota Malang",
    priceType: "Berbayar",
    price: "Rp 35.000 - Rp 85.000",
    ticketUrl: "https://tiket.malangfest.id/brass-jazz-malang",
    performer: "Malang Brass Syndicate, Surabaya All-Star Jazz, & Guest Trombonist",
    curator: "Malang Jazz Society",
    synopsis: "Ledakan harmoni brass trumpet, trombone, saxophone, dan drum berirama swing-bebop era 1940-an hingga funk eksperimental. Digelar di ruang terbuka TKBJ di bawah naungan pohon trembesi dengan instalasi neon neobrutalisme.",
    highlight: "★ Festival Terompet & Big Band Terbesar se-Jawa Timur!",
    status: "UPCOMING",
    likesCount: 290,
    createdAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-10-01T10:00:00Z").toISOString(),
    stickers: [
      { id: 14, eventId: 7, text: "Swing Abis! 🎺", color: "#FF4365", rotation: 5, createdAt: new Date("2026-10-01T11:00:00Z").toISOString() },
      { id: 15, eventId: 7, text: "Groovy Rek!", color: "#00D664", rotation: -2, createdAt: new Date("2026-10-01T12:00:00Z").toISOString() }
    ]
  }
];

// Persistent File Storage paths
function getStorageFilePath() {
  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "store.json");
  } catch {
    return path.join("/tmp", "malangfest-store.json");
  }
}

function loadFromFile() {
  try {
    const file = getStorageFilePath();
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read store file:", err.message);
  }
  return null;
}

function saveToFile(data) {
  try {
    const file = getStorageFilePath();
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write store file:", err.message);
  }
}

function initStore() {
  if (globalThis.__malangFestStore) {
    return globalThis.__malangFestStore;
  }

  const defaultAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";
  const defaultAdminUsername = process.env.INITIAL_ADMIN_USERNAME || "admin";
  const passwordHash = bcrypt.hashSync(defaultAdminPassword, 10);

  const fileData = loadFromFile();

  const store = {
    events: fileData?.events || JSON.parse(JSON.stringify(INITIAL_EVENTS)),
    siteContent: fileData?.siteContent || JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)),
    admin: fileData?.admin || {
      id: 1,
      username: defaultAdminUsername,
      passwordHash,
      displayName: "Admin Malang Fest",
      role: "ADMIN"
    },
    nextEventId: fileData?.nextEventId || 8,
    nextStickerId: fileData?.nextStickerId || 16,
    isSupabaseLoaded: false
  };

  globalThis.__malangFestStore = store;
  return store;
}

export const store = initStore();

export function persistStore() {
  saveToFile({
    events: store.events,
    siteContent: store.siteContent,
    admin: store.admin,
    nextEventId: store.nextEventId,
    nextStickerId: store.nextStickerId,
  });
}

// Seamless Supabase Hydration & Synchronization
export async function ensureStoreLoaded() {
  const supabase = getSupabaseClient();
  if (!supabase || store.isSupabaseLoaded) return;

  try {
    const { data: dbEvents, error: evError } = await supabase
      .from("events")
      .select("*")
      .order("id", { ascending: true });

    if (!evError && dbEvents) {
      if (dbEvents.length > 0) {
        // Fetch stickers
        const { data: dbStickers } = await supabase.from("stickers").select("*");
        const stickersByEvent = {};
        (dbStickers || []).forEach((st) => {
          const evId = Number(st.event_id);
          if (!stickersByEvent[evId]) stickersByEvent[evId] = [];
          stickersByEvent[evId].push(st);
        });

        store.events = dbEvents.map((row) => eventFromRow(row, stickersByEvent[Number(row.id)] || []));
        const maxId = Math.max(...store.events.map((e) => e.id), 0);
        store.nextEventId = maxId + 1;
      } else {
        // Seed initial events to Supabase so DB isn't empty!
        for (const ev of INITIAL_EVENTS) {
          const row = eventToRow(ev);
          const { data: inserted } = await supabase.from("events").insert(row).select().single();
          if (inserted && ev.stickers) {
            for (const st of ev.stickers) {
              await supabase.from("stickers").insert({
                event_id: inserted.id,
                text: st.text,
                color: st.color,
                rotation: st.rotation,
                is_curator_badge: Boolean(st.isCuratorBadge),
              });
            }
          }
        }
      }

      // Fetch site content
      const { data: dbContent } = await supabase.from("site_content").select("data").eq("key", "main").single();
      if (dbContent?.data) {
        store.siteContent = dbContent.data;
      }

      store.isSupabaseLoaded = true;
      persistStore();
    }
  } catch (err) {
    console.error("Supabase hydration error:", err.message);
  }
}

// Asynchronous DB mutation helpers
export async function saveEvent(event) {
  const index = store.events.findIndex((e) => e.id === event.id);
  if (index >= 0) {
    store.events[index] = event;
  } else {
    store.events.push(event);
  }
  persistStore();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = eventToRow(event);
      if (index >= 0) {
        await supabase.from("events").update(row).eq("id", event.id);
      } else {
        const { data: inserted } = await supabase.from("events").insert(row).select().single();
        if (inserted) {
          event.id = Number(inserted.id);
          store.events[store.events.length - 1] = event;
        }
      }
    } catch (err) {
      console.error("Failed to save event to Supabase:", err.message);
    }
  }
  return event;
}

export async function deleteEvent(id) {
  const index = store.events.findIndex((e) => e.id === id);
  if (index >= 0) {
    store.events.splice(index, 1);
  }
  persistStore();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch (err) {
      console.error("Failed to delete event from Supabase:", err.message);
    }
  }
}

export async function addSticker(sticker) {
  const targetEvent = store.events.find((e) => e.id === sticker.eventId);
  if (targetEvent) {
    if (!targetEvent.stickers) targetEvent.stickers = [];
    targetEvent.stickers.push(sticker);
  }
  persistStore();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const row = stickerToRow(sticker);
      const { data: inserted } = await supabase.from("stickers").insert(row).select().single();
      if (inserted) {
        sticker.id = Number(inserted.id);
      }
    } catch (err) {
      console.error("Failed to add sticker to Supabase:", err.message);
    }
  }
  return sticker;
}

export async function deleteSticker(id) {
  for (const ev of store.events) {
    if (ev.stickers) {
      const idx = ev.stickers.findIndex((s) => s.id === id);
      if (idx >= 0) {
        ev.stickers.splice(idx, 1);
        break;
      }
    }
  }
  persistStore();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("stickers").delete().eq("id", id);
    } catch (err) {
      console.error("Failed to delete sticker from Supabase:", err.message);
    }
  }
}

export async function saveContent(content) {
  store.siteContent = content;
  persistStore();

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from("site_content").upsert({
        key: "main",
        data: content,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to save content to Supabase:", err.message);
    }
  }
  return content;
}

export function getJwtSecret() {
  return process.env.JWT_SECRET || "malangfest-local-development-secret-change-before-production";
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, username: admin.username, role: admin.role },
    getJwtSecret(),
    { expiresIn: "8h" }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export function publicAdmin(admin) {
  return {
    id: admin.id,
    username: admin.username,
    displayName: admin.displayName,
    role: admin.role,
  };
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function uniqueSlug(title, excludedId) {
  const root = slugify(title) || "poster-malangfest";
  let slug = root;
  let number = 2;
  while (true) {
    const existing = store.events.find((e) => e.slug === slug);
    if (!existing || existing.id === excludedId) return slug;
    slug = `${root}-${number}`;
    number += 1;
  }
}
