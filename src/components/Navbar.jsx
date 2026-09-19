import React, { useState, useEffect } from 'react';
import { Calendar, Headphones, Video, BookOpen, Image as ImageIcon, Lock, Edit3 } from 'lucide-react';

export default function Navbar({
  onOpenBooking,
  onOpenAdmin,
  isAdminLoggedIn,
  isVisualEditMode,
  onToggleVisualEdit
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/80 backdrop-blur-sm py-4'
    } border-b border-saffron-500/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Signature Logo */}
        <div onClick={() => scrollTo('hero')} className="cursor-pointer group flex flex-col">
          <span className="brand-signature text-3xl font-bold text-saffron-500 group-hover:text-saffron-600 transition-colors">
            Kadamb Kanan Das
          </span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 -mt-1">
            Vedic Coach & Keynote Speaker
          </span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-800">
          <button onClick={() => scrollTo('about')} className="hover:text-saffron-500 transition-colors">About</button>
          <button onClick={() => scrollTo('audio-lectures')} className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <Headphones className="w-4 h-4 text-saffron-500" /> Audio Podcasts
          </button>
          <button onClick={() => scrollTo('video-talks')} className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <Video className="w-4 h-4 text-saffron-500" /> Videos
          </button>
          <button onClick={() => scrollTo('blogs')} className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-saffron-500" /> Blogs
          </button>
          <button onClick={() => scrollTo('gallery')} className="hover:text-saffron-500 transition-colors flex items-center gap-1">
            <ImageIcon className="w-4 h-4 text-saffron-500" /> Gallery
          </button>
        </div>

        {/* Actions: Admin Panel, Visual Live Edit & Invite CTA */}
        <div className="flex items-center space-x-3">
          {/* Visual Live Editor Button */}
          <button
            onClick={onToggleVisualEdit}
            className={`px-3 py-1.5 rounded-full border transition-all text-xs font-bold flex items-center gap-1.5 ${
              isVisualEditMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Toggle Live Visual Text Editing"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isVisualEditMode ? 'Visual Editor ON' : 'Visual Edit'}</span>
          </button>

          {/* Admin CMS Button */}
          <button 
            onClick={onOpenAdmin}
            className={`p-2 rounded-full border transition-all text-xs font-semibold flex items-center gap-1.5 ${
              isAdminLoggedIn 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' 
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Admin CMS Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'CMS Dashboard' : 'CMS Login'}</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="gradient-saffron text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Invite Speaker</span>
          </button>
        </div>

      </div>
    </nav>
  );
}
