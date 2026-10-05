"use client";

import { useState, useEffect, useRef } from "react";

export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  // If it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Standard youtube watch URL
  const matchWatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (matchWatch && matchWatch[1]) {
    return matchWatch[1];
  }
  return "";
}

export default function BackgroundPlayer({ audioConfig }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const audioRef = useRef(null);
  const ytIframeRef = useRef(null);

  const config = audioConfig || {
    enabled: true,
    title: "Nocturne di Kayutangan (Akustik & Klasik)",
    artist: "Malang Classical & Heritage Ensemble",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    youtubeId: "jfKfPfyJRdk",
    autoplay: true,
    volume: 50,
  };

  const isEnabled = config.enabled !== false;
  const isYouTube = config.type === "youtube" || Boolean(config.youtubeId) || (config.url && config.url.includes("youtu"));
  const ytVideoId = extractYouTubeId(config.youtubeId || config.url) || "jfKfPfyJRdk";

  // Post message command to YouTube Iframe
  function postYtCommand(func, args = []) {
    if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
      ytIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    }
  }

  // Toggle Play / Pause
  function togglePlay() {
    setHasInteracted(true);
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    setIsPlaying(true);
    if (isYouTube) {
      postYtCommand("playVideo");
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Browser prevented autoplay
        setIsPlaying(false);
      });
    }
  }

  function pauseAudio() {
    setIsPlaying(false);
    if (isYouTube) {
      postYtCommand("pauseVideo");
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  // Toggle Mute
  function toggleMute() {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isYouTube) {
      if (nextMuted) {
        postYtCommand("mute");
      } else {
        postYtCommand("unMute");
      }
    } else if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  }

  // Autoplay attempt on first user gesture anywhere on page
  useEffect(() => {
    if (!isEnabled || !config.autoplay) return;

    function handleFirstGesture() {
      if (!hasInteracted) {
        setHasInteracted(true);
        playAudio();
      }
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    }

    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, [isEnabled, config.autoplay, hasInteracted, isYouTube]);

  // Set initial volume when player is ready
  useEffect(() => {
    const vol = typeof config.volume === "number" ? config.volume : 50;
    if (isYouTube) {
      postYtCommand("setVolume", [vol]);
    } else if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  }, [config.volume, isYouTube, playerReady]);

  if (!isEnabled) return null;

  return (
    <>
      {/* Hidden Audio Elements */}
      {isYouTube ? (
        <div style={{ position: "fixed", width: "1px", height: "1px", opacity: 0.01, pointerEvents: "none", zIndex: -1, overflow: "hidden" }}>
          <iframe
            key={ytVideoId}
            ref={ytIframeRef}
            src={`https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}&autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${ytVideoId}&controls=0`}
            title="Malang Fest Background Audio"
            allow="autoplay; encrypted-media"
            onLoad={() => {
              setPlayerReady(true);
              if (isPlaying) postYtCommand("playVideo");
            }}
          />
        </div>
      ) : (
        <audio
          key={config.url || "direct-audio"}
          ref={audioRef}
          src={config.url}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Floating Neobrutalist Radio Player Badge */}
      <aside
        aria-label="Pemutar Audio Latar Malang Fest"
        className={`mf-radio-player ${isMinimized ? "minimized" : ""}`}
        style={{
          position: "fixed",
          bottom: "22px",
          right: "22px",
          zIndex: 9999,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {isMinimized ? (
          /* Minimized Floating Button */
          <button
            onClick={() => setIsMinimized(false)}
            title="Buka Radio Mading"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#FFE600",
              border: "2.5px solid #1E1C1A",
              boxShadow: "3px 3px 0 #1E1C1A",
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 800,
              fontSize: "12px",
              color: "#1E1C1A",
              transition: "transform 0.15s ease",
            }}
          >
            <span
              style={{
                display: "inline-block",
                animation: isPlaying ? "mfVinylSpin 3s linear infinite" : "none",
                fontSize: "16px",
              }}
            >
              📻
            </span>
            <span>RADIO MF</span>
            {isPlaying && (
              <span style={{ display: "inline-flex", gap: "2px", alignItems: "flex-end", height: "12px" }}>
                <span className="mf-bar mf-bar-1" />
                <span className="mf-bar mf-bar-2" />
                <span className="mf-bar mf-bar-3" />
              </span>
            )}
          </button>
        ) : (
          /* Expanded Full Radio Player Card */
          <div
            style={{
              background: "#FFFDF8",
              border: "3px solid #1E1C1A",
              boxShadow: "5px 5px 0 #1E1C1A",
              width: "320px",
              maxWidth: "calc(100vw - 36px)",
              padding: "14px 16px",
              position: "relative",
            }}
          >
            {/* Header / Tape Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #1E1C1A",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "10px",
                    height: "10px",
                    background: isPlaying ? "#00D664" : "#FF4365",
                    border: "1.5px solid #1E1C1A",
                    borderRadius: "50%",
                  }}
                />
                <span style={{ font: "800 11px 'Syne', sans-serif", letterSpacing: "0.05em", color: "#1E1C1A" }}>
                  MADING BACKSOUND
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Minimize Button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  title="Sembunyikan Pemutar"
                  style={{
                    background: "none",
                    border: "1.5px solid #1E1C1A",
                    fontSize: "10px",
                    fontWeight: 700,
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#1E1C1A",
                  }}
                >
                  —
                </button>
              </div>
            </div>

            {/* Song Meta / Equalizer Visual */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              {/* Rotating Cassette / Vinyl Icon */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: isPlaying ? "#FFE600" : "#E2D9C8",
                  border: "2px solid #1E1C1A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "2px 2px 0 #1E1C1A",
                  animation: isPlaying ? "mfVinylSpin 4s linear infinite" : "none",
                  fontSize: "18px",
                }}
              >
                💿
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    font: "700 12px 'Syne', sans-serif",
                    color: "#1E1C1A",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={config.title}
                >
                  {config.title || "Nocturne di Kayutangan"}
                </div>
                <div
                  style={{
                    font: "500 10px 'DM Mono', monospace",
                    color: "#6b625b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: "2px",
                  }}
                  title={config.artist}
                >
                  {config.artist || "Malang Classical Ensemble"}
                </div>
              </div>
            </div>

            {/* Equalizer Wave Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#F4EFE6",
                border: "1.5px solid #1E1C1A",
                padding: "6px 10px",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "16px" }}>
                <span className={`mf-bar mf-bar-1 ${isPlaying ? "active" : ""}`} />
                <span className={`mf-bar mf-bar-2 ${isPlaying ? "active" : ""}`} />
                <span className={`mf-bar mf-bar-3 ${isPlaying ? "active" : ""}`} />
                <span className={`mf-bar mf-bar-4 ${isPlaying ? "active" : ""}`} />
                <span className={`mf-bar mf-bar-5 ${isPlaying ? "active" : ""}`} />
              </div>
              <span
                style={{
                  font: "700 9px 'DM Mono', monospace",
                  color: isPlaying ? "#008a3e" : "#8A7D70",
                  letterSpacing: "0.08em",
                }}
              >
                {isPlaying ? "ON AIR ♫ MEMUTAR" : "JEDA (KLIK PUTAR)"}
              </span>
            </div>

            {/* Controls Button Row */}
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlay}
                style={{
                  flex: 1,
                  background: isPlaying ? "#FF4365" : "#FFE600",
                  color: isPlaying ? "#FFFFFF" : "#1E1C1A",
                  border: "2px solid #1E1C1A",
                  boxShadow: "2px 2px 0 #1E1C1A",
                  font: "800 11px 'Syne', sans-serif",
                  padding: "9px 12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "transform 0.1s, box-shadow 0.1s",
                }}
              >
                <span>{isPlaying ? "⏸ JEDA MUSIK" : "▶ PUTAR LAGU"}</span>
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                title={isMuted ? "Bunyikan" : "Senyapkan"}
                style={{
                  background: isMuted ? "#FF4365" : "#FFFDF8",
                  color: isMuted ? "#FFF" : "#1E1C1A",
                  border: "2px solid #1E1C1A",
                  boxShadow: "2px 2px 0 #1E1C1A",
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Embedded CSS for Vinyl Spin & Equalizer animations */}
      <style jsx global>{`
        @keyframes mfVinylSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .mf-bar {
          display: inline-block;
          width: 3px;
          background: #1e1c1a;
          border-radius: 1px;
          height: 4px;
        }

        .mf-bar.active,
        .mf-radio-player.minimized .mf-bar {
          animation: mfEqualizer 0.8s ease-in-out infinite alternate;
        }

        .mf-bar-1 {
          animation-delay: 0.1s !important;
          height: 6px;
        }
        .mf-bar-2 {
          animation-delay: 0.3s !important;
          height: 14px;
        }
        .mf-bar-3 {
          animation-delay: 0.2s !important;
          height: 10px;
        }
        .mf-bar-4 {
          animation-delay: 0.4s !important;
          height: 15px;
        }
        .mf-bar-5 {
          animation-delay: 0.15s !important;
          height: 8px;
        }

        @keyframes mfEqualizer {
          0% {
            height: 3px;
          }
          50% {
            height: 15px;
          }
          100% {
            height: 6px;
          }
        }
      `}</style>
    </>
  );
}
