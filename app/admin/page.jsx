"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { extractYouTubeId } from "@/lib/audio";

const API_URL = "/api";
const TOKEN_KEY = "malangfest_admin_token";
const categories = ["Semua", "Musik & Konser", "Opera & Klasik", "Teater & Drama", "Tari & Budaya", "Pameran Seni & Rupa", "Seni Rupa"];
const statuses = ["DRAFT", "UPCOMING", "PUBLISHED", "ARCHIVED"];

const blankEvent = {
  title: "",
  category: "Musik & Konser",
  posterUrl: "",
  borderStyle: "washi-tape",
  pinRotation: 0,
  date: "",
  time: "",
  venue: "",
  venueAddress: "",
  priceType: "Gratis",
  price: "Gratis",
  ticketUrl: "",
  performer: "",
  curator: "",
  synopsis: "",
  highlight: "",
  status: "DRAFT",
};

const audioPresets = [
  {
    title: "Nocturne di Kayutangan (Akustik & Klasik Santai)",
    artist: "Malang Classical & Heritage Ensemble",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    youtubeId: "jfKfPfyJRdk",
    badge: "Indie Lofi & Santai",
  },
  {
    title: "Gamelan Slendro & Degung Malangan Ambient",
    artist: "Sanggar Karawitan Patih Gajayana",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    youtubeId: "5qap5aO4i9A",
    badge: "Tradisi & Spirit Suropati",
  },
  {
    title: "Simfoni Suropati: String Quartet & Harpsichord",
    artist: "Brawijaya Chamber Philharmonic",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=M44Uv9yY8jM",
    youtubeId: "M44Uv9yY8jM",
    badge: "Opera & Megah",
  },
  {
    title: "Malang Vintage Brass & Midnight Jazz",
    artist: "Amphitheater TKBJ Big Band",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=y7e-GC6oGhg",
    youtubeId: "y7e-GC6oGhg",
    badge: "Swing Jazz Ceria",
  },
];

function dateForInput(value) {
  try {
    return value ? new Date(value).toISOString().slice(0, 10) : "";
  } catch {
    return "";
  }
}

function Icon({ name, size = 18 }) {
  const icons = {
    grid: <><rect x="3.5" y="3.5" width="6.5" height="6.5"/><rect x="14" y="3.5" width="6.5" height="6.5"/><rect x="3.5" y="14" width="6.5" height="6.5"/><rect x="14" y="14" width="6.5" height="6.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    upload: <><path d="M12 16V3"/><path d="m7 8 5-5 5 5"/><path d="M5 14v5h14v-5"/></>,
    edit: <><path d="m4 20 4.2-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"/><path d="m13.8 7.5 3 3"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5"/></>,
    logout: <><path d="M10 5H5v14h5"/><path d="M14 8l4 4-4 4M18 12H9"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 4.5 4.5"/></>,
    check: <><path d="m5 12 4.2 4.2L19 6.5"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 18 5.7-5.7 3.6 3.4 2.2-2.2 4.5 4.5"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
    external: <><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    ruler: <><path d="M21.3 8.7 8.7 21.3a2 2 0 0 1-2.8 0L2.7 18.1a2 2 0 0 1 0-2.8L15.3 2.7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8Z"/><path d="m7.5 13.5 2 2"/><path d="m10.5 10.5 2 2"/><path d="m13.5 7.5 2 2"/></>,
    text: <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1.5"/></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    music: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3"/></>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name] || icons.check}</svg>;
}

function Status({ value }) {
  return <span className={"admin-status " + value.toLowerCase()}>{value === "UPCOMING" ? "TAYANG" : value}</span>;
}

function Login({ onLogin, error, busy }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  function submit(event) {
    event.preventDefault();
    onLogin(username, password);
  }

  return (
    <main className="admin-login">
      <a className="admin-login-brand" href="/"><span>MF</span> MALANG<br/>FEST</a>
      <section className="login-panel">
        <div className="login-copy">
          <span className="admin-eyebrow">RUANG KURATOR / TERKUNCI</span>
          <h1>Rawat<br/><i>madingmu.</i></h1>
          <p>Hanya kurator & pengelola berizin yang dapat menambah, merawat, dan mempublikasikan karya seni Malang Fest.</p>
          <div style={{ marginTop: "24px", background: "rgba(30,28,26,0.12)", padding: "14px", border: "1.5px solid var(--ink)" }}>
            <span style={{ font: "700 10px 'DM Mono'", display: "block", marginBottom: "4px" }}>🔑 KREDENSIAL BAWAAN ADMIN:</span>
            <code style={{ font: "700 12px 'DM Mono'", display: "block" }}>Username: admin</code>
            <code style={{ font: "700 12px 'DM Mono'", display: "block" }}>Password: admin123</code>
          </div>
          <div className="login-art"><b>✳</b><span>POSTER<br/>YANG BAIK<br/>MENCARI<br/>MATA.</span><em>2026</em></div>
        </div>
        <form className="login-form" onSubmit={submit}>
          <span className="admin-eyebrow">IDENTITAS ADMIN</span>
          <h2>Masuk ke<br/>ruang kerja.</h2>
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required placeholder="admin" />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required placeholder="admin123" />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button className="admin-primary login-submit" disabled={busy}>
            {busy ? "MEMERIKSA..." : <>MASUK KE DASBOR <Icon name="arrow" size={17}/></>}
          </button>
          <button
            type="button"
            onClick={() => onLogin("admin", "admin123")}
            style={{ marginTop: "10px", background: "var(--acid)", border: "1.5px solid var(--ink)", padding: "10px", font: "700 10px 'DM Mono'", cursor: "pointer" }}
          >
            ⚡ Masuk Cepat dengan Akun Bawaan (admin / admin123)
          </button>
          <a href="/" className="back-to-mading">← kembali ke mading publik</a>
        </form>
      </section>
    </main>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(null);
  const [events, setEvents] = useState([]);
  const [borders, setBorders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState("posters"); // "posters" | "guide" | "content" | "stickers" | "supabase"
  const [siteContent, setSiteContent] = useState(null);
  const [allStickers, setAllStickers] = useState([]);
  const [supabaseStatus, setSupabaseStatus] = useState(null);
  const [checkingSupabase, setCheckingSupabase] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewIframeRef = useRef(null);

  // Poster Form State
  const [form, setForm] = useState(blankEvent);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Sticker Curator Form
  const [curatorStickerEventId, setCuratorStickerEventId] = useState("");
  const [curatorStickerText, setCuratorStickerText] = useState("");
  const [curatorStickerColor, setCuratorStickerColor] = useState("#FFE600");

  // Guide Interactive Preview State
  const [guideImage, setGuideImage] = useState("https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1000&auto=format&fit=crop");
  const [guideFrame, setGuideFrame] = useState("baroque-gold");
  const [guideTilt, setGuideTilt] = useState(-2);
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState(true);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function request(path, activeToken, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (activeToken) headers.Authorization = "Bearer " + activeToken;
    if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    const response = await fetch(API_URL + path, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || "Permintaan tidak berhasil.");
    return payload;
  }

  async function loadWorkspace(activeToken) {
    const [me, eventsData, bordersData, dashboardData, contentData, stickersData] = await Promise.all([
      request("/admin/me", activeToken),
      request("/admin/events", activeToken),
      request("/borders", activeToken),
      request("/admin/dashboard", activeToken),
      request("/admin/content", activeToken),
      request("/admin/stickers", activeToken),
    ]);
    setAdmin(me.data);
    setEvents(eventsData.data);
    setBorders(bordersData.data);
    setDashboard(dashboardData.data);
    setSiteContent(contentData.data);
    setAllStickers(stickersData.data || []);
    request("/admin/supabase-status", activeToken)
      .then((res) => setSupabaseStatus(res.data))
      .catch(() => {});
  }

  async function checkSupabaseStatus(activeToken = token) {
    setCheckingSupabase(true);
    try {
      const res = await request("/admin/supabase-status", activeToken);
      setSupabaseStatus(res.data);
      if (res.data?.connected) {
        notify("Supabase PostgreSQL terhubung!");
      }
    } catch (err) {
      setSupabaseStatus({ connected: false, configured: false, message: err.message });
    } finally {
      setCheckingSupabase(false);
    }
  }

  useEffect(() => {
    const storedToken = window.sessionStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    loadWorkspace(storedToken)
      .catch(() => {
        window.sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setError("Sesi berakhir. Silakan masuk kembali.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    setBusy(true);
    setError("");
    try {
      const response = await request("/admin/login", "", { method: "POST", body: JSON.stringify({ username, password }) });
      window.sessionStorage.setItem(TOKEN_KEY, response.data.token);
      setToken(response.data.token);
      await loadWorkspace(response.data.token);
      notify("Selamat datang kembali di ruang kerja Malang Fest!");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }

  function logout() {
    window.sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAdmin(null);
    setEvents([]);
    setDashboard(null);
    setForm(blankEvent);
    setEditingId(null);
  }

  function notify(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function updateForm(field, nextValue) {
    setForm((current) => ({ ...current, [field]: nextValue }));
  }

  function createNew() {
    setEditingId(null);
    setForm(blankEvent);
    setActiveTab("posters");
    document.getElementById("poster-composer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function editEvent(event) {
    setEditingId(event.id);
    setForm({
      ...blankEvent,
      ...event,
      date: dateForInput(event.date),
      ticketUrl: event.ticketUrl || "",
      curator: event.curator || "",
      highlight: event.highlight || "",
    });
    setActiveTab("posters");
    document.getElementById("poster-composer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveEvent(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const endpoint = editingId ? "/admin/events/" + editingId : "/admin/events";
      const response = await request(endpoint, token, { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) });
      const saved = response.data;
      setEvents((current) => editingId ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved].sort((a, b) => new Date(a.date) - new Date(b.date)));
      setEditingId(null);
      setForm(blankEvent);
      notify(response.message);
      const nextDashboard = await request("/admin/dashboard", token);
      setDashboard(nextDashboard.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeEvent(event) {
    if (!window.confirm('Copot poster "' + event.title + '" dari mading? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      const response = await request("/admin/events/" + event.id, token, { method: "DELETE" });
      setEvents((current) => current.filter((item) => item.id !== event.id));
      if (editingId === event.id) createNew();
      notify(response.message);
      const nextDashboard = await request("/admin/dashboard", token);
      setDashboard(nextDashboard.data);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function quickChangeStatus(event, newStatus) {
    try {
      const res = await request(`/admin/events/${event.id}/status`, token, {
        method: "POST",
        body: JSON.stringify({ status: newStatus }),
      });
      setEvents((current) => current.map((item) => (item.id === event.id ? res.data : item)));
      notify(res.message);
      const nextDashboard = await request("/admin/dashboard", token);
      setDashboard(nextDashboard.data);
    } catch (err) {
      notify(err.message);
    }
  }

  async function duplicateEvent(event) {
    try {
      const res = await request(`/admin/events/${event.id}/duplicate`, token, { method: "POST" });
      setEvents((current) => [res.data, ...current]);
      notify(res.message);
      const nextDashboard = await request("/admin/dashboard", token);
      setDashboard(nextDashboard.data);
    } catch (err) {
      notify(err.message);
    }
  }

  async function uploadPoster(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran poster maksimal 5 MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("poster", file);
      const response = await request("/admin/uploads/poster", token, { method: "POST", body: data });
      updateForm("posterUrl", response.data.url);
      setGuideImage(response.data.url);
      notify("Poster berhasil diunggah. Tinjau bingkai dan rasio 4:5, lalu simpan.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  // Site Content CMS Save
  async function saveSiteContent(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await request("/admin/content", token, {
        method: "PUT",
        body: JSON.stringify(siteContent),
      });
      setSiteContent(res.data);
      notify("Konten website Malang Fest berhasil diperbarui secara live!");
    } catch (err) {
      notify("Gagal memperbarui konten: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetSiteContent() {
    if (!window.confirm("Kembalikan seluruh teks mading Malang Fest ke pengaturan awal?")) return;
    setBusy(true);
    try {
      const res = await request("/admin/content/reset", token, { method: "POST" });
      setSiteContent(res.data);
      notify("Konten website dikembalikan ke bawaan.");
    } catch (err) {
      notify(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Audio Backsound Management
  function updateAudioField(field, value) {
    setSiteContent((curr) => {
      const currentAudio = curr?.audioTrack || {
        enabled: true,
        title: "Nocturne di Kayutangan",
        artist: "Malang Classical Ensemble",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        youtubeId: "jfKfPfyJRdk",
        autoplay: true,
        volume: 50,
      };
      return {
        ...curr,
        audioTrack: {
          ...currentAudio,
          [field]: value,
        },
      };
    });
  }

  function updateAudioFields(fields) {
    setSiteContent((curr) => {
      const currentAudio = curr?.audioTrack || {
        enabled: true,
        title: "Nocturne di Kayutangan",
        artist: "Malang Classical Ensemble",
        type: "youtube",
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        youtubeId: "jfKfPfyJRdk",
        autoplay: true,
        volume: 50,
      };
      return {
        ...curr,
        audioTrack: {
          ...currentAudio,
          ...fields,
        },
      };
    });
  }

  async function saveAudioDirectly(customTrack) {
    const payload = customTrack || siteContent?.audioTrack || {
      enabled: true,
      title: "Nocturne di Kayutangan",
      artist: "Malang Classical Ensemble",
      type: "youtube",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      youtubeId: "jfKfPfyJRdk",
      autoplay: true,
      volume: 50,
    };

    setBusy(true);
    try {
      const res = await request("/admin/audio", token, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSiteContent((curr) => ({
        ...curr,
        audioTrack: res.data,
      }));
      notify(res.message || "Pengaturan lagu berhasil disimpan!");
    } catch (err) {
      notify("Gagal menyimpan lagu: " + err.message);
    } finally {
      setBusy(false);
    }
  }

  async function applyAndSavePreset(preset) {
    const newTrack = {
      ...(siteContent?.audioTrack || {}),
      title: preset.title,
      artist: preset.artist,
      type: preset.type,
      url: preset.url,
      youtubeId: preset.youtubeId,
      enabled: true,
    };
    updateAudioFields(newTrack);
    await saveAudioDirectly(newTrack);
  }

  function applyAudioPreset(preset) {
    applyAndSavePreset(preset);
  }

  function toggleAdminAudioPreview() {
    setPreviewPlaying((prev) => !prev);
  }

  // Sticker Moderation
  async function removeSticker(stickerId) {
    if (!window.confirm("Hapus / moderasi stiker ini dari poster?")) return;
    try {
      const res = await request(`/admin/stickers/${stickerId}`, token, { method: "DELETE" });
      setAllStickers((curr) => curr.filter((st) => st.id !== stickerId));
      notify(res.message);
      // reload events
      const eventsData = await request("/admin/events", token);
      setEvents(eventsData.data);
    } catch (err) {
      notify(err.message);
    }
  }

  async function addCuratorSticker(e) {
    e.preventDefault();
    if (!curatorStickerEventId || !curatorStickerText.trim()) return;
    try {
      const res = await request("/admin/stickers", token, {
        method: "POST",
        body: JSON.stringify({
          eventId: curatorStickerEventId,
          text: curatorStickerText.trim(),
          color: curatorStickerColor,
        }),
      });
      setCuratorStickerText("");
      notify(res.message);
      const [stickersData, eventsData] = await Promise.all([
        request("/admin/stickers", token),
        request("/admin/events", token),
      ]);
      setAllStickers(stickersData.data || []);
      setEvents(eventsData.data);
    } catch (err) {
      notify(err.message);
    }
  }

  const visibleEvents = useMemo(() => events.filter((event) => {
    const matchesSearch = (event.title + " " + event.venue + " " + event.performer).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || event.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  }), [events, search, statusFilter, categoryFilter]);

  if (loading) return <main className="admin-loading">Memuat ruang kurator Malang Fest…</main>;
  if (!token || !admin) return <Login onLogin={login} error={error} busy={busy} />;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-side-brand" href="/"><span>MF</span><b>MALANG<br/>FEST</b></a>
        <div className="admin-side-title">RUANG<br/><i>KURATOR</i></div>
        <nav>
          <button className={activeTab === "posters" ? "active" : ""} onClick={() => setActiveTab("posters")} type="button">
            <Icon name="grid"/> Kelola Poster ({events.length})
          </button>
          <button className={activeTab === "guide" ? "active" : ""} onClick={() => setActiveTab("guide")} type="button">
            <Icon name="ruler"/> Panduan Ukuran & Bingkai
          </button>
          <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")} type="button">
            <Icon name="text"/> Kelola Konten Web (CMS)
          </button>
          <button className={activeTab === "audio" ? "active" : ""} onClick={() => setActiveTab("audio")} type="button">
            <Icon name="music"/> Backsound Musik ({siteContent?.audioTrack?.enabled !== false ? "Aktif" : "Mati"})
          </button>
          <button className={activeTab === "stickers" ? "active" : ""} onClick={() => setActiveTab("stickers")} type="button">
            <Icon name="tag"/> Moderasi Stiker ({allStickers.length})
          </button>
          <button className={activeTab === "supabase" ? "active" : ""} onClick={() => setActiveTab("supabase")} type="button">
            <Icon name="database"/> Supabase & Upstash
          </button>
        </nav>
        <div className="admin-account">
          <div className="admin-account-info">
            <div className="admin-account-avatar">
              {admin.displayName ? admin.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-account-details">
              <span>{admin.displayName}</span>
              <small>@{admin.username} · KURATOR</small>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout} type="button" title="Keluar dari sesi admin">
            <Icon name="logout" size={15}/> Keluar dari Dasbor
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">DASBOR KURATOR · KOTA MALANG</span>
            <h1>Halo, <i>{admin.displayName.split(" ")[0]}.</i></h1>
          </div>
          <div className="admin-header-actions">
            <a className="admin-view-public" href="/" target="_blank">Lihat mading publik <Icon name="external" size={15}/></a>
            <button className="admin-primary" onClick={createNew}><Icon name="plus"/> TAMBAH POSTER</button>
          </div>
        </header>

        {/* Quick Nav Tabs */}
        <div className="admin-nav-tabs">
          <button className={`admin-tab-btn ${activeTab === "posters" ? "active" : ""}`} onClick={() => setActiveTab("posters")}>
            <Icon name="grid" size={15}/> Koleksi Poster & CRUD
          </button>
          <button className={`admin-tab-btn ${activeTab === "guide" ? "active" : ""}`} onClick={() => setActiveTab("guide")}>
            <Icon name="ruler" size={15}/> Panduan Ukuran & Safe Zone (Wajib)
          </button>
          <button className={`admin-tab-btn ${activeTab === "content" ? "active" : ""}`} onClick={() => setActiveTab("content")}>
            <Icon name="text" size={15}/> Kelola Konten Mading (CMS)
          </button>
          <button className={`admin-tab-btn ${activeTab === "audio" ? "active" : ""}`} onClick={() => setActiveTab("audio")}>
            <Icon name="music" size={15}/> Backsound Lagu Mading
          </button>
          <button className={`admin-tab-btn ${activeTab === "stickers" ? "active" : ""}`} onClick={() => setActiveTab("stickers")}>
            <Icon name="tag" size={15}/> Stiker & Apresiasi ({allStickers.length})
          </button>
          <button className={`admin-tab-btn ${activeTab === "supabase" ? "active" : ""}`} onClick={() => setActiveTab("supabase")}>
            <Icon name="database" size={15}/> Supabase & Upstash Vercel
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <section className="admin-stats">
          <article>
            <span>TOTAL POSTER</span>
            <strong>{dashboard?.totalEvents || events.length}</strong>
            <small>{dashboard?.categoryCount || 5} ragam kategori acara</small>
          </article>
          <article>
            <span>POSTER TAYANG</span>
            <strong>{events.filter((e) => ["UPCOMING", "PUBLISHED"].includes(e.status)).length}</strong>
            <small>tampil di mading publik</small>
          </article>
          <article>
            <span>MASIH DRAF</span>
            <strong>{events.filter((e) => e.status === "DRAFT").length}</strong>
            <small>sedang disiapkan kurator</small>
          </article>
          <article>
            <span>TOTAL APRESIASI</span>
            <strong>{events.reduce((a, c) => a + (c.likesCount || 0), 0)}</strong>
            <small>tepuk tangan dari warga Malang</small>
          </article>
        </section>

        {/* TAB 1: POSTERS & COMPOSER */}
        {activeTab === "posters" && (
          <section id="poster-list" className="admin-workspace">
            <div className="admin-list-panel">
              <div className="admin-section-heading">
                <div>
                  <span className="admin-eyebrow">KOLEKSI MADING</span>
                  <h2>Katalog poster<br/><i>kegiatan Malang.</i></h2>
                </div>
                <button className="admin-plain-button" onClick={createNew}><Icon name="plus"/> Buat Baru</button>
              </div>

              <div className="admin-list-controls">
                <label className="admin-search">
                  <Icon name="search" size={17}/>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="cari judul, tempat, penampil..." />
                </label>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="ALL">Semua status</option>
                  {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="ALL">Semua kategori</option>
                  {categories.filter((c) => c !== "Semua").map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="admin-event-list">
                {visibleEvents.map((event) => (
                  <article className="admin-event-row" key={event.id} style={{ display: "grid", gridTemplateColumns: "51px minmax(130px, 1fr) 100px 90px", gap: "10px" }}>
                    <img src={event.posterUrl} alt="" />
                    <div className="admin-event-main">
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <Status value={event.status}/>
                        <span style={{ font: "700 8px 'DM Mono'", background: "#f0ece1", padding: "2px 5px", border: "1px solid var(--ink)" }}>{event.category}</span>
                      </div>
                      <strong>{event.title}</strong>
                      <span>{new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(event.date))} · {event.venue}</span>
                    </div>

                    {/* Quick Status Dropdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", justifyContent: "center" }}>
                      <select
                        value={event.status}
                        onChange={(e) => quickChangeStatus(event, e.target.value)}
                        style={{ font: "700 8px 'DM Mono'", padding: "4px 2px", border: "1px solid var(--ink)", background: "var(--paper)" }}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <span className="admin-frame-tag">
                        {borders.find((border) => border.id === event.borderStyle)?.badge || event.borderStyle}
                      </span>
                    </div>

                    <div className="admin-row-actions" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      <button onClick={() => editEvent(event)} title="Edit poster"><Icon name="edit" size={15}/></button>
                      <button onClick={() => duplicateEvent(event)} style={{ background: "var(--yellow)" }} title="Duplikasi poster"><Icon name="copy" size={15}/></button>
                      <button onClick={() => removeEvent(event)} title="Hapus poster"><Icon name="trash" size={15}/></button>
                    </div>
                  </article>
                ))}
                {!visibleEvents.length && <p className="admin-empty">Tidak ada poster yang cocok dengan pencarian / filter.</p>}
              </div>
            </div>

            {/* Poster Composer Form */}
            <form id="poster-composer" className="poster-composer" onSubmit={saveEvent}>
              <div className="composer-heading">
                <div>
                  <span className="admin-eyebrow">{editingId ? `MENYUNTING POSTER #${editingId}` : "POSTER BARU"}</span>
                  <h2>{editingId ? "Rapikan karya." : "Tempel karya."}</h2>
                </div>
                {editingId && (
                  <button type="button" className="composer-close" onClick={createNew} title="Batal sunting">
                    <Icon name="x" size={17}/>
                  </button>
                )}
              </div>

              {error && <p className="admin-error">{error}</p>}

              {/* Upload Poster Visual */}
              <section className="composer-poster">
                <div className="poster-upload-preview" style={{ position: "relative" }}>
                  {form.posterUrl ? (
                    <img src={form.posterUrl} alt="Pratinjau poster" style={{ transform: `rotate(${form.pinRotation || 0}deg)`, transition: "transform 0.2s" }} />
                  ) : (
                    <span><Icon name="image" size={28}/>Poster<br/>4 : 5</span>
                  )}
                </div>
                <div className="poster-upload-copy">
                  <b>Materi visual poster</b>
                  <small>JPG, PNG, WebP · maks. 5 MB · Rasio 4:5</small>
                  <label className="upload-button">
                    <Icon name="upload" size={16}/>
                    {uploading ? "MENGUNGGAH..." : "UNGGAH BERKAS POSTER"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPoster} disabled={uploading}/>
                  </label>
                  <input
                    value={form.posterUrl}
                    onChange={(event) => updateForm("posterUrl", event.target.value)}
                    placeholder="atau tempel tautan URL poster (https://...)"
                    required
                  />
                </div>
              </section>

              {/* Safe zone indicator reminder */}
              <div className="poster-size-guide">
                <span>STANDAR</span>
                <b>4 : 5</b>
                <p>Rekomendasi 1080 × 1350 px. Sisakan ruang aman 80 px di setiap sisi agar tidak terpotong bingkai mading.</p>
              </div>

              {/* Form Fields */}
              <fieldset>
                <legend>Identitas pertunjukan</legend>
                <label className="field-full">
                  Judul pertunjukan
                  <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required placeholder="Contoh: Simfoni di Kayutangan" />
                </label>
                <div className="field-grid">
                  <label>
                    Kategori
                    <select value={form.category} onChange={(event) => updateForm("category", event.target.value)}>
                      {categories.filter((c) => c !== "Semua").map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </label>
                  <label>
                    Status poster
                    <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                </div>
                <label className="field-full">
                  Penampil / Kolektif / Seniman
                  <input value={form.performer} onChange={(event) => updateForm("performer", event.target.value)} required placeholder="Nama musisi, teater, atau kelompok seniman" />
                </label>
              </fieldset>

              <fieldset>
                <legend>Waktu & tempat acara</legend>
                <div className="field-grid">
                  <label>
                    Tanggal
                    <input type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} required />
                  </label>
                  <label>
                    Jam pelaksanaan
                    <input value={form.time} onChange={(event) => updateForm("time", event.target.value)} required placeholder="19.00 - 22.00 WIB" />
                  </label>
                </div>
                <label className="field-full">
                  Nama venue
                  <input value={form.venue} onChange={(event) => updateForm("venue", event.target.value)} required placeholder="Gedung Kesenian Gajayana, DKM, dll." />
                </label>
                <label className="field-full">
                  Alamat venue
                  <input value={form.venueAddress} onChange={(event) => updateForm("venueAddress", event.target.value)} placeholder="Jl. Nusakambangan No.19, Klojen, Kota Malang" />
                </label>
              </fieldset>

              <fieldset>
                <legend>Pilihan bingkai mading & rotasi pin</legend>
                <div className="frame-select-grid">
                  {borders.map((border) => (
                    <button
                      type="button"
                      key={border.id}
                      onClick={() => updateForm("borderStyle", border.id)}
                      className={"frame-select " + (form.borderStyle === border.id ? "selected " : "") + "frame-" + border.id}
                    >
                      <span />
                      <b>{border.badge}</b>
                    </button>
                  ))}
                </div>
                <label style={{ marginTop: "12px" }}>
                  Kemiringan Pin Paku Payung ({form.pinRotation || 0}°):
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    value={form.pinRotation || 0}
                    onChange={(e) => updateForm("pinRotation", Number(e.target.value))}
                    style={{ padding: "4px 0", cursor: "pointer" }}
                  />
                </label>
              </fieldset>

              <fieldset>
                <legend>Akses & tiket</legend>
                <div className="field-grid">
                  <label>
                    Tipe harga
                    <select value={form.priceType} onChange={(event) => updateForm("priceType", event.target.value)}>
                      <option>Gratis</option>
                      <option>Berbayar</option>
                      <option>Donasi Sukarela</option>
                    </select>
                  </label>
                  <label>
                    Nominal / keterangan harga
                    <input value={form.price} onChange={(event) => updateForm("price", event.target.value)} placeholder="Rp 50.000 / Gratis" />
                  </label>
                </div>
                <label className="field-full">
                  Tautan pembelian tiket (opsional)
                  <input type="url" value={form.ticketUrl} onChange={(event) => updateForm("ticketUrl", event.target.value)} placeholder="https://tiket.malangfest.id/..." />
                </label>
              </fieldset>

              <fieldset>
                <legend>Deskripsi & kurasi</legend>
                <label className="field-full">
                  Sinopsis pertunjukan
                  <textarea value={form.synopsis} onChange={(event) => updateForm("synopsis", event.target.value)} required placeholder="Ceritakan riwayat, keunikan, dan alasan orang harus menonton..." />
                </label>
                <div className="field-grid">
                  <label>
                    Nama kurator (opsional)
                    <input value={form.curator} onChange={(event) => updateForm("curator", event.target.value)} placeholder="Contoh: Tri Handoyo" />
                  </label>
                  <label>
                    Sorotan / highlight (opsional)
                    <input value={form.highlight} onChange={(event) => updateForm("highlight", event.target.value)} placeholder="★ Warisan Budaya UNESCO" />
                  </label>
                </div>
              </fieldset>

              <button className="admin-primary composer-save" disabled={busy}>
                {busy ? "MENYIMPAN..." : <>{editingId ? "SIMPAN PERUBAHAN POSTER" : "TEMPEL KE MADING SEKARANG"} <Icon name="check" size={17}/></>}
              </button>
            </form>
          </section>
        )}

        {/* TAB 2: POSTER SIZE GUIDE & VISUAL SAFE ZONE */}
        {activeTab === "guide" && (
          <section className="admin-panel-card">
            <span className="admin-eyebrow">STANDARISASI KURATOR · MALANG FEST</span>
            <h3>Panduan Ukuran Poster & Zona Aman (Safe Zone)</h3>
            <p style={{ font: "500 13px 'DM Mono'", lineHeight: 1.5, maxWidth: "780px", marginBottom: "26px" }}>
              Semua poster yang ditempel di mading seni Malang Fest wajib mematuhi panduan rasio dan zona aman agar teks, nama penampil, dan tanggal acara tidak tertutup oleh dekorasi bingkai (seperti lakban washi tape, gerigi perangko, ornamen ukir barok, atau sobekan karcis).
            </p>

            <div className="poster-guide-grid">
              {/* Left: Interactive Canvas */}
              <div className="safe-zone-preview-wrap">
                <div style={{ marginBottom: "12px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--yellow)", font: "700 10px 'DM Mono'" }}>SIMULATOR BINGKAI & SAFE ZONE</span>
                  <button
                    type="button"
                    onClick={() => setShowSafeZoneOverlay(!showSafeZoneOverlay)}
                    style={{ background: showSafeZoneOverlay ? "var(--pink)" : "var(--paper)", border: "1px solid white", color: showSafeZoneOverlay ? "white" : "black", padding: "3px 8px", font: "700 8px 'DM Mono'" }}
                  >
                    {showSafeZoneOverlay ? "SEMBUNYIKAN OVERLAY" : "TAMPILKAN OVERLAY"}
                  </button>
                </div>

                <div
                  className={`safe-zone-canvas frame-${guideFrame}`}
                  style={{ transform: `rotate(${guideTilt}deg)`, transition: "transform 0.2s" }}
                >
                  <img src={guideImage} alt="Simulasi poster" />
                  {showSafeZoneOverlay && (
                    <div className="safe-zone-overlay">
                      <div className="safe-zone-tag">SAFE ZONE (AREA AMAN TEKS)</div>
                      <div style={{ font: "700 8px 'DM Mono'", color: "#fb4e7b", textAlign: "center", background: "rgba(255,255,255,0.85)", padding: "4px" }}>
                        Tempatkan Judul, Tanggal & Penampil di dalam kotak merah ini!
                      </div>
                      <div className="safe-zone-tag" style={{ alignSelf: "flex-end" }}>80PX MARGIN</div>
                    </div>
                  )}
                </div>

                {/* Controls for interactive test */}
                <div style={{ marginTop: "20px", width: "100%", background: "#2a2724", padding: "14px", border: "1px solid #4a453e" }}>
                  <label style={{ display: "block", color: "var(--paper)", font: "700 9px 'DM Mono'", marginBottom: "8px" }}>
                    Uji Bingkai Mading:
                    <select
                      value={guideFrame}
                      onChange={(e) => setGuideFrame(e.target.value)}
                      style={{ marginTop: "4px", width: "100%", background: "#1e1c1a", color: "white", border: "1px solid var(--yellow)", padding: "6px", font: "600 10px 'DM Mono'" }}
                    >
                      {borders.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.badge})</option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: "block", color: "var(--paper)", font: "700 9px 'DM Mono'", marginTop: "10px" }}>
                    Uji Kemiringan Pin ({guideTilt}°):
                    <input
                      type="range"
                      min={-10}
                      max={10}
                      value={guideTilt}
                      onChange={(e) => setGuideTilt(Number(e.target.value))}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </label>
                </div>
              </div>

              {/* Right: Technical Specs Checklist */}
              <div>
                <div className="guide-spec-box">
                  <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 14px", letterSpacing: "-0.03em" }}>📐 SPESIFIKASI BERKAS POSTER</h4>
                  <div className="guide-spec-item"><span>Rasio Aspek Resmi</span><b>4 : 5 (Vertikal / Portrait)</b></div>
                  <div className="guide-spec-item"><span>Resolusi Layar (Digital)</span><b>1080 × 1350 piksel</b></div>
                  <div className="guide-spec-item"><span>Resolusi Siap Cetak (A3/A2)</span><b>2160 × 2700 piksel (300 DPI)</b></div>
                  <div className="guide-spec-item"><span>Zona Aman (Safe Zone Margin)</span><b>Minimal 80 px dari setiap tepi luar</b></div>
                  <div className="guide-spec-item"><span>Format Berkas Didukung</span><b>JPG, PNG, WebP (RGB)</b></div>
                  <div className="guide-spec-item"><span>Batas Maksimum Ukuran</span><b>5 MB per berkas</b></div>
                </div>

                <div className="guide-spec-box" style={{ marginTop: "16px", background: "#f5fbf7" }}>
                  <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 14px", letterSpacing: "-0.03em" }}>💡 TIPS DESAIN KURASI MALANG FEST</h4>
                  <ul style={{ paddingLeft: "18px", margin: 0, font: "500 11px/1.6 'DM Mono'" }}>
                    <li><b>Hierarki Tipografi:</b> Judul konser/acara harus dapat dibaca dari jarak pandang mading murni tanpa perlu di-zoom.</li>
                    <li><b>Warna Kontras:</b> Hindari teks abu-abu di atas foto gelap. Gunakan warna kontras tinggi khas neobrutalism seperti kuning lemon, merah jambu punk, atau putih pekat.</li>
                    <li><b>Unsur Budaya:</b> Tambahkan sentuhan visual lokal Malang (aksara kawi, corak topeng kedungmonggo, garis arsitektur kolonial Ijen, atau nuansa apel/bromo).</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: CMS WEB CONTENT MANAGEMENT */}
        {activeTab === "content" && siteContent && (
          <section className="admin-panel-card">
            <span className="admin-eyebrow">PENGELOLA KONTEN (CMS) · MALANG FEST</span>
            <h3>Sunting Teks & Pengumuman Mading Publik</h3>
            <p style={{ font: "500 12px 'DM Mono'", marginBottom: "22px", color: "#544e45" }}>
              Perubahan di sini langsung tersimpan dan aktif di beranda pengunjung (Running tape, Hero headline, Manifesto, dan Kategori).
            </p>

            <form onSubmit={saveSiteContent}>
              <div className="cms-group">
                <label>PITA PENGUMUMAN BERJALAN (TOP TAPE):</label>
                <input
                  value={siteContent.topTape || ""}
                  onChange={(e) => setSiteContent({ ...siteContent, topTape: e.target.value })}
                  required
                />
              </div>

              <div className="cms-grid">
                <div className="cms-group">
                  <label>EYEBROW HEADER:</label>
                  <input
                    value={siteContent.heroEyebrow || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroEyebrow: e.target.value })}
                    required
                  />
                </div>
                <div className="cms-group">
                  <label>SIDE NOTE HERO:</label>
                  <input
                    value={siteContent.heroSideNote || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroSideNote: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="cms-grid">
                <div className="cms-group">
                  <label>JUDUL HERO BARIS 1:</label>
                  <input
                    value={siteContent.heroTitleLine1 || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroTitleLine1: e.target.value })}
                    required
                  />
                </div>
                <div className="cms-group">
                  <label>JUDUL HERO BARIS 2:</label>
                  <input
                    value={siteContent.heroTitleLine2 || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroTitleLine2: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="cms-grid">
                <div className="cms-group">
                  <label>JUDUL HERO KATA MIRING (ITALIC):</label>
                  <input
                    value={siteContent.heroTitleItalic || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroTitleItalic: e.target.value })}
                    required
                  />
                </div>
                <div className="cms-group">
                  <label>FOTO UTAMA HERO (URL):</label>
                  <input
                    value={siteContent.heroPhotoUrl || ""}
                    onChange={(e) => setSiteContent({ ...siteContent, heroPhotoUrl: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="cms-group">
                <label>PARAGRAF INTRODUKSI HERO:</label>
                <textarea
                  value={siteContent.heroIntro || ""}
                  onChange={(e) => setSiteContent({ ...siteContent, heroIntro: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="cms-group">
                <label>TEKS MANIFESTO KOTA:</label>
                <textarea
                  value={siteContent.manifestoText || ""}
                  onChange={(e) => setSiteContent({ ...siteContent, manifestoText: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="cms-group">
                <label>TAGLINE FOOTER:</label>
                <input
                  value={siteContent.footerTagline || ""}
                  onChange={(e) => setSiteContent({ ...siteContent, footerTagline: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="submit" className="admin-primary" disabled={busy}>
                  <Icon name="check" size={16}/> SIMPAN SEMUA PERUBAHAN KONTEN
                </button>
                <button type="button" onClick={resetSiteContent} className="admin-plain-button" style={{ background: "#ffced9" }}>
                  RESET KE STANDAR BAWAAN
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB: BACKSOUND / RADIO MADING */}
        {activeTab === "audio" && siteContent && (
          <section className="admin-panel-card">
            <span className="admin-eyebrow">ATMOSFER & BUNYI MADING · MALANG FEST</span>
            <h3>Pengaturan Musik & Backsound Website</h3>
            <p style={{ font: "500 12px 'DM Mono'", marginBottom: "22px", color: "#544e45" }}>
              Tentukan lagu latar yang menemani pengunjung saat menjelajahi poster seni dan konser. Dukungan tautan YouTube maupun link audio langsung (.mp3). Perubahan langsung tersimpan ke cloud dan aktif di web publik.
            </p>

            {/* LIVE PREVIEW & PLAYER STATUS */}
            <div style={{
              background: "#FFFDF8",
              border: "2px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              padding: "20px",
              marginBottom: "28px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: siteContent.audioTrack?.enabled !== false ? "#00D664" : "#FF4365",
                    border: "1.5px solid var(--ink)"
                  }} />
                  <b style={{ font: "800 15px 'Syne'" }}>
                    STATUS RADIO: {siteContent.audioTrack?.enabled !== false ? "AKTIF (BERBUNYI DI WEB PUBLIK)" : "NONAKTIF (SENYAP)"}
                  </b>
                </div>

                <button
                  type="button"
                  onClick={toggleAdminAudioPreview}
                  style={{
                    background: previewPlaying ? "#FF4365" : "#FFE600",
                    color: previewPlaying ? "#FFF" : "var(--ink)",
                    border: "2px solid var(--ink)",
                    boxShadow: "2px 2px 0 var(--ink)",
                    font: "800 11px 'Syne'",
                    padding: "8px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Icon name={previewPlaying ? "pause" : "play"} size={14}/>
                  {previewPlaying ? "JEDA TES AUDIO" : "▶ TES DENGARKAN DI SINI"}
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#F4EFE6", padding: "12px 16px", border: "1.5px solid var(--ink)" }}>
                <span style={{ fontSize: "28px", animation: previewPlaying ? "mfVinylSpin 3s linear infinite" : "none", display: "inline-block" }}>
                  💿
                </span>
                <div>
                  <b style={{ font: "800 13px 'Syne'", display: "block" }}>
                    {siteContent.audioTrack?.title || "Belum ada judul"}
                  </b>
                  <span style={{ font: "500 11px 'DM Mono'", color: "#665f57" }}>
                    Artis: {siteContent.audioTrack?.artist || "Tidak ditentukan"} · Tipe: {siteContent.audioTrack?.type === "audio_url" ? "File Audio Langsung" : "Streaming YouTube"}
                  </span>
                </div>
              </div>

              {/* Live Preview Embed */}
              {previewPlaying && (
                <div style={{ marginTop: "14px", border: "2px solid var(--ink)", background: "#1E1C1A", padding: "10px" }}>
                  <span style={{ font: "700 10px 'DM Mono'", color: "#FFE600", display: "block", marginBottom: "8px" }}>
                    ♫ PEMUTAR UJI AUDIO (YOUTUBE / STREAM):
                  </span>
                  <iframe
                    ref={previewIframeRef}
                    width="100%"
                    height="160"
                    src={`https://www.youtube.com/embed/${extractYouTubeId(siteContent.audioTrack?.youtubeId || siteContent.audioTrack?.url || "jfKfPfyJRdk")}?autoplay=1&controls=1`}
                    title="Pratinjau Backsound YouTube"
                    allow="autoplay; encrypted-media"
                    style={{ border: "none" }}
                  />
                </div>
              )}
            </div>

            {/* PRESET LAGU CEPAT */}
            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px", marginBottom: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <span className="admin-eyebrow" style={{ color: "var(--pink)" }}>PILIHAN CEPAT (KLIK 1 KALI LANGSUNG AKTIF)</span>
                  <h4 style={{ font: "800 15px 'Syne'", margin: "4px 0 0" }}>Pilihan Lagu Nuansa Kota Malang & Mading Seni:</h4>
                </div>
                <small style={{ font: "700 10px 'DM Mono'", color: "#008a3e" }}>
                  ⚡ Klik tombol "Pasang Lagu Ini" langsung tersimpan otomatis & tayang di web!
                </small>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                {audioPresets.map((preset, idx) => {
                  const isCurrent = siteContent.audioTrack?.youtubeId === preset.youtubeId;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: isCurrent ? "#FFFFED" : "white",
                        border: isCurrent ? "2.5px solid #00D664" : "1.5px solid var(--ink)",
                        boxShadow: isCurrent ? "3px 3px 0 #00D664" : "2px 2px 0 var(--ink)",
                        padding: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: isCurrent ? "#00D664" : "#FFE600", color: isCurrent ? "#FFF" : "var(--ink)", border: "1px solid var(--ink)", padding: "2px 6px", font: "700 8px 'DM Mono'" }}>
                          {isCurrent ? "✓ SEDANG DIPUTAR DI WEB" : preset.badge}
                        </span>
                      </div>
                      <strong style={{ font: "800 13px 'Syne'", color: "var(--ink)" }}>{preset.title}</strong>
                      <span style={{ font: "500 11px 'DM Mono'", color: "#666" }}>{preset.artist}</span>

                      <button
                        type="button"
                        onClick={() => applyAndSavePreset(preset)}
                        disabled={busy}
                        style={{
                          marginTop: "8px",
                          background: isCurrent ? "#E2D9C8" : "#FFE600",
                          color: "var(--ink)",
                          border: "1.5px solid var(--ink)",
                          boxShadow: "2px 2px 0 var(--ink)",
                          font: "800 10px 'Syne'",
                          padding: "8px 10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "5px",
                        }}
                      >
                        {isCurrent ? "✓ SEDANG AKTIF DI WEB" : "⚡ PASANG & AKTIFKAN LAGU INI"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORM CONFIG */}
            <form onSubmit={(e) => { e.preventDefault(); saveAudioDirectly(); }}>
              <div className="cms-grid" style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", font: "700 12px 'DM Mono'", background: "#FFF", padding: "12px", border: "1.5px solid var(--ink)" }}>
                  <input
                    type="checkbox"
                    checked={siteContent.audioTrack?.enabled !== false}
                    onChange={(e) => updateAudioField("enabled", e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  Aktifkan Pemutar Backsound di Mading Publik
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", font: "700 12px 'DM Mono'", background: "#FFF", padding: "12px", border: "1.5px solid var(--ink)" }}>
                  <input
                    type="checkbox"
                    checked={siteContent.audioTrack?.autoplay !== false}
                    onChange={(e) => updateAudioField("autoplay", e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  Mulai Putar Otomatis saat pengunjung klik pertama kali
                </label>
              </div>

              <div className="cms-group">
                <label>TIPE SUMBER SUARA:</label>
                <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", font: "700 11px 'DM Mono'" }}>
                    <input
                      type="radio"
                      name="audioType"
                      value="youtube"
                      checked={siteContent.audioTrack?.type !== "audio_url"}
                      onChange={() => updateAudioField("type", "youtube")}
                    />
                    Tautan YouTube (Otomatis streaming suara dari video)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", font: "700 11px 'DM Mono'" }}>
                    <input
                      type="radio"
                      name="audioType"
                      value="audio_url"
                      checked={siteContent.audioTrack?.type === "audio_url"}
                      onChange={() => updateAudioField("type", "audio_url")}
                    />
                    File Audio Langsung (.mp3 / URL stream)
                  </label>
                </div>
              </div>

              <div className="cms-group">
                <label>
                  {siteContent.audioTrack?.type === "audio_url" ? "URL FILE AUDIO (.MP3 / STREAM):" : "LINK VIDEO YOUTUBE ATAU YOUTUBE ID:"}
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    value={siteContent.audioTrack?.url || ""}
                    placeholder={siteContent.audioTrack?.type === "audio_url" ? "https://domain.com/musik-lagu.mp3" : "https://www.youtube.com/watch?v=jfKfPfyJRdk atau ID video"}
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const ytId = extractYouTubeId(raw);
                      updateAudioFields({
                        url: raw,
                        youtubeId: ytId || raw,
                      });
                    }}
                    required
                  />
                  <button
                    type="submit"
                    className="admin-primary"
                    disabled={busy}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    💾 SIMPAN LAGU
                  </button>
                </div>
                {siteContent.audioTrack?.type !== "audio_url" && (
                  <small style={{ font: "500 10px 'DM Mono'", color: "#777", marginTop: "4px", display: "block" }}>
                    ✓ Masukkan link lengkap (misal: <code>https://youtu.be/xxx</code>) atau 11 digit kode video YouTube.
                    {siteContent.audioTrack?.youtubeId && (
                      <span style={{ color: "#008a3e", fontWeight: 700, marginLeft: "8px" }}>
                        [Terdeteksi ID: {extractYouTubeId(siteContent.audioTrack.youtubeId)}]
                      </span>
                    )}
                  </small>
                )}
              </div>

              <div className="cms-grid">
                <div className="cms-group">
                  <label>JUDUL LAGU (DITAMPILKAN DI PEMUTAR MADING):</label>
                  <input
                    value={siteContent.audioTrack?.title || ""}
                    placeholder="Contoh: Nocturne di Kayutangan"
                    onChange={(e) => updateAudioField("title", e.target.value)}
                    required
                  />
                </div>
                <div className="cms-group">
                  <label>NAMA ARTIS / PENYANYI / MUSISI:</label>
                  <input
                    value={siteContent.audioTrack?.artist || ""}
                    placeholder="Contoh: Malang Classical & Heritage Ensemble"
                    onChange={(e) => updateAudioField("artist", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="cms-group">
                <label>VOLUME DEFAULT ({siteContent.audioTrack?.volume ?? 50}%):</label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={siteContent.audioTrack?.volume ?? 50}
                    onChange={(e) => updateAudioField("volume", Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ font: "700 12px 'DM Mono'", minWidth: "45px" }}>
                    {siteContent.audioTrack?.volume ?? 50}%
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="submit" className="admin-primary" disabled={busy}>
                  <Icon name="check" size={16}/> SIMPAN PENGATURAN MUSIK MADING
                </button>
              </div>
            </form>
          </section>
        )}

        {/* TAB 4: STICKER MODERATION & CURATOR BADGES */}
        {activeTab === "stickers" && (
          <section className="admin-panel-card">
            <span className="admin-eyebrow">MODERASI KOMUNITAS · MALANG FEST</span>
            <h3>Stiker Apresiasi & Lencana Kurator</h3>
            <p style={{ font: "500 12px 'DM Mono'", marginBottom: "24px" }}>
              Kelola stiker yang ditempel oleh publik atau tempelkan lencana khusus kurator resmi ke poster manapun.
            </p>

            {/* Form Tempel Stiker Kurator */}
            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px", marginBottom: "28px" }}>
              <h4 style={{ font: "800 15px 'Syne'", margin: "0 0 12px" }}>⭐ TEMPEL STIKER RESMI DARI KURATOR</h4>
              <form onSubmit={addCuratorSticker} style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr auto", gap: "10px", alignItems: "end" }}>
                <label style={{ display: "flex", flexDirection: "column", font: "700 9px 'DM Mono'", gap: "4px" }}>
                  PILIH POSTER:
                  <select
                    value={curatorStickerEventId}
                    onChange={(e) => setCuratorStickerEventId(e.target.value)}
                    required
                    style={{ background: "white", padding: "8px", border: "1.5px solid var(--ink)" }}
                  >
                    <option value="">-- Pilih Poster --</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "flex", flexDirection: "column", font: "700 9px 'DM Mono'", gap: "4px" }}>
                  TEKS STIKER:
                  <input
                    value={curatorStickerText}
                    onChange={(e) => setCuratorStickerText(e.target.value)}
                    placeholder="Contoh: PILIHAN KURATOR! ★"
                    required
                    style={{ background: "white", padding: "8px", border: "1.5px solid var(--ink)" }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", font: "700 9px 'DM Mono'", gap: "4px" }}>
                  WARNA STIKER:
                  <select
                    value={curatorStickerColor}
                    onChange={(e) => setCuratorStickerColor(e.target.value)}
                    style={{ background: "white", padding: "8px", border: "1.5px solid var(--ink)" }}
                  >
                    <option value="#FFE600">Kuning (#FFE600)</option>
                    <option value="#FB4E7B">Merah Jambu (#FB4E7B)</option>
                    <option value="#8CE8EB">Sian (#8CE8EB)</option>
                    <option value="#D8FF57">Hijau Asid (#D8FF57)</option>
                  </select>
                </label>

                <button type="submit" className="admin-primary" style={{ height: "39px" }}>
                  TEMPELKAN
                </button>
              </form>
            </div>

            {/* List of all active stickers */}
            <h4 style={{ font: "800 15px 'Syne'", margin: "0 0 14px" }}>DAFTAR SELURUH STIKER AKTIF DI MADING ({allStickers.length}):</h4>
            <div className="sticker-admin-grid">
              {allStickers.map((st) => (
                <div className="sticker-admin-card" key={st.id}>
                  <div>
                    <span style={{ background: st.color || "#FFE600", border: "1px solid var(--ink)", padding: "2px 6px", font: "700 8px 'DM Mono'", display: "inline-block", marginBottom: "6px" }}>
                      {st.isCuratorBadge ? "⭐ KURATOR" : "WARGA"}
                    </span>
                    <b>{st.text}</b>
                    <small>Poster: {st.eventTitle}</small>
                  </div>
                  <button
                    onClick={() => removeSticker(st.id)}
                    style={{ alignSelf: "flex-end", marginTop: "10px", background: "var(--pink)", border: "1px solid var(--ink)", color: "white", font: "700 8px 'DM Mono'", padding: "4px 7px", cursor: "pointer" }}
                  >
                    Hapus Stiker
                  </button>
                </div>
              ))}
              {!allStickers.length && (
                <p style={{ font: "500 12px 'DM Mono'", padding: "20px" }}>Belum ada stiker yang ditempelkan di mading.</p>
              )}
            </div>
          </section>
        )}

        {/* TAB 5: SUPABASE & UPSTASH GUIDE */}
        {activeTab === "supabase" && (
          <section className="admin-panel-card">
            <span className="admin-eyebrow">ARSITEKTUR DATABASE CLOUD</span>
            <h3>Status Koneksi Supabase & Penyimpanan Permanen</h3>

            {/* LIVE CONNECTION STATUS CARD */}
            <div style={{
              background: supabaseStatus?.connected ? "#d1fae5" : "#fef3c7",
              border: "2px solid var(--ink)",
              boxShadow: "4px 4px 0 var(--ink)",
              padding: "20px",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: supabaseStatus?.connected ? "#10b981" : "#f59e0b",
                    border: "1.5px solid var(--ink)"
                  }} />
                  <b style={{ font: "800 16px 'Syne'" }}>
                    {supabaseStatus?.connected
                      ? "TERHUBUNG KE SUPABASE POSTGRESQL (AKTIF & PERMANEN)"
                      : supabaseStatus?.configured
                        ? "SUPABASE TERDETEKSI TAPI TABEL BELUM SIAP"
                        : "SUPABASE BELUM TERHUBUNG (DATA MASIH IN-MEMORY / LOKAL)"}
                  </b>
                </div>
                <button
                  onClick={() => checkSupabaseStatus()}
                  disabled={checkingSupabase}
                  style={{
                    background: "var(--ink)",
                    color: "var(--paper)",
                    border: "1.5px solid var(--ink)",
                    font: "700 10px 'DM Mono'",
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  {checkingSupabase ? "Memeriksa..." : "🔄 Cek Status Koneksi Sekarang"}
                </button>
              </div>

              <p style={{ font: "500 11px/1.5 'DM Mono'", margin: 0, color: "var(--ink)" }}>
                {supabaseStatus?.message || "Menghubungi server untuk mendeteksi status Supabase..."}
              </p>
            </div>

            {/* KENAPA REFRESH HILANG PENJELASAN */}
            <div style={{ background: "#ffecf1", border: "1.5px solid var(--ink)", padding: "18px 20px", marginBottom: "22px" }}>
              <h4 style={{ font: "800 15px 'Syne'", margin: "0 0 8px", color: "#9f1239" }}>
                💡 Mengapa Data Bisa Hilang Saat Di-refresh di Vercel?
              </h4>
              <p style={{ font: "500 11px/1.6 'DM Mono'", margin: 0 }}>
                Di <b>Vercel</b>, website berjalan di atas sistem <b>Serverless</b> (tanpa server fisik tetap). Jika Supabase belum terhubung atau skrip tabel belum dibuat, sistem akan mereset memori ke data awal setiap kali Anda me-refresh halaman. 
                <br/>
                <b>Solusinya sangat mudah:</b> Ikuti 3 langkah di bawah ini agar semua poster dan stiker Anda langsung tersimpan permanen di cloud PostgreSQL Supabase:
              </p>
            </div>

            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px", marginBottom: "20px" }}>
              <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 10px" }}>Langkah 1: Jalankan Skrip SQL di Supabase (Wajib)</h4>
              <p style={{ font: "500 11px/1.5 'DM Mono'", margin: "0 0 12px" }}>
                File skrip database lengkap sudah dibuat otomatis di repositori dengan nama <code>supabase-schema.sql</code>.
              </p>
              <ol style={{ font: "500 11px/1.6 'DM Mono'", margin: "0 0 14px", paddingLeft: "20px" }}>
                <li>Buka dashboard Supabase Anda di <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ textDecoration: "underline", fontWeight: 700 }}>supabase.com/dashboard</a>.</li>
                <li>Pilih project Anda, lalu klik menu <b>SQL Editor</b> di sidebar kiri.</li>
                <li>Klik tombol <b>New Query</b>.</li>
                <li>Buka file <code>supabase-schema.sql</code> dari repositori ini, salin semua isinya, paste ke editor query Supabase, lalu klik <b>Run</b> (atau tekan Ctrl+Enter).</li>
              </ol>
              <div style={{ background: "#1e1c1a", color: "var(--paper)", padding: "12px 14px", font: "500 10px 'DM Mono'" }}>
                ✓ Tabel <code>events</code>, <code>stickers</code>, <code>site_content</code>, dan <code>admins</code> akan otomatis dibuat lengkap dengan data awal.
              </div>
            </div>

            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px" }}>
              <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 10px" }}>Langkah 2: Masukkan Variabel di Vercel Settings</h4>
              <p style={{ font: "500 11px 'DM Mono'", margin: "0 0 12px" }}>
                Di Vercel Dashboard project Anda (<b>Settings &gt; Environment Variables</b>), pastikan variabel berikut terisi:
              </p>
              <div style={{ background: "#1e1c1a", color: "var(--paper)", padding: "14px", font: "500 11px 'DM Mono'", lineHeight: 1.8 }}>
                <div>NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co</div>
                <div>SUPABASE_SERVICE_ROLE_KEY=ey... (didapat dari Supabase &gt; Project Settings &gt; API &gt; service_role)</div>
                <div>JWT_SECRET=bebas_string_acak_rahasia_anda</div>
              </div>
              <p style={{ font: "600 11px 'DM Mono'", margin: "14px 0 0", color: "#b45309" }}>
                ⚠️ Catatan: Setelah memasukkan variabel di Vercel, klik <b>Deployments &gt; Redeploy</b> agar Vercel membaca variabel baru tersebut.
              </p>
            </div>
          </section>
        )}
      </section>

      {notice && <div className="admin-toast"><Icon name="check" size={16}/>{notice}</div>}
    </main>
  );
}
