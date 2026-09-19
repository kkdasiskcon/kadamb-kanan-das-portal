import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, X, ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from 'lucide-react';
import { parseDriveUrl } from '../services/mediaHelper';

export default function PhotoGallery({ photoList = [], speakerPhoto, posterPhoto, seminarPhoto, corpPhoto, youthPhoto }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loaded, setLoaded] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultPhotos = [
    { id: 'p-1', title: 'Speaker Credentials Infographic', event_name: 'Academic & Professional Journey', category: 'Profile', image_url: posterPhoto },
    { id: 'p-2', title: 'IIT Kharagpur Keynote Address',   event_name: 'Live auditorium lecture',         category: 'University', image_url: seminarPhoto },
    { id: 'p-3', title: 'IBM & Persistent Corporate Workshop', event_name: 'Mindful leadership retreat', category: 'Corporate', image_url: corpPhoto },
    { id: 'p-4', title: 'Youth Mentorship Summit',          event_name: 'Universal Human Values workshop',  category: 'Youth',    image_url: youthPhoto },
  ];

  const allPhotos = photoList.length > 0 ? [...photoList, ...defaultPhotos] : defaultPhotos;
  const categories = ['All', ...Array.from(new Set(allPhotos.map(p => p.category).filter(Boolean)))];
  const filtered = selectedCategory === 'All' ? allPhotos : allPhotos.filter(p => p.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape')       setLightboxIndex(null);
      if (e.key === 'ArrowRight')   setLightboxIndex(i => (i + 1) % filtered.length);
      if (e.key === 'ArrowLeft')    setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, filtered.length]);

  const getImgUrl = (photo) => {
    const driveObj = parseDriveUrl(photo.image_url);
    return driveObj ? driveObj.thumbUrl : photo.image_url;
  };

  const activeLightboxPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold uppercase tracking-wider mb-3">
            <ImageIcon className="w-4 h-4" /> Seminar Photo Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Kadamb Kanan Das in Action Across India
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Gallery of keynote lectures, leadership retreats, and student workshops.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'gradient-saffron text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {filtered.map((photo, idx) => {
            const imgUrl = getImgUrl(photo);
            const isLoaded = loaded[photo.id || idx];

            return (
              <div key={photo.id || idx}
                className="relative break-inside-avoid rounded-2xl overflow-hidden shadow-md group cursor-pointer
                           hover:shadow-2xl hover:shadow-saffron-500/10 transition-all duration-500 bg-slate-900"
                style={{ minHeight: idx % 3 === 0 ? '280px' : idx % 3 === 1 ? '220px' : '320px' }}
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Skeleton loader */}
                {!isLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 animate-pulse" />
                )}

                <img
                  src={imgUrl}
                  alt={photo.title}
                  onLoad={() => setLoaded(prev => ({ ...prev, [photo.id || idx]: true }))}
                  onError={(e) => {
                    e.target.src = seminarPhoto || '/assets/seminar_auditorium.jpg';
                    setLoaded(prev => ({ ...prev, [photo.id || idx]: true }));
                  }}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ transition: 'opacity 0.4s ease, transform 0.7s ease' }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3" /> {photo.category || 'Event Highlight'}
                  </span>
                  <h4 className="font-bold text-base text-white leading-snug">{photo.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{photo.event_name || photo.sub}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" /> View Full
                    </span>
                  </div>
                </div>

                {/* Always-visible category badge */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold bg-saffron-500 text-white px-2 py-0.5 rounded-full shadow">
                    {photo.category || 'Event'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold">No photos in this category yet.</p>
            <p className="text-sm mt-1">Add photos from the Admin Panel.</p>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close */}
          <button className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
            onClick={() => setLightboxIndex(null)}>
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length); }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % filtered.length); }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}>
            <img
              src={getImgUrl(activeLightboxPhoto)}
              alt={activeLightboxPhoto.title}
              onError={(e) => { e.target.src = seminarPhoto || '/assets/seminar_auditorium.jpg'; }}
              className="max-w-full max-h-[72vh] rounded-2xl shadow-2xl object-contain"
            />

            {/* Caption */}
            <div className="text-center">
              <p className="text-white font-bold text-lg">{activeLightboxPhoto.title}</p>
              <p className="text-slate-400 text-sm">{activeLightboxPhoto.event_name}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[10px] bg-saffron-500/20 text-amber-400 font-bold px-3 py-1 rounded-full border border-amber-500/20">
                  {activeLightboxPhoto.category || 'Event'}
                </span>
                <span className="text-[10px] text-slate-500">{lightboxIndex + 1} / {filtered.length}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4">
            {filtered.slice(Math.max(0, lightboxIndex - 2), lightboxIndex + 5).map((p, i) => {
              const actualIdx = Math.max(0, lightboxIndex - 2) + i;
              return (
                <img key={p.id || actualIdx}
                  src={getImgUrl(p)}
                  alt={p.title}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(actualIdx); }}
                  className={`h-12 w-16 object-cover rounded-lg cursor-pointer transition-all shrink-0 ${
                    actualIdx === lightboxIndex
                      ? 'ring-2 ring-saffron-500 opacity-100 scale-110'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .columns-1 > div, .columns-2 > div, .columns-3 > div { display: inline-block; width: 100%; }
      `}</style>
    </section>
  );
}
