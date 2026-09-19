import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Headphones, Radio,
  SkipForward, SkipBack, Volume2, VolumeX,
  X, ExternalLink, ChevronDown, ChevronUp,
  Loader2, Shuffle, Repeat, Music2, BookmarkCheck
} from 'lucide-react';
import { parseDriveUrl, formatDurationSeconds } from '../services/mediaHelper';

// ── Constants ─────────────────────────────────────────────────────────────────
const SPEEDS   = [0.75, 1, 1.25, 1.5, 2];
const POS_KEY  = 'kkd_audio_positions';
const PREF_KEY = 'kkd_audio_prefs';

const CAT_ART = {
  'Youth Focus':         { colors: ['#f97316', '#fb923c'], emoji: '🎯', accent: '#f97316' },
  'Corporate Executive': { colors: ['#2563eb', '#0891b2'], emoji: '💼', accent: '#2563eb' },
  'Vedic Science':       { colors: ['#7c3aed', '#db2777'], emoji: '🕉️', accent: '#7c3aed' },
};
const DEF_ART = { colors: ['#f97316', '#eab308'], emoji: '🎧', accent: '#f97316' };

// ── Track Artwork Component ────────────────────────────────────────────────────
function TrackArt({ track, size = 48, playing = false, loading = false }) {
  const art = (track && CAT_ART[track?.category]) || DEF_ART;
  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden shadow-lg select-none"
      style={{ width: size, height: size,
        background: `linear-gradient(135deg, ${art.colors[0]}, ${art.colors[1]})` }}
    >
      {/* Emoji center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span style={{ fontSize: size * 0.38, lineHeight: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          {art.emoji}
        </span>
      </div>

      {/* Playing overlay with EQ bars */}
      {playing && !loading && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <div className="flex items-end gap-[2px]" style={{ height: size * 0.42 }}>
            {[0.45, 0.8, 0.55, 1, 0.65, 0.85, 0.5].map((h, i) => (
              <div key={i} className="rounded-sm bg-white"
                style={{ width: Math.max(2, size * 0.065), height: `${h * 100}%`,
                  animation: `eqBar ${0.4 + i * 0.09}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="text-white animate-spin" style={{ width: size * 0.35, height: size * 0.35 }} />
        </div>
      )}
    </div>
  );
}

// ── Main AudioPlayer ──────────────────────────────────────────────────────────
export default function AudioPlayer({ audioList = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTrack, setCurrentTrack]         = useState(null);
  const [currentIndex, setCurrentIndex]         = useState(0);
  const [isPlaying, setIsPlaying]               = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [loadError, setLoadError]               = useState(false);
  const [progress, setProgress]                 = useState(0);
  const [currentTime, setCurrentTime]           = useState('0:00');
  const [duration, setDuration]                 = useState('0:00');
  const [volume, setVolume]                     = useState(1);
  const [isMuted, setIsMuted]                   = useState(false);
  const [playerExpanded, setPlayerExpanded]     = useState(true);
  const [speedIdx, setSpeedIdx]                 = useState(1); // index into SPEEDS
  const [isLooping, setIsLooping]               = useState(false);
  const [isShuffle, setIsShuffle]               = useState(false);
  const [showFloating, setShowFloating]         = useState(false);
  const [detectedDurations, setDetectedDurations] = useState({});
  const [savedPositions, setSavedPositions]     = useState(() => {
    try { return JSON.parse(localStorage.getItem(POS_KEY) || '{}'); } catch { return {}; }
  });

  const audioRef    = useRef(null);
  const sectionRef  = useRef(null);

  const categories   = ['all', 'Youth Focus', 'Corporate Executive', 'Vedic Science'];
  const filteredAudio = selectedCategory === 'all'
    ? audioList
    : audioList.filter(t => t.category === selectedCategory);

  const speed = SPEEDS[speedIdx];

  // ── Load prefs ──────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      if (p.volume   !== undefined) setVolume(p.volume);
      if (p.speedIdx !== undefined) setSpeedIdx(p.speedIdx);
      if (p.shuffle  !== undefined) setIsShuffle(p.shuffle);
      if (p.loop     !== undefined) setIsLooping(p.loop);
    } catch {}
  }, []);

  const savePrefs = useCallback((overrides = {}) => {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(
        { volume, speedIdx, shuffle: isShuffle, loop: isLooping, ...overrides }
      ));
    } catch {}
  }, [volume, speedIdx, isShuffle, isLooping]);

  // ── Persist playback position ───────────────────────────────────────────────
  const savePosition = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    const pos = audioRef.current.currentTime;
    if (pos < 3) return; // don't save near start
    const next = {
      ...savedPositions,
      [currentTrack.id]: {
        pos,
        title: currentTrack.title,
        ts: Date.now(),
        durSec: audioRef.current.duration || 0,
      }
    };
    setSavedPositions(next);
    try { localStorage.setItem(POS_KEY, JSON.stringify(next)); } catch {}
  }, [currentTrack, savedPositions]);

  // Clear saved position when track ends
  const clearPosition = useCallback((trackId) => {
    const next = { ...savedPositions };
    delete next[trackId];
    setSavedPositions(next);
    try { localStorage.setItem(POS_KEY, JSON.stringify(next)); } catch {}
  }, [savedPositions]);

  // ── Play a track ────────────────────────────────────────────────────────────
  const playTrack = useCallback((track, idx) => {
    setLoadError(false);
    setIsLoading(true);
    setProgress(0);
    setCurrentTime('0:00');
    setDuration(track.duration || '0:00');
    setCurrentTrack(track);
    setCurrentIndex(idx);
    setIsPlaying(true);
    setPlayerExpanded(true);
  }, []);

  // ── Load audio when track changes ───────────────────────────────────────────
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    const driveObj = parseDriveUrl(currentTrack.drive_url);
    const src = driveObj ? driveObj.streamUrl : currentTrack.drive_url;
    if (!src) return;

    audioRef.current.src            = src;
    audioRef.current.volume         = volume;
    audioRef.current.muted          = isMuted;
    audioRef.current.playbackRate   = speed;
    audioRef.current.load();

    const saved = savedPositions[currentTrack.id];

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
        // Restore saved position
        if (saved && saved.pos > 3) {
          audioRef.current.currentTime = saved.pos;
        }
      })
      .catch(() => setIsLoading(false));
  }, [currentTrack]); // eslint-disable-line

  // ── Toggle play / pause ─────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      savePosition();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, savePosition]);

  // ── Prev / Next ─────────────────────────────────────────────────────────────
  const playNext = useCallback(() => {
    if (!filteredAudio.length) return;
    savePosition();
    if (isLooping) {
      // Restart same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    let idx = isShuffle
      ? Math.floor(Math.random() * filteredAudio.length)
      : (currentIndex + 1) % filteredAudio.length;
    playTrack(filteredAudio[idx], idx);
  }, [filteredAudio, currentIndex, isShuffle, isLooping, savePosition, playTrack]);

  const playPrev = useCallback(() => {
    if (!audioRef.current) return;
    // If >3s in, restart current; else previous
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    savePosition();
    const idx = (currentIndex - 1 + filteredAudio.length) % filteredAudio.length;
    playTrack(filteredAudio[idx], idx);
  }, [filteredAudio, currentIndex, savePosition, playTrack]);

  // ── Speed ────────────────────────────────────────────────────────────────────
  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
    savePrefs({ speedIdx: next });
  };

  // ── Shuffle / Loop toggles ───────────────────────────────────────────────────
  const toggleShuffle = () => { setIsShuffle(s => { savePrefs({ shuffle: !s }); return !s; }); };
  const toggleLoop    = () => { setIsLooping(l => { savePrefs({ loop: !l });    return !l; }); };

  // ── Audio events ─────────────────────────────────────────────────────────────
  const onTimeUpdate = () => {
    if (!audioRef.current?.duration) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(pct);
    setCurrentTime(formatDurationSeconds(audioRef.current.currentTime));
    // Autosave every 10 seconds
    if (Math.round(audioRef.current.currentTime) % 10 === 0) savePosition();
  };

  const onLoadedMetadata = () => {
    setIsLoading(false);
    setLoadError(false);
    if (!audioRef.current) return;
    const dur = formatDurationSeconds(audioRef.current.duration);
    setDuration(dur);
    if (currentTrack) setDetectedDurations(prev => ({ ...prev, [currentTrack.id]: dur }));
  };

  const onCanPlay  = () => { setIsLoading(false); setLoadError(false); };
  const onWaiting  = () => setIsLoading(true);
  const onPlaying  = () => { setIsLoading(false); setIsPlaying(true); };
  const onPause    = () => setIsPlaying(false);
  const onEnded    = () => {
    if (currentTrack) clearPosition(currentTrack.id);
    playNext();
  };
  const onError    = () => { setIsLoading(false); setLoadError(true); setIsPlaying(false); };

  // ── Seek ─────────────────────────────────────────────────────────────────────
  const handleSeek = (e) => {
    if (!audioRef.current?.duration) return;
    const val = Number(e.target.value);
    audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
    setProgress(val);
  };

  // ── Volume ───────────────────────────────────────────────────────────────────
  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
    savePrefs({ volume: v });
  };
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  // ── Keyboard shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (!currentTrack) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      switch (e.code) {
        case 'Space':       e.preventDefault(); togglePlay(); break;
        case 'ArrowRight':  e.preventDefault(); if (audioRef.current) audioRef.current.currentTime += 10; break;
        case 'ArrowLeft':   e.preventDefault(); if (audioRef.current) audioRef.current.currentTime -= 10; break;
        case 'ArrowUp':     e.preventDefault();
          setVolume(v => { const n = Math.min(1, v + 0.1); if (audioRef.current) audioRef.current.volume = n; return n; }); break;
        case 'ArrowDown':   e.preventDefault();
          setVolume(v => { const n = Math.max(0, v - 0.1); if (audioRef.current) audioRef.current.volume = n; return n; }); break;
        case 'KeyN':        playNext(); break;
        case 'KeyP':        playPrev(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentTrack, togglePlay, playNext, playPrev]);

  // ── Floating widget visibility (shows when scrolled past audio section) ────────
  useEffect(() => {
    if (!currentTrack) { setShowFloating(false); return; }
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setShowFloating(!sectionVisible && (isPlaying || !!currentTrack));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentTrack, isPlaying]);

  // ── Scroll to audio section ───────────────────────────────────────────────────
  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPlayerExpanded(true);
  };

  // ── Render helpers ────────────────────────────────────────────────────────────
  const catStyle = currentTrack ? (CAT_ART[currentTrack.category] || DEF_ART) : DEF_ART;
  const savedForCurrent = currentTrack ? savedPositions[currentTrack.id] : null;

  // ── Component ─────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} id="audio-lectures" className="py-20 bg-gradient-to-b from-white to-slate-50 relative">

      {/* Hidden real HTML5 audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onCanPlay}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onPause={onPause}
        onEnded={onEnded}
        onError={onError}
        preload="metadata"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-4 h-4 animate-pulse" /> Audio Lectures & Podcasts
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Listen to Timeless Wisdom & Practical Coaching
          </h2>
          <p className="text-slate-500 mt-3 text-sm">
            Stream from Google Drive · Full controls · Progress saved automatically
          </p>

          {/* Keyboard hint */}
          {currentTrack && (
            <p className="mt-2 text-[11px] text-slate-400 font-mono">
              ⌨ Space=Play/Pause · ←→=±10s · ↑↓=Volume · N=Next · P=Prev
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'gradient-saffron text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                {cat === 'all' ? 'All Lectures' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAudio.map((track, idx) => {
            const isActive  = currentTrack?.id === track.id;
            const playing   = isActive && isPlaying;
            const loading   = isActive && isLoading;
            const saved     = savedPositions[track.id];
            const displayDur = detectedDurations[track.id] || track.duration || '';
            const pctSaved  = saved?.durSec > 0 ? (saved.pos / saved.durSec) * 100 : 0;
            const art       = CAT_ART[track.category] || DEF_ART;

            return (
              <div key={track.id} onClick={() => playTrack(track, idx)}
                className={`group relative rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'border-saffron-500/40 shadow-xl shadow-saffron-500/10 ring-2 ring-saffron-500/20'
                    : 'border-slate-200 hover:border-saffron-400/40 hover:shadow-xl hover:shadow-slate-200/60 bg-white'
                }`}
              >
                {/* Card top gradient bar */}
                <div className="h-1 w-full"
                  style={{ background: `linear-gradient(to right, ${art.colors[0]}, ${art.colors[1]})` }} />

                <div className="p-5">
                  {/* Artwork + Category + Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <TrackArt track={track} size={60} playing={playing} loading={loading} />
                    <div className="flex-1 min-w-0 pt-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5"
                        style={{ background: `${art.colors[0]}18`, color: art.colors[0] }}>
                        {track.category}
                      </span>
                      <h3 className={`font-bold text-base leading-snug transition-colors ${
                        isActive ? 'text-saffron-700' : 'text-slate-900 group-hover:text-saffron-600'
                      }`}>
                        {track.title}
                      </h3>
                    </div>
                  </div>

                  {/* Saved progress indicator */}
                  {saved && !isActive && pctSaved > 0 && (
                    <div className="mb-3 px-1">
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pctSaved}%`, background: `linear-gradient(to right, ${art.colors[0]}, ${art.colors[1]})` }} />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <BookmarkCheck className="w-3 h-3 text-saffron-400" />
                          Resume from {formatDurationSeconds(saved.pos)}
                        </span>
                        <span className="text-[10px] text-slate-400">{Math.round(pctSaved)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Card footer */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Headphones className="w-3.5 h-3.5" style={{ color: art.colors[0] }} />
                      <span>{displayDur || 'Stream'}</span>
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
                      playing
                        ? 'text-white scale-110 ring-2 ring-amber-400/30'
                        : 'bg-slate-900 text-white group-hover:scale-105'
                    }`} style={playing ? { background: `linear-gradient(135deg, ${art.colors[0]}, ${art.colors[1]})` } : {}}>
                      {loading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : playing
                          ? <Pause className="w-4 h-4" />
                          : <Play className="w-4 h-4 ml-0.5" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAudio.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Headphones className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold">No audio lectures yet.</p>
            <p className="text-sm mt-1">Add podcasts from the Admin Panel.</p>
          </div>
        )}
      </div>

      {/* ── Floating Mini Widget (appears when scrolled away from section) ── */}
      {showFloating && currentTrack && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fadeIn">
          <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden cursor-pointer"
            style={{ minWidth: 220 }}
            onClick={scrollToSection}
          >
            {/* Accent top bar */}
            <div className="h-0.5 w-full"
              style={{ background: `linear-gradient(to right, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }} />

            <div className="p-3 flex items-center gap-3">
              <TrackArt track={currentTrack} size={40} playing={isPlaying} loading={isLoading} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold truncate">{currentTrack.title}</p>
                <p className="text-[10px] font-semibold" style={{ color: catStyle.colors[0] }}>
                  {isLoading ? 'Buffering…' : isPlaying ? '▶ Now Playing' : '⏸ Paused'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />
                }
              </button>
            </div>

            {/* Mini progress bar */}
            <div className="h-0.5 bg-slate-800">
              <div className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, ${catStyle.colors[0]}, ${catStyle.colors[1]})`,
                }} />
            </div>

            {/* Pulsing ring when playing */}
            {isPlaying && (
              <div className="absolute -inset-1 rounded-2xl pointer-events-none"
                style={{ boxShadow: `0 0 0 2px ${catStyle.colors[0]}40`, animation: 'ringPulse 2s ease-in-out infinite' }} />
            )}
          </div>
        </div>
      )}

      {/* ── Main Sticky Bottom Player ── */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50">

          {/* Minimized bar */}
          {!playerExpanded ? (
            <div
              className="cursor-pointer bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 px-5 py-2.5"
              onClick={() => setPlayerExpanded(true)}
            >
              {/* Mini progress line */}
              <div className="absolute top-0 left-0 h-0.5 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, ${catStyle.colors[0]}, ${catStyle.colors[1]})`,
                }} />

              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TrackArt track={currentTrack} size={32} playing={isPlaying} loading={isLoading} />
                  <div>
                    <span className="text-white text-xs font-bold">{currentTrack.title}</span>
                    <span className="text-slate-500 text-[10px] ml-2">{currentTime} / {duration}</span>
                  </div>
                  {isPlaying && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                      style={{ background: `${catStyle.colors[0]}20`, color: catStyle.colors[0] }}>
                      ● LIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }}>
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

          ) : (
            <div className="bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 shadow-2xl">
              {/* Top accent line matching track color */}
              <div className="h-0.5 w-full"
                style={{ background: `linear-gradient(to right, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }} />

              {/* Error banner */}
              {loadError && (
                <div className="bg-red-950/80 border-b border-red-900/60 px-5 py-2 flex items-center gap-3">
                  <span className="text-red-300 text-xs">
                    ⚠ Could not stream. Make sure the Google Drive file is shared as <strong>"Anyone with the link"</strong>.
                  </span>
                  <a href={currentTrack.drive_url} target="_blank" rel="noreferrer"
                    className="text-amber-400 underline text-xs font-bold shrink-0">
                    Open in Drive →
                  </a>
                </div>
              )}

              <div className="max-w-7xl mx-auto px-5 py-3.5 space-y-3">

                {/* Row 1: Artwork + Info + Controls + Speed + Volume */}
                <div className="flex items-center gap-3 md:gap-4">

                  {/* Artwork */}
                  <TrackArt track={currentTrack} size={48} playing={isPlaying} loading={isLoading} />

                  {/* Track info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold text-sm truncate leading-tight">{currentTrack.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${catStyle.colors[0]}25`, color: catStyle.colors[0] }}>
                        {currentTrack.category}
                      </span>
                      {savedForCurrent && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                          <BookmarkCheck className="w-3 h-3 text-emerald-500" />
                          Saved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Shuffle + Prev + Play/Pause + Next + Loop */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={toggleShuffle} title="Shuffle"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isShuffle ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-300'
                      }`}>
                      <Shuffle className="w-3.5 h-3.5" />
                    </button>

                    <button onClick={playPrev} title="Previous"
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button onClick={togglePlay} disabled={isLoading}
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all disabled:opacity-60 shrink-0"
                      style={{ background: `linear-gradient(135deg, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }}>
                      {isLoading
                        ? <Loader2 className="w-5 h-5 animate-spin" />
                        : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />
                      }
                    </button>

                    <button onClick={playNext} title="Next"
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all">
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <button onClick={toggleLoop} title="Loop"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isLooping ? 'text-amber-400 bg-amber-400/10' : 'text-slate-600 hover:text-slate-300'
                      }`}>
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Speed button */}
                  <button onClick={cycleSpeed} title="Playback Speed"
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all shrink-0">
                    <span>{speed}×</span>
                  </button>

                  {/* Volume */}
                  <div className="hidden md:flex items-center gap-2 shrink-0">
                    <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
                      {isMuted || volume === 0
                        ? <VolumeX className="w-4 h-4 text-red-400" />
                        : <Volume2 className="w-4 h-4" />
                      }
                    </button>
                    <input type="range" min="0" max="1" step="0.02"
                      value={isMuted ? 0 : volume} onChange={handleVolume}
                      className="w-20 h-1 accent-amber-500 cursor-pointer" />
                  </div>

                  {/* Animated EQ bars (decorative when playing) */}
                  {isPlaying && (
                    <div className="hidden lg:flex items-end gap-[2px] h-7 shrink-0">
                      {[0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.55, 0.75, 0.45].map((h, i) => (
                        <div key={i} className="w-[3px] rounded-full"
                          style={{
                            height: `${h * 100}%`,
                            background: `linear-gradient(to top, ${catStyle.colors[0]}, ${catStyle.colors[1]})`,
                            animation: `eqBar ${0.35 + i * 0.08}s ease-in-out infinite alternate`,
                            animationDelay: `${i * 0.06}s`,
                          }} />
                      ))}
                    </div>
                  )}

                  {/* Utility buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <a href={currentTrack.drive_url} target="_blank" rel="noreferrer"
                      title="Open in Google Drive"
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-700 text-amber-400 hover:text-white flex items-center justify-center transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => setPlayerExpanded(false)}
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={() => { savePosition(); setCurrentTrack(null); setIsPlaying(false); }}
                      className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-red-300 flex items-center justify-center transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Seek bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 w-10 text-right shrink-0">{currentTime}</span>
                  <div className="flex-1 relative">
                    <input type="range" min="0" max="100" step="0.1"
                      value={progress} onChange={handleSeek}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${catStyle.colors[0]} ${progress}%, #1e293b ${progress}%)`
                      }} />
                  </div>
                  <span className="text-[11px] font-mono w-10 shrink-0"
                    style={{ color: catStyle.colors[0] }}>
                    {duration}
                  </span>
                </div>

                {/* Row 3: Mini playlist */}
                <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                  {filteredAudio.map((track, idx) => (
                    <button key={track.id} onClick={() => playTrack(track, idx)}
                      className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${
                        currentTrack?.id === track.id
                          ? 'text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                      style={currentTrack?.id === track.id
                        ? { background: `linear-gradient(135deg, ${catStyle.colors[0]}, ${catStyle.colors[1]})` }
                        : {}
                      }>
                      {savedPositions[track.id] && (
                        <span className="mr-1 text-emerald-400">●</span>
                      )}
                      {track.title.length > 24 ? track.title.slice(0, 24) + '…' : track.title}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes eqBar {
          from { transform: scaleY(0.25); opacity: 0.6; }
          to   { transform: scaleY(1);    opacity: 1;   }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1);    }
          50%       { opacity: 0.8; transform: scale(1.02); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
