"use client";

import { useEffect, useMemo, useState } from "react";

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
            <span className="admin-eyebrow">ARSITEKTUR CLOUD & PRODUKSI</span>
            <h3>Panduan Integrasi Supabase & Upstash Redis</h3>
            <p style={{ font: "500 12px 'DM Mono'", lineHeight: 1.5, maxWidth: "780px", marginBottom: "22px" }}>
              Aplikasi Malang Fest ini dirancang dengan adapter fleksibel: saat berjalan di AI Studio, aplikasi menggunakan penyimpanan in-memory berkecepatan tinggi yang aman. Ketika Anda siap mendeploy ke <b>Vercel</b> dengan <b>Supabase</b> dan <b>Upstash Redis</b>, ikuti langkah berikut:
            </p>

            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px", marginBottom: "20px" }}>
              <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 10px" }}>1. Skrip SQL Supabase Siap Pakai</h4>
              <p style={{ font: "500 11px 'DM Mono'", margin: "0 0 12px" }}>
                Skrip SQL lengkap sudah disiapkan di file <code>/supabase-schema.sql</code> di root repositori. Skrip ini membuat tabel <code>events</code>, <code>stickers</code>, <code>site_content</code>, <code>admins</code>, indeks pencarian, dan aturan keamanan (Row Level Security).
              </p>
              <div style={{ background: "#1e1c1a", color: "var(--paper)", padding: "14px", font: "500 11px 'DM Mono'", overflowX: "auto" }}>
                <code>-- File telah dibuat di /supabase-schema.sql</code><br/>
                <code>-- Buka Supabase Dashboard &gt; SQL Editor &gt; Salin & Jalankan</code>
              </div>
            </div>

            <div style={{ background: "#fcf8f0", border: "1.5px solid var(--ink)", padding: "20px" }}>
              <h4 style={{ font: "800 16px 'Syne'", margin: "0 0 10px" }}>2. Konfigurasi Variabel Lingkungan di Vercel</h4>
              <p style={{ font: "500 11px 'DM Mono'", margin: "0 0 12px" }}>
                Di Vercel Dashboard project Anda (Settings &gt; Environment Variables), masukkan:
              </p>
              <div style={{ background: "#1e1c1a", color: "var(--paper)", padding: "14px", font: "500 11px 'DM Mono'", lineHeight: 1.6 }}>
                <div>NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...</div>
                <div>SUPABASE_SERVICE_ROLE_KEY=ey...</div>
                <div>UPSTASH_REDIS_REST_URL=https://...upstash.io</div>
                <div>UPSTASH_REDIS_REST_TOKEN=...</div>
                <div>JWT_SECRET=rahasia-jwt-malangfest-anda</div>
              </div>
            </div>
          </section>
        )}
      </section>

      {notice && <div className="admin-toast"><Icon name="check" size={16}/>{notice}</div>}
    </main>
  );
}
