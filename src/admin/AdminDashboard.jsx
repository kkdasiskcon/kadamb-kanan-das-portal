import React, { useState } from 'react';
import { Settings, Headphones, Video, BookOpen, Inbox, Image as ImageIcon, Plus, Save, Trash2, Edit, CheckCircle, LogOut, X } from 'lucide-react';
import { setLocalData } from '../services/supabaseClient';
import { autoDetectDuration } from '../services/mediaHelper';

export default function AdminDashboard({ isOpen, onClose, siteData, onUpdateData, onLogout }) {
  const [activeTab, setActiveTab] = useState('settings');

  // Master Data State
  const [settings, setSettings] = useState(siteData.settings);
  const [audioList, setAudioList] = useState(siteData.audio);
  const [videoList, setVideoList] = useState(siteData.videos);
  const [blogList, setBlogList] = useState(siteData.blogs);
  const [photoList, setPhotoList] = useState(siteData.photos || []);
  const [invitations, setInvitations] = useState(siteData.invitations);

  // Edit Item State
  const [editingItem, setEditingItem] = useState(null);

  // Add Form States (No manual duration typing required!)
  const [newAudio, setNewAudio] = useState({ title: '', category: 'Youth Focus', drive_url: '' });
  const [newVideo, setNewVideo] = useState({ title: '', video_url: '', category: 'University Keynote' });
  const [newPhoto, setNewPhoto] = useState({ title: '', image_url: '', event_name: 'Seminar Highlight', category: 'Seminar' });
  const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '' });

  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // 1. SAVE SETTINGS
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLocalData('settings', settings);
    onUpdateData('settings', settings);
    showToast('Hero & Contact Settings updated!');
  };

  // 2. AUDIO PODCASTS (ADD & EDIT)
  // 2. AUDIO PODCASTS (ADD & EDIT)
  const handleAddAudio = async (e) => {
    e.preventDefault();
    if (!newAudio.title || !newAudio.drive_url) return;
    
    showToast('Auto-detecting media stream duration...');
    const autoDur = await autoDetectDuration(newAudio.drive_url);
    
    const item = {
      id: 'aud-' + Date.now(),
      title: newAudio.title,
      category: newAudio.category,
      drive_url: newAudio.drive_url,
      duration: autoDur !== 'Auto' ? autoDur : (newAudio.duration || 'Drive Stream'),
      views: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...audioList];
    setAudioList(updated);
    setLocalData('audio', updated);
    onUpdateData('audio', updated);
    setNewAudio({ title: '', category: 'Youth Focus', drive_url: '', duration: '' });
    showToast(`New Audio Podcast added! (Duration: ${item.duration})`);
  };

  const handleUpdateAudio = async (updatedItem) => {
    let itemToSave = { ...updatedItem };
    if (!itemToSave.duration || itemToSave.duration === 'Drive Stream' || itemToSave.duration === 'Auto') {
      const autoDur = await autoDetectDuration(itemToSave.drive_url);
      if (autoDur !== 'Auto') itemToSave.duration = autoDur;
    }

    const updated = audioList.map(a => a.id === itemToSave.id ? itemToSave : a);
    setAudioList(updated);
    setLocalData('audio', updated);
    onUpdateData('audio', updated);
    setEditingItem(null);
    showToast('Audio Podcast updated successfully!');
  };

  const handleDeleteAudio = (id) => {
    const updated = audioList.filter(a => a.id !== id);
    setAudioList(updated);
    setLocalData('audio', updated);
    onUpdateData('audio', updated);
    showToast('Audio deleted');
  };

  // 3. VIDEO BROADCASTS (ADD & EDIT)
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.video_url) return;

    showToast('Auto-detecting video duration...');
    const autoDur = await autoDetectDuration(newVideo.video_url);

    const item = {
      id: 'vid-' + Date.now(),
      title: newVideo.title,
      category: newVideo.category,
      duration: autoDur !== 'Auto' ? autoDur : (newVideo.duration || 'Auto Duration'),
      drive_url: newVideo.video_url,
      youtube_id: newVideo.video_url,
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...videoList];
    setVideoList(updated);
    setLocalData('videos', updated);
    onUpdateData('videos', updated);
    setNewVideo({ title: '', video_url: '', category: 'University Keynote', duration: '' });
    showToast(`New Video Broadcast added! (Duration: ${item.duration})`);
  };

  const handleUpdateVideo = async (updatedItem) => {
    let itemToSave = { ...updatedItem };
    if (!itemToSave.duration || itemToSave.duration === 'Auto Duration') {
      const autoDur = await autoDetectDuration(itemToSave.drive_url || itemToSave.youtube_id);
      if (autoDur !== 'Auto') itemToSave.duration = autoDur;
    }

    const updated = videoList.map(v => v.id === itemToSave.id ? itemToSave : v);
    setVideoList(updated);
    setLocalData('videos', updated);
    onUpdateData('videos', updated);
    setEditingItem(null);
    showToast('Video updated successfully!');
  };

  const handleDeleteVideo = (id) => {
    const updated = videoList.filter(v => v.id !== id);
    setVideoList(updated);
    setLocalData('videos', updated);
    onUpdateData('videos', updated);
    showToast('Video deleted');
  };

  // 4. PHOTO GALLERY (ADD & EDIT)
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.image_url) return;
    const item = { id: 'ph-' + Date.now(), ...newPhoto, created_at: new Date().toISOString().split('T')[0] };
    const updated = [item, ...photoList];
    setPhotoList(updated);
    setLocalData('photos', updated);
    onUpdateData('photos', updated);
    setNewPhoto({ title: '', image_url: '', event_name: 'Seminar Highlight', category: 'Seminar' });
    showToast('New Photo added to Gallery!');
  };

  const handleUpdatePhoto = (updatedItem) => {
    const updated = photoList.map(p => p.id === updatedItem.id ? updatedItem : p);
    setPhotoList(updated);
    setLocalData('photos', updated);
    onUpdateData('photos', updated);
    setEditingItem(null);
    showToast('Photo details updated!');
  };

  const handleDeletePhoto = (id) => {
    const updated = photoList.filter(p => p.id !== id);
    setPhotoList(updated);
    setLocalData('photos', updated);
    onUpdateData('photos', updated);
    showToast('Photo deleted');
  };

  // 5. BLOGS & ARTICLES (ADD & EDIT)
  const handleAddBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;
    const item = {
      id: 'b-' + Date.now(),
      ...newBlog,
      slug: newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      cover_image: '/assets/seminar_auditorium.jpg',
      published: true,
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [item, ...blogList];
    setBlogList(updated);
    setLocalData('blogs', updated);
    onUpdateData('blogs', updated);
    setNewBlog({ title: '', excerpt: '', content: '' });
    showToast('New Blog Article published!');
  };

  const handleUpdateBlog = (updatedItem) => {
    const updated = blogList.map(b => b.id === updatedItem.id ? updatedItem : b);
    setBlogList(updated);
    setLocalData('blogs', updated);
    onUpdateData('blogs', updated);
    setEditingItem(null);
    showToast('Blog updated successfully!');
  };

  // Update Invitation Status
  const handleUpdateInvStatus = (id, newStatus) => {
    const updated = invitations.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv);
    setInvitations(updated);
    setLocalData('invitations', updated);
    onUpdateData('invitations', updated);
    showToast(`Invitation marked as ${newStatus}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-saffron text-white flex items-center justify-center font-bold">
              K
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Kadamb Kanan Das - Full CMS Panel</h3>
              <p className="text-xs text-amber-400">Add & Edit Podcasts, Videos, Gallery Photos, Blogs & Invitations</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white py-2 px-4 text-xs font-bold text-center">
            {toastMsg}
          </div>
        )}

        {/* Sidebar & Content */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'settings' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Settings className="w-4 h-4" /> Hero & Site Settings
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'audio' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Headphones className="w-4 h-4" /> Audio Podcasts ({audioList.length})
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'videos' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Video className="w-4 h-4" /> Video Broadcasts ({videoList.length})
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'photos' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Photo Gallery ({photoList.length})
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'blogs' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Blogs & Articles ({blogList.length})
            </button>

            <button
              onClick={() => setActiveTab('invitations')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all ${
                activeTab === 'invitations' ? 'gradient-saffron text-white shadow-md' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Inbox className="w-4 h-4" /> Event Invitations ({invitations.length})
            </button>
          </div>

          {/* Main Tab Panels */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            
            {/* 1. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
                <h4 className="text-lg font-bold text-slate-900 border-b pb-2">Hero & Contact Info</h4>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Main Title / Headline</label>
                  <input
                    type="text"
                    value={settings.hero_title || ''}
                    onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                    placeholder="e.g. Fusing High-Tech Excellence with Timeless Vedic Wisdom"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 outline-none mb-3"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Hero Lead Paragraph</label>
                  <textarea
                    rows="3"
                    value={settings.hero_lead}
                    onChange={(e) => setSettings({ ...settings, hero_lead: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:border-saffron-500 outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Speaker Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="gradient-saffron text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </form>
            )}

            {/* 2. AUDIO PODCASTS TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <form onSubmit={handleAddAudio} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Plus className="w-4 h-4 text-saffron-500" /> Add Google Drive Audio Stream</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Lecture Title (e.g. Science of Mind Control)"
                      required
                      value={newAudio.title}
                      onChange={(e) => setNewAudio({ ...newAudio, title: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                    <select
                      value={newAudio.category}
                      onChange={(e) => setNewAudio({ ...newAudio, category: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    >
                      <option value="Youth Focus">Youth Focus</option>
                      <option value="Corporate Executive">Corporate Executive</option>
                      <option value="Vedic Science">Vedic Science</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste Google Drive Audio Link (e.g. https://drive.google.com/file/d/.../view)"
                    required
                    value={newAudio.drive_url}
                    onChange={(e) => setNewAudio({ ...newAudio, drive_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <button type="submit" className="gradient-saffron text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Publish Audio Podcast
                  </button>
                </form>

                <div className="space-y-2">
                  {audioList.map((item) => (
                    <div key={item.id} className="p-3 border rounded-xl flex items-center justify-between bg-white text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="ml-2 bg-saffron-100 text-saffron-800 px-2 py-0.5 rounded-full font-semibold">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingItem({ type: 'audio', data: { ...item } })} className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteAudio(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. VIDEO BROADCASTS TAB */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <form onSubmit={handleAddVideo} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Plus className="w-4 h-4 text-saffron-500" /> Add Google Drive Video Link or YouTube Video</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Video Title"
                      required
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                    <select
                      value={newVideo.category}
                      onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    >
                      <option value="University Keynote">University Keynote</option>
                      <option value="Corporate Seminar">Corporate Seminar</option>
                      <option value="Youth Workshop">Youth Workshop</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Paste Google Drive Video Link (e.g. https://drive.google.com/file/d/1BqdEwcVS-dJvn0dgxDEGXO6QUK5OMYlQ/view) or YouTube ID"
                    required
                    value={newVideo.video_url}
                    onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <button type="submit" className="gradient-saffron text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Video Broadcast
                  </button>
                </form>

                <div className="space-y-2">
                  {videoList.map((item) => (
                    <div key={item.id} className="p-3 border rounded-xl flex items-center justify-between bg-white text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingItem({ type: 'video', data: { ...item } })} className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteVideo(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PHOTO GALLERY TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <form onSubmit={handleAddPhoto} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5"><Plus className="w-4 h-4 text-saffron-500" /> Add Photo to Gallery (Google Drive / Web Image)</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Photo Title (e.g. IIT Kharagpur Keynote)"
                      required
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Event Subtitle"
                      value={newPhoto.event_name}
                      onChange={(e) => setNewPhoto({ ...newPhoto, event_name: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Paste Google Drive Photo Link (e.g. https://drive.google.com/file/d/.../view) or Direct Image URL"
                    required
                    value={newPhoto.image_url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <button type="submit" className="gradient-saffron text-white px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Photo to Gallery
                  </button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photoList.map((p) => (
                    <div key={p.id} className="p-3 border rounded-xl bg-white text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">{p.title}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingItem({ type: 'photo', data: { ...p } })} className="text-amber-600 hover:bg-amber-50 p-1 rounded">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeletePhoto(p.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                <form onSubmit={handleAddBlog} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-slate-900"><Plus className="w-4 h-4 text-saffron-500 inline mr-1" /> Create Wisdom Article / Blog</h5>
                  <input
                    type="text"
                    placeholder="Article Title"
                    required
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Short Excerpt Summary"
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                  />
                  <textarea
                    rows="3"
                    placeholder="Article Body Content..."
                    required
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-none"
                  ></textarea>
                  <button type="submit" className="gradient-saffron text-white px-5 py-2 rounded-xl font-bold text-xs">
                    Publish Blog Post
                  </button>
                </form>

                <div className="space-y-2">
                  {blogList.map((b) => (
                    <div key={b.id} className="p-3 border rounded-xl bg-white text-xs flex items-center justify-between font-bold text-slate-900">
                      <span>{b.title}</span>
                      <button onClick={() => setEditingItem({ type: 'blog', data: { ...b } })} className="text-amber-600 hover:bg-amber-50 p-1 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. EVENT INVITATIONS TAB */}
            {activeTab === 'invitations' && (
              <div className="space-y-4">
                <h4 className="font-bold text-base text-slate-900">Incoming Event Invitations</h4>
                {invitations.map((inv) => (
                  <div key={inv.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900 text-sm">{inv.org_name} — <span className="text-saffron-600">{inv.event_type}</span></h5>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        inv.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>{inv.status}</span>
                    </div>
                    <p className="text-xs text-slate-600"><strong>Contact:</strong> {inv.contact_name} ({inv.contact_email} | {inv.contact_phone})</p>
                    <p className="text-xs text-slate-600"><strong>Requested Date:</strong> {inv.event_date || 'Flexible'} | <strong>Audience:</strong> {inv.audience_size}</p>
                    <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">{inv.notes || 'No extra notes provided.'}</p>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleUpdateInvStatus(inv.id, 'Acknowledged')}
                        className="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600"
                      >
                        Mark Acknowledged
                      </button>
                      <button
                        onClick={() => handleUpdateInvStatus(inv.id, 'Confirmed')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                      >
                        Confirm Event
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* EDIT MODAL DIALOG */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-900 text-base">Modify {editingItem.type.toUpperCase()} Link / Title</h4>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {/* Edit Audio Form */}
            {editingItem.type === 'audio' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Audio Title</label>
                <input
                  type="text"
                  value={editingItem.data.title}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Title"
                />
                <label className="block text-xs font-bold text-slate-700">Google Drive Audio Link</label>
                <input
                  type="text"
                  value={editingItem.data.drive_url}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, drive_url: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Google Drive Audio Link"
                />
                <button
                  onClick={() => handleUpdateAudio(editingItem.data)}
                  className="w-full gradient-saffron text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Save Audio Link Changes
                </button>
              </div>
            )}

            {/* Edit Video Form */}
            {editingItem.type === 'video' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Video Title</label>
                <input
                  type="text"
                  value={editingItem.data.title}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Title"
                />
                <label className="block text-xs font-bold text-slate-700">Google Drive Video Link or YouTube ID</label>
                <input
                  type="text"
                  value={editingItem.data.drive_url || editingItem.data.youtube_id || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, drive_url: e.target.value, youtube_id: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Google Drive Link or YouTube ID"
                />
                <button
                  onClick={() => handleUpdateVideo(editingItem.data)}
                  className="w-full gradient-saffron text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Save Video Link Changes
                </button>
              </div>
            )}

            {/* Edit Photo Form */}
            {editingItem.type === 'photo' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Photo Title</label>
                <input
                  type="text"
                  value={editingItem.data.title}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Title"
                />
                <label className="block text-xs font-bold text-slate-700">Google Drive Photo Link</label>
                <input
                  type="text"
                  value={editingItem.data.image_url}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image_url: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                  placeholder="Google Drive Photo Link"
                />
                <button
                  onClick={() => handleUpdatePhoto(editingItem.data)}
                  className="w-full gradient-saffron text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Save Photo Link Changes
                </button>
              </div>
            )}

            {/* Edit Blog Form */}
            {editingItem.type === 'blog' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingItem.data.title}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                  className="w-full px-3 py-2 border rounded-xl text-xs outline-none"
                />
                <textarea
                  rows="4"
                  value={editingItem.data.content}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, content: e.target.value } })}
                  className="w-full p-3 border rounded-xl text-xs outline-none"
                ></textarea>
                <button
                  onClick={() => handleUpdateBlog(editingItem.data)}
                  className="w-full gradient-saffron text-white py-2.5 rounded-xl font-bold text-xs"
                >
                  Save Blog Changes
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
