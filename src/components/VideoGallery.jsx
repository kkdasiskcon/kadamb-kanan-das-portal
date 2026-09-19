import React, { useState } from 'react';
import { Video, Play, X, Film, Clock, Eye, ExternalLink } from 'lucide-react';
import { parseDriveUrl, parseYouTubeId } from '../services/mediaHelper';

const CAT_COLORS = {
  'University Keynote':  { bg: 'bg-blue-500/10',   text: 'text-blue-600',   dot: '#3b82f6' },
  'Corporate Keynote':   { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: '#10b981' },
  'Youth Conclave':      { bg: 'bg-orange-500/10',  text: 'text-orange-600', dot: '#f97316' },
  'Vedic Science':       { bg: 'bg-purple-500/10',  text: 'text-purple-600', dot: '#8b5cf6' },
  'Leadership Retreat':  { bg: 'bg-rose-500/10',    text: 'text-rose-600',   dot: '#f43f5e' },
};
const DEF_CAT = { bg: 'bg-saffron-500/10', text: 'text-saffron-600', dot: '#f97316' };

// Generate a beautiful gradient thumbnail for Drive videos
function DriveThumbnailFallback({ title, category }) {
  const cat = CAT_COLORS[category] || DEF_CAT;
  const initials = (title || 'V').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const gradients = {
    'University Keynote':  'from-blue-900 via-blue-800 to-cyan-900',
    'Corporate Keynote':   'from-emerald-900 via-teal-800 to-slate-900',
    'Youth Conclave':      'from-orange-900 via-amber-800 to-rose-900',
    'Vedic Science':       'from-purple-900 via-violet-800 to-indigo-900',
    'Leadership Retreat':  'from-rose-900 via-pink-800 to-purple-900',
  };
  const gradient = gradients[category] || 'from-slate-900 via-saffron-900/40 to-slate-900';
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3`}>
      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <span className="text-white text-2xl font-black">{initials}</span>
      </div>
      <div className="text-center px-4">
        <p className="text-white/80 text-xs font-semibold truncate max-w-[200px]">{title}</p>
        <p className="text-white/50 text-[10px] mt-0.5">Google Drive Video</p>
      </div>
    </div>
  );
}

export default function VideoGallery({ videoList = [] }) {
  const [activeVideo, setActiveVideo]   = useState(null);
  const [selectedCat, setSelectedCat]  = useState('All');
  const [thumbErrors, setThumbErrors]  = useState({});

  const categories = ['All', ...Array.from(new Set(videoList.map(v => v.category).filter(Boolean)))];
  const filtered = selectedCat === 'All' ? videoList : videoList.filter(v => v.category === selectedCat);

  const getVideoMeta = (video) => {
    const ytId    = parseYouTubeId(video.youtube_id || video.drive_url);
    const driveObj = parseDriveUrl(video.drive_url || video.youtube_id);
    const thumbUrl = ytId
      ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
      : (driveObj ? driveObj.thumbUrl : null);
    return { ytId, driveObj, thumbUrl };
  };

  return (
    <section id="video-talks" className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #f97316 0%, transparent 60%), radial-gradient(circle at 70% 50%, #3b82f6 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Film className="w-4 h-4" /> Video Library
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Keynotes & Seminar Video Broadcasts
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Watch recorded keynote speeches from top institutions across India.
          </p>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCat === cat
                      ? 'gradient-saffron text-white shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Video Grid */}
        {filtered.length > 0 ? (
          <div className={`grid gap-6 ${filtered.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filtered.map((video, idx) => {
              const { ytId, driveObj, thumbUrl } = getVideoMeta(video);
              const hasThumbError = thumbErrors[video.id];
              const cat = CAT_COLORS[video.category] || DEF_CAT;
              const source = ytId ? 'YouTube' : 'Google Drive';

              return (
                <div key={video.id}
                  onClick={() => setActiveVideo({ ...video, ytId, driveObj })}
                  className="group relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer
                             border border-slate-800 hover:border-saffron-500/40
                             shadow-xl hover:shadow-2xl hover:shadow-saffron-500/10
                             transition-all duration-500"
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 sm:h-64 overflow-hidden bg-slate-800">
                    {thumbUrl && !hasThumbError ? (
                      <img
                        src={thumbUrl}
                        alt={video.title}
                        onError={() => setThumbErrors(prev => ({ ...prev, [video.id]: true }))}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                      />
                    ) : (
                      <DriveThumbnailFallback title={video.title} category={video.category} />
                    )}

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30
                                      flex items-center justify-center
                                      group-hover:scale-110 group-hover:bg-saffron-500 transition-all duration-300 shadow-2xl">
                        <Play className="w-7 h-7 text-white ml-1" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-950/90 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {video.duration || 'Watch'}
                    </div>

                    {/* Source badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        ytId ? 'bg-red-600 text-white' : 'bg-slate-800/90 text-slate-300 border border-slate-700'
                      }`}>
                        {ytId ? '▶ YouTube' : '☁ Drive'}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
                        {video.category || 'Keynote'}
                      </span>
                      {video.views && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {video.views}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-amber-400 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">{video.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
                      <span className="text-xs text-slate-500">{source}</span>
                      {video.drive_url && (
                        <a href={video.drive_url} target="_blank" rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 ml-auto transition-colors">
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <Film className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="font-semibold text-slate-400">No videos in this category yet.</p>
            <p className="text-sm mt-1">Add video broadcasts from the Admin Panel.</p>
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={e => e.stopPropagation()}>

            {/* Close button */}
            <button onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg">
              <X className="w-5 h-5" />
            </button>

            {/* Player */}
            <div className="aspect-video w-full bg-black">
              {activeVideo.ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.ytId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeVideo.driveObj ? (
                <iframe
                  src={activeVideo.driveObj.previewUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-900 p-6 text-center gap-4">
                  <Film className="w-14 h-14 text-saffron-500" />
                  <h4 className="text-xl font-bold">{activeVideo.title}</h4>
                  {activeVideo.drive_url && (
                    <a href={activeVideo.drive_url} target="_blank" rel="noreferrer"
                      className="gradient-saffron text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                      Open in Google Drive <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-base">{activeVideo.title}</h4>
                {activeVideo.description && (
                  <p className="text-slate-400 text-sm mt-1">{activeVideo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  (CAT_COLORS[activeVideo.category] || DEF_CAT).bg
                } ${(CAT_COLORS[activeVideo.category] || DEF_CAT).text}`}>
                  {activeVideo.category}
                </span>
                {activeVideo.drive_url && (
                  <a href={activeVideo.drive_url} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-amber-700 text-amber-400 hover:text-white flex items-center justify-center transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
