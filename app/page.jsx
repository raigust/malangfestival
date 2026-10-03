"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = "/api";

const defaultCategories = ["Semua", "Musik & Konser", "Opera & Klasik", "Teater & Drama", "Tari & Budaya", "Seni Rupa"];

const defaultContent = {
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
  categories: defaultCategories,
};

const fallbackEvents = [
  {
    id: 1,
    title: "Opera Carmen van Oost-Java",
    category: "Opera & Klasik",
    posterUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1100&q=85",
    borderStyle: "baroque-gold",
    pinRotation: -2,
    date: "2026-10-18T19:30:00.000Z",
    time: "19.30 WIB",
    venue: "Gedung Kesenian Gajayana",
    price: "Rp65—150K",
    performer: "Malang Classical Opera Ensemble",
    synopsis: "Carmen bertemu bunyi slendro Malangan dalam opera empat babak yang hangat, getir, dan megah.",
    highlight: "Pementasan opera besar musim ini",
    likesCount: 128,
    stickers: [{ id: 1, text: "Wajib!", color: "#ffdf2b", rotation: -4 }],
  },
  {
    id: 2,
    title: "Simfoni Suropati",
    category: "Musik & Konser",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=85",
    borderStyle: "classic-wood",
    pinRotation: 1,
    date: "2026-10-25T19:00:00.000Z",
    time: "19.00 WIB",
    venue: "Graha Cakrawala UM",
    price: "Rp50—120K",
    performer: "Brawijaya Symphony Orchestra",
    synopsis: "Orkestra 60 musisi memainkan Tchaikovsky dan lagu-lagu Gombloh dengan napas Malang yang benderang.",
    highlight: "60 musisi + paduan suara",
    likesCount: 215,
    stickers: [{ id: 2, text: "Merinding", color: "#b9ff5b", rotation: 5 }],
  },
  {
    id: 3,
    title: "Lakon Arok Dedes",
    category: "Teater & Drama",
    posterUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1100&q=85",
    borderStyle: "ticket-stub",
    pinRotation: -3,
    date: "2026-11-05T20:00:00.000Z",
    time: "20.00 WIB",
    venue: "Gedung Dewan Kesenian Malang",
    price: "Donasi terbuka",
    performer: "Teater Celaket",
    synopsis: "Lakon kontemporer tentang cinta, keris, serta perebutan tahta Singhasari dalam ruang yang dibiarkan mentah.",
    highlight: "Lakon eksperimental 150 menit",
    likesCount: 94,
    stickers: [{ id: 3, text: "Seni!", color: "#ff7893", rotation: -3 }],
  },
  {
    id: 4,
    title: "Sang Panji Pulang Jiwa",
    category: "Tari & Budaya",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1100&q=85",
    borderStyle: "postage-stamp",
    pinRotation: 2,
    date: "2026-11-12T18:30:00.000Z",
    time: "18.30 WIB",
    venue: "Padepokan Asmorobangun",
    price: "Gratis",
    performer: "Penari Topeng Kedungmonggo",
    synopsis: "Pertunjukan kolosal Wayang Topeng Malangan, berisi puluhan wajah kayu dan gerak yang menyimpan riwayat.",
    highlight: "Topeng, karawitan, dan cerita Panji",
    likesCount: 340,
    stickers: [{ id: 4, text: "Ngalam", color: "#82e7ff", rotation: 4 }],
  },
  {
    id: 5,
    title: "Ruang Retak, Ruang Rupa",
    category: "Seni Rupa",
    posterUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01988f7?auto=format&fit=crop&w=1100&q=85",
    borderStyle: "riso-zine",
    pinRotation: -1,
    date: "2026-11-16T10:00:00.000Z",
    time: "10.00—21.00 WIB",
    venue: "Kunstkring Kota Lama",
    price: "Gratis",
    performer: "12 perupa muda Malang",
    synopsis: "Pameran yang merangkai arsip, tekstur, dan fragmen kota menjadi ruang lihat yang tidak selesai dalam sekali kunjung.",
    highlight: "Pembukaan + artist talk",
    likesCount: 76,
    stickers: [{ id: 5, text: "Mampir!", color: "#f5b7ff", rotation: -6 }],
  },
];

const frameOptions = [
  ["washi-tape", "Lakban & pin", "#ffe55c"],
  ["baroque-gold", "Ukir baroque", "#c99832"],
  ["postage-stamp", "Perangko", "#ff6b65"],
  ["ticket-stub", "Karcis teater", "#a78bfa"],
  ["riso-zine", "Riso zine", "#f08bbe"],
  ["classic-wood", "Kayu galeri", "#774526"],
  ["wavy-doodle", "Gelombang jazz", "#43c7d8"],
];

const stickerPresets = [
  { text: "Mbois Ilakes! 🎭", color: "#FFE600" },
  { text: "Wajib Nonton!", color: "#8CE8EB" },
  { text: "Apik Pol! 💥", color: "#FB4E7B" },
  { text: "Arek Malang Merapat!", color: "#D8FF57" },
  { text: "Keren Parah!", color: "#FFE55C" },
];

function formatDate(dateString) {
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(dateString)).toUpperCase();
  } catch {
    return dateString;
  }
}

function Icon({ name, size = 20, stroke = 2.4 }) {
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>,
    ticket: <><path d="M4 5.8A2.8 2.8 0 0 0 6.8 3h10.4A2.8 2.8 0 0 0 20 5.8v2a2.8 2.8 0 0 1 0 5.4v2A2.8 2.8 0 0 0 17.2 18H6.8A2.8 2.8 0 0 0 4 15.2v-2a2.8 2.8 0 0 1 0-5.4v-2Z"/><path d="M12 7v1M12 11v1M12 15v1"/></>,
    pin: <><path d="m14 4 6 6-3 1-3 5-2-2-5 3 3-5-2-2 5-3 1-3Z"/><path d="m7 17-3 3"/></>,
    clap: <><path d="M9.5 11.5V5.7a1.6 1.6 0 0 1 3.2 0v4.7"/><path d="M12.7 10.3V5.1a1.6 1.6 0 0 1 3.2 0v6.5"/><path d="M15.9 11.3V7a1.55 1.55 0 1 1 3.1 0v7.5c0 3.4-2.3 5.5-5.8 5.5h-1.1c-2.1 0-3.6-.8-4.9-2.2L4.8 15.2a1.7 1.7 0 0 1 2.4-2.4l2.3 2.1"/><path d="M6 5.5v4M3 8.2l2.8 2.8"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    spark: <><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/><path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7L19 17Z"/></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1.5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function PosterCard({ event, onOpen, onClap }) {
  const sticker = event.stickers?.[0];
  return (
    <article className={`poster-card frame-${event.borderStyle}`} style={{ "--tilt": `${event.pinRotation || 0}deg` }}>
      <button className="poster-image" onClick={() => onOpen(event)} aria-label={`Lihat detail ${event.title}`}>
        <img src={event.posterUrl} alt="" />
        <span className="poster-wash" />
        <span className="poster-date">{formatDate(event.date)}</span>
        <span className="poster-type">{event.category}</span>
        <span className="poster-copy">
          <small>{event.venue}</small>
          <strong>{event.title}</strong>
          <em>{event.time}</em>
        </span>
        {sticker && <span className="sticker" style={{ background: sticker.color, transform: `rotate(${sticker.rotation || -3}deg)` }}>{sticker.text}</span>}
      </button>
      <div className="poster-footer">
        <span>{event.price}</span>
        <button className="clap" onClick={() => onClap(event)} aria-label={`Tepuk tangan untuk ${event.title}`}><Icon name="clap" size={18} /> {event.likesCount}</button>
      </div>
    </article>
  );
}

function EventModal({ event, onClose, onClap, onAddSticker }) {
  const [showStickerInput, setShowStickerInput] = useState(false);
  const [customText, setCustomText] = useState("");
  const [stickerColor, setStickerColor] = useState("#FFE600");

  if (!event) return null;

  function submitSticker(e) {
    e.preventDefault();
    if (!customText.trim()) return;
    onAddSticker(event, customText.trim(), stickerColor);
    setCustomText("");
    setShowStickerInput(false);
  }

  function pickPreset(preset) {
    onAddSticker(event, preset.text, preset.color);
    setShowStickerInput(false);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={`event-modal frame-${event.borderStyle}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={event.title}>
        <button className="close-button" onClick={onClose} aria-label="Tutup detail"><Icon name="close" /></button>
        <div className="modal-art">
          <img src={event.posterUrl} alt="" />
        </div>
        <div className="modal-info">
          <span className="eyebrow">{event.category} · {formatDate(event.date)}</span>
          <h2>{event.title}</h2>
          <p className="performer">{event.performer}</p>
          <p>{event.synopsis}</p>
          <div className="event-facts">
            <span><b>Kapan</b>{formatDate(event.date)} · {event.time}</span>
            <span><b>Di mana</b>{event.venue}</span>
            <span><b>Akses</b>{event.price}</span>
            {event.curator && <span><b>Kurator</b>{event.curator}</span>}
            {event.highlight && <span><b>Sorotan</b>{event.highlight}</span>}
          </div>

          {event.stickers && event.stickers.length > 0 && (
            <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <b style={{ font: "700 10px 'DM Mono'", width: "100%", color: "#665f57" }}>STIKER APRESIASI WARGA ({event.stickers.length}):</b>
              {event.stickers.map((st, i) => (
                <span key={st.id || i} style={{ background: st.color || "#FFE600", border: "1.5px solid var(--ink)", padding: "3px 8px", font: "700 9px 'Syne'", transform: `rotate(${st.rotation || 0}deg)`, display: "inline-block" }}>
                  {st.text}
                </span>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button className="button button-dark" onClick={() => onClap(event)}><Icon name="clap" size={18} /> Beri tepuk tangan ({event.likesCount})</button>
            <button className="button button-pink" onClick={() => setShowStickerInput(!showStickerInput)}><Icon name="tag" size={17} /> Tempel stiker</button>
            {event.ticketUrl && (
              <a className="button button-light" href={event.ticketUrl} target="_blank" rel="noopener noreferrer">Beli Tiket <Icon name="arrow" size={17} /></a>
            )}
          </div>

          {showStickerInput && (
            <div style={{ marginTop: "16px", padding: "14px", border: "1.5px solid var(--ink)", background: "#fffdf8" }}>
              <span style={{ font: "700 10px 'DM Mono'", display: "block", marginBottom: "8px" }}>PILIH STIKER CEPAT:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                {stickerPresets.map((pr, idx) => (
                  <button key={idx} type="button" onClick={() => pickPreset(pr)} style={{ background: pr.color, border: "1.5px solid var(--ink)", padding: "5px 9px", font: "700 10px 'DM Mono'" }}>
                    {pr.text}
                  </button>
                ))}
              </div>
              <form onSubmit={submitSticker} style={{ display: "flex", gap: "6px" }}>
                <input
                  type="text"
                  maxLength={42}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Atau tulis stiker sendiri (maks 42 karakter)..."
                  style={{ flex: 1, padding: "8px", font: "500 11px 'DM Mono'", border: "1.5px solid var(--ink)", background: "transparent" }}
                />
                <button type="submit" className="button button-dark" style={{ padding: "8px 12px" }}>Tempel!</button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function CuratorStudio({ open, onClose }) {
  const [picked, setPicked] = useState("baroque-gold");
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="studio" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Studio kurator">
        <button className="close-button" onClick={onClose} aria-label="Tutup studio"><Icon name="close" /></button>
        <span className="eyebrow">AREA KURATOR / BINGKAI POSTER</span>
        <h2>Setiap poster boleh<br/><i>punya panggung sendiri.</i></h2>
        <p>Pilih karakter bingkai sebelum poster ditempel. Sistem ini tersambung langsung dengan data <code>borderStyle</code> di Malang Fest.</p>
        <div className="frame-picker">
          {frameOptions.map(([id, label, color]) => (
            <button key={id} className={`frame-choice ${picked === id ? "selected" : ""}`} onClick={() => setPicked(id)}>
              <span className={`mini-frame frame-${id}`} style={{ "--frame-color": color }}><b /></span>
              {label}
            </button>
          ))}
         </div>
        <div className="studio-bottom">
          <span><b>Bingkai terpilih:</b> {frameOptions.find(([id]) => id === picked)?.[1]}</span>
          <a className="button button-pink" href="/admin">Masuk ke Ruang Kurator <Icon name="plus" size={18}/></a>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState(fallbackEvents);
  const [content, setContent] = useState(defaultContent);
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Fetch live events
    fetch(`${API_URL}/events`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("API belum tersedia"))))
      .then((payload) => {
        if (payload?.data?.length) setEvents(payload.data);
      })
      .catch(() => {});

    // Fetch dynamic site content
    fetch(`${API_URL}/content`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Content API"))))
      .then((payload) => {
        if (payload?.data) setContent(payload.data);
      })
      .catch(() => {});
  }, []);

  const activeCategories = content?.categories || defaultCategories;

  const filteredEvents = useMemo(() => events.filter((event) => {
    const inCategory = category === "Semua" || event.category === category;
    const searchable = `${event.title} ${event.venue} ${event.performer}`.toLowerCase().includes(query.toLowerCase());
    return inCategory && searchable;
  }), [category, events, query]);

  async function clap(event) {
    setEvents((current) => current.map((item) => (item.id === event.id ? { ...item, likesCount: (item.likesCount || 0) + 1 } : item)));
    setSelected((current) => (current?.id === event.id ? { ...current, likesCount: (current.likesCount || 0) + 1 } : current));
    setNotice("Tepuk tanganmu sudah ditempel di poster!");
    window.setTimeout(() => setNotice(""), 2600);
    try {
      await fetch(`${API_URL}/events/${event.id}/like`, { method: "POST" });
    } catch (_) {}
  }

  async function addSticker(event, text, color) {
    try {
      const res = await fetch(`${API_URL}/events/${event.id}/stickers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, color }),
      });
      const data = await res.json();
      if (data?.data) {
        setEvents((current) =>
          current.map((item) => {
            if (item.id === event.id) {
              const stickers = [data.data, ...(item.stickers || [])];
              return { ...item, stickers };
            }
            return item;
          })
        );
        setSelected((curr) => (curr?.id === event.id ? { ...curr, stickers: [data.data, ...(curr.stickers || [])] } : curr));
        setNotice(`Stiker "${text}" berhasil ditempel!`);
        window.setTimeout(() => setNotice(""), 3000);
      }
    } catch (_) {
      setNotice("Gagal menempelkan stiker.");
      window.setTimeout(() => setNotice(""), 2600);
    }
  }

  return (
    <main>
      <div className="top-tape">{content.topTape}</div>
      <nav className="nav-wrap">
        <a className="brand" href="#beranda" aria-label="Malang Fest beranda"><span>MF</span> MALANG<br/>FEST</a>
        <div className="nav-links"><a href="#mading">MADING</a><a href="#agenda">AGENDA</a><a href="#tentang">TENTANG</a></div>
        <a className="curator-button" href="/admin"><Icon name="pin" size={17} /> AREA KURATOR</a>
      </nav>

      <section id="beranda" className="hero section-shell">
        <div className="hero-copy">
          <span className="eyebrow sticker-label">{content.heroEyebrow}</span>
          <h1>{content.heroTitleLine1}<br/>{content.heroTitleLine2}<br/><i>{content.heroTitleItalic}</i></h1>
          <p className="hero-intro">{content.heroIntro}</p>
          <a className="button button-dark hero-cta" href="#mading">Jelajahi mading <Icon name="arrow" size={19}/></a>
        </div>
        <div className="hero-art" aria-label="Kolase seni Malang">
          <span className="sun">✳</span><span className="scribble">yang<br/>penting<br/>datang!</span>
          <div className="hero-photo"><img src={content.heroPhotoUrl} alt="Panggung seni kota Malang" /></div>
          <span className="rose">✹</span><span className="ticket-tear">TETAP<br/>GELISAH<br/>TETAP<br/>BERKARYA</span>
          <span className="hero-caption">EDISI #01<br/>2026</span>
        </div>
        <aside className="hero-side-note"><b>{content.heroSideDate}</b><span>{content.heroSideNote}</span></aside>
      </section>

      <section className="marquee" aria-label="Kategori acara">
        <div>
          {(content.marqueeItems || ["♫ KONSER", "✦ PAMERAN", "♧ PERTUNJUKAN", "◉ OPERA", "☄ TEATER"]).map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </section>

      <section id="mading" className="board-section">
        <div className="section-shell board-head">
          <div><span className="eyebrow">PAPAN PENGUMUMAN YANG TIDAK PERNAH DIAM</span><h2>Mading<br/><i>minggu ini</i></h2></div>
          <div className="board-note"><span>MAU POSTER-MU<br/>NONGKRONG DI SINI?</span><a href="/admin">KURATOR BUKA PINTU <Icon name="arrow" size={16}/></a></div>
        </div>
        <div className="filters section-shell" aria-label="Filter acara">
          <div className="category-filter">
            {activeCategories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={item === category ? "active" : ""}>
                {item}
              </button>
            ))}
          </div>
          <label className="search">
            <Icon name="search" size={18}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="cari panggung, nama, tempat..." aria-label="Cari acara" />
          </label>
        </div>
        <div className="mading-wall">
          <span className="wall-doodle one">✦</span><span className="wall-doodle two">☻</span><span className="wall-doodle three">!!!</span>
          <div className="poster-grid section-shell">
            {filteredEvents.map((event) => (
              <PosterCard key={event.id} event={event} onOpen={setSelected} onClap={clap} />
            ))}
            {!filteredEvents.length && <p className="empty-wall">Belum ada poster yang cocok. Coba kata kunci atau kategori lain.</p>}
          </div>
        </div>
      </section>

      <section id="agenda" className="agenda section-shell">
        <div className="agenda-heading"><span className="eyebrow">JANGAN CUMA DISIMPAN DI KEPALA</span><h2>Jadwal yang<br/><i>patut ditandai.</i></h2></div>
        <div className="agenda-list">
          {events.slice(0, 4).map((event, index) => (
            <button key={event.id} className="agenda-item" onClick={() => setSelected(event)}>
              <span className="agenda-num">0{index + 1}</span>
              <span className="agenda-date">{formatDate(event.date)}<small>{event.time}</small></span>
              <strong>{event.title}</strong>
              <span className="agenda-venue">{event.venue}</span>
              <Icon name="arrow" size={21}/>
            </button>
          ))}
        </div>
      </section>

      <section id="tentang" className="manifesto">
        <div className="section-shell manifesto-inner">
          <span className="manifesto-star">✳</span>
          <p>{content.manifestoText}</p>
          <span className="manifesto-asterisk">✱</span>
        </div>
      </section>

      <footer className="footer section-shell">
        <a className="brand footer-brand" href="#beranda"><span>MF</span> MALANG<br/>FEST</a>
        <p>{content.footerTagline}</p>
        <div>
          <a href="#mading">Lihat mading</a>
          <a href="#agenda">Agenda</a>
          <a href="#tentang">Tentang kami</a>
          <a href="/admin" style={{ color: "var(--pink)", fontWeight: 700 }}>Pintu Kurator (Admin)</a>
        </div>
        <small>© 2026 MALANG FEST. DIBUAT DI MALANG DENGAN BANYAK RIUH.</small>
      </footer>

      {notice && <div className="toast"><Icon name="spark" size={17}/>{notice}</div>}
      <EventModal event={selected} onClose={() => setSelected(null)} onClap={clap} onAddSticker={addSticker} />
      <CuratorStudio open={studioOpen} onClose={() => setStudioOpen(false)} />
    </main>
  );
}
