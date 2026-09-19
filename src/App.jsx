import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AudioPlayer from './components/AudioPlayer';
import VideoGallery from './components/VideoGallery';
import BlogSection from './components/BlogSection';
import PhotoGallery from './components/PhotoGallery';
import BookingModal from './components/BookingModal';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import VisualEditToolbar from './components/VisualEditToolbar';
import { getLocalData, setLocalData } from './services/supabaseClient';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Visual Editor State
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [visualContent, setVisualContent] = useState(() => getLocalData('visualContent') || {});
  const [hasUnsavedVisuals, setHasUnsavedVisuals] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dynamic Site Data initialized lazily and safely
  const [siteData, setSiteData] = useState(() => ({
    settings: getLocalData('settings') || {
      hero_title: 'Fusing High-Tech Excellence with Timeless Vedic Wisdom',
      hero_lead: 'Empowering corporate enterprises, leadership teams, and university students across India to cultivate stress resilience, mindful focus, and purpose-driven success.',
      email: 'kadambkanan.rns@voicepune.com',
      phone: '+91 9876543210',
      years_service: 12,
      institutions_count: 50,
      impacted_count: 100000,
    },
    audio: getLocalData('audio') || [],
    videos: getLocalData('videos') || [],
    blogs: getLocalData('blogs') || [],
    photos: getLocalData('photos') || [],
    invitations: getLocalData('invitations') || []
  }));

  // User real photo asset references
  const speakerPhoto = '/assets/speaker_photo.jpg';
  const posterPhoto = '/assets/speaker_poster.jpg';
  const seminarPhoto = '/assets/seminar_auditorium.jpg';
  const corpPhoto = '/assets/corporate_workshop.jpg';
  const youthPhoto = '/assets/youth_conclave.jpg';

  const handleUpdateData = (key, value) => {
    setSiteData(prev => ({ ...prev, [key]: value }));
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) setAdminDashboardOpen(true);
    else setAdminLoginOpen(true);
  };

  // Handlers for Visual On-Page Text Editing
  const handleVisualTextChange = (id, newText) => {
    setVisualContent(prev => ({ ...prev, [id]: newText }));
    setHasUnsavedVisuals(true);
  };

  const handleSaveVisualContent = () => {
    setLocalData('visualContent', visualContent);
    setHasUnsavedVisuals(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetVisualContent = () => {
    if (window.confirm('Reset all visual text edits to original defaults?')) {
      setVisualContent({});
      setLocalData('visualContent', {});
      setHasUnsavedVisuals(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-body relative">
      
      {/* Navbar */}
      <Navbar
        onOpenBooking={() => setBookingOpen(true)}
        onOpenAdmin={handleAdminClick}
        isAdminLoggedIn={isAdminLoggedIn}
        isVisualEditMode={isVisualEditMode}
        onToggleVisualEdit={() => setIsVisualEditMode(prev => !prev)}
      />

      {/* Hero Section */}
      <Hero
        settings={siteData.settings}
        speakerPhoto={speakerPhoto}
        onOpenBooking={() => setBookingOpen(true)}
        isEditMode={isVisualEditMode}
        visualContent={visualContent}
        onTextChange={handleVisualTextChange}
      />

      {/* Audio Podcasts Section */}
      <AudioPlayer audioList={siteData.audio} />

      {/* Video Broadcasts Section */}
      <VideoGallery videoList={siteData.videos} />

      {/* Blogs & Wisdom Insights */}
      <BlogSection blogList={siteData.blogs} />

      {/* Photo Gallery (Supports Google Drive Photo Links & Web Images) */}
      <PhotoGallery
        photoList={siteData.photos}
        speakerPhoto={speakerPhoto}
        posterPhoto={posterPhoto}
        seminarPhoto={seminarPhoto}
        corpPhoto={corpPhoto}
        youthPhoto={youthPhoto}
      />

      {/* Rich Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800">
        {/* CTA Band */}
        <div className="gradient-saffron py-14 text-center">
          <p className="text-amber-100 text-xs uppercase font-bold tracking-widest mb-2">Ready to Transform Your Event?</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Bring Purpose & Wisdom to Your Institution</h2>
          <button
            onClick={() => setBookingOpen(true)}
            className="bg-white text-saffron-600 px-8 py-3.5 rounded-full font-extrabold shadow-2xl hover:scale-105 transition-all text-sm"
          >
            Schedule a Speaking Engagement →
          </button>
        </div>

        {/* Footer columns */}
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="brand-signature text-4xl text-amber-400 mb-3">Kadamb Kanan Das</div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Fusing high-tech excellence with timeless Vedic wisdom. Inspiring corporate leaders, university students, and youth across India to live with purpose, clarity, and resilience.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['Ex-Persistent Systems', 'IIT Speaker', 'Vedic Coach', 'Youth Mentor'].map(tag => (
                <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full bg-saffron-500/15 text-amber-400 border border-amber-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Audio Lectures', href: '#audio-lectures' },
                { label: 'Video Library', href: '#video-talks' },
                { label: 'Photo Gallery', href: '#gallery' },
                { label: 'Blogs & Insights', href: '#blogs' },
                { label: 'Book a Session', action: () => setBookingOpen(true) },
              ].map(link => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} className="text-slate-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-saffron-500 shrink-0" /> {link.label}
                    </a>
                  ) : (
                    <button onClick={link.action} className="text-slate-400 hover:text-amber-400 text-sm transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-saffron-500 shrink-0" /> {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Email</p>
                <a href={`mailto:${siteData.settings?.email || 'kadambkanan.rns@gmail.com'}`}
                  className="hover:text-amber-400 transition-colors break-all">
                  {siteData.settings?.email || 'kadambkanan.rns@gmail.com'}
                </a>
              </li>
              <li>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Phone</p>
                <a href={`tel:${siteData.settings?.phone || '+919876543210'}`} className="hover:text-amber-400 transition-colors">
                  {siteData.settings?.phone || '+91 9876543210'}
                </a>
              </li>
              <li>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">For Invitations</p>
                <button onClick={() => setBookingOpen(true)}
                  className="gradient-saffron text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-all mt-1">
                  Send Invitation →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-900 py-5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Kadamb Kanan Das. All Rights Reserved.</p>
            <p className="text-center">
              Spiritual Mentor · Vedic Coach · Ex-Persistent Systems Tech Leader
            </p>
            <p>
              <span className="text-slate-700">Built with ♡ for wisdom & clarity</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Live Visual Edit Toolbar */}
      <VisualEditToolbar
        isEditMode={isVisualEditMode}
        onToggleEditMode={() => setIsVisualEditMode(prev => !prev)}
        onSave={handleSaveVisualContent}
        onReset={handleResetVisualContent}
        hasUnsaved={hasUnsavedVisuals}
        saveSuccess={saveSuccess}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsVisualEditMode(true);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard CMS */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        siteData={siteData}
        onUpdateData={handleUpdateData}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setIsVisualEditMode(false);
          setAdminDashboardOpen(false);
        }}
      />

    </div>
  );
}
