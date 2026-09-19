import React from 'react';
import {
  Award, Mail, Headphones, Calendar, GraduationCap,
  ChevronDown, Users, Globe, BookOpen, Cpu, Flame,
  Star, CheckCircle, Heart, Mic
} from 'lucide-react';
import EditableText from './EditableText';

const DEFAULT_TOPICS = [
  { id: 'top_1', icon: '🧘', title: 'Stress Resilience & Burnout Prevention', desc: 'Vedic tools for managing corporate pressure with inner calm and clarity.' },
  { id: 'top_2', icon: '🎯', title: 'Purpose-Driven Leadership', desc: 'Align personal values with professional goals for sustainable excellence.' },
  { id: 'top_3', icon: '🧠', title: 'Focus, Productivity & Mind Management', desc: 'Ancient wisdom meets modern neuroscience for peak performance.' },
  { id: 'top_4', icon: '❤️', title: 'Emotional Intelligence & Team Harmony', desc: 'Build empathy-driven teams rooted in Vedic interpersonal principles.' },
  { id: 'top_5', icon: '🌱', title: 'Universal Human Values (UHV)', desc: 'Ethical decision-making and value-based living for the modern professional.' },
  { id: 'top_6', icon: '🕉️', title: 'Bhagavad Gita for Corporate Leaders', desc: 'Timeless strategic wisdom from the Gita applied to boardroom challenges.' },
];

const DEFAULT_CREDENTIALS = [
  { id: 'cred_1', icon: Cpu,       label: 'B.E. Information Technology', sub: 'PICT Pune — Top Engineering Institution' },
  { id: 'cred_2', icon: Star,      label: 'Academic Excellence',          sub: 'State Rankholder & AI Project Honors' },
  { id: 'cred_3', icon: Cpu,       label: 'Persistent Systems Alumni',    sub: 'Senior Software Developer · Enterprise Data Warehousing' },
  { id: 'cred_4', icon: BookOpen,  label: 'ISKCON VOICE Faculty',         sub: 'MIT VOICE Project Manager & Senior Youth Counselor' },
  { id: 'cred_5', icon: Globe,     label: 'Youth Leadership & Strategy',  sub: 'Member · All-India ISKCON Youth Council' },
];

const INSTITUTIONS = [
  'MIT WPU Pune', 'MMCOE Pune', 'PICT Pune', 'Sinhgad Institutions',
  'IIT Kharagpur', 'Persistent Systems', 'NETAFIM', 'Corporate & Youth Leadership'
];

export default function Hero({
  settings,
  speakerPhoto,
  onOpenBooking,
  isEditMode,
  visualContent = {},
  onTextChange
}) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative pt-28 pb-10 bg-gradient-to-b from-amber-50/70 via-orange-50/20 to-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* ── Left: Text ── */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-600 text-xs font-bold tracking-wide uppercase">
                <GraduationCap className="w-4 h-4" />
                <EditableText
                  id="hero_badge"
                  value={visualContent.hero_badge}
                  fallback="Ex-Persistent Systems · ISKCON VOICE Faculty · Vedic Coach"
                  isEditMode={isEditMode}
                  onChange={onTextChange}
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-slate-900 leading-tight">
                <EditableText
                  id="hero_title"
                  value={visualContent.hero_title}
                  fallback="Fusing High-Tech Excellence with Timeless Vedic Wisdom"
                  isEditMode={isEditMode}
                  onChange={onTextChange}
                />
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                <EditableText
                  id="hero_lead"
                  value={visualContent.hero_lead}
                  fallback={settings?.hero_lead || 'Empowering corporate teams, university campuses, and youth leaders across India to cultivate stress resilience, mindful focus, and purpose-driven success through Vedic principles.'}
                  isEditMode={isEditMode}
                  onChange={onTextChange}
                />
              </p>

              {/* Quick credentials strip */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'tag_1', default: 'B.E. IT – PICT Pune' },
                  { id: 'tag_2', default: 'Persistent Systems Alumni' },
                  { id: 'tag_3', default: 'ISKCON VOICE Faculty' },
                  { id: 'tag_4', default: 'Youth Leadership Coach' },
                  { id: 'tag_5', default: 'IIT & Corporate Keynotes' }
                ].map(tag => (
                  <span key={tag.id} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    ✓ <EditableText id={tag.id} value={visualContent[tag.id]} fallback={tag.default} isEditMode={isEditMode} onChange={onTextChange} />
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button onClick={onOpenBooking}
                  className="gradient-saffron text-white px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-saffron-500/30 hover:scale-105 transition-all flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Invite for Keynote
                </button>
                <button onClick={() => scrollTo('audio-lectures')}
                  className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-7 py-3.5 rounded-full font-bold transition-all flex items-center gap-2">
                  <Headphones className="w-5 h-5" /> Listen to Podcasts
                </button>
                <button onClick={() => scrollTo('about')}
                  className="text-saffron-600 hover:text-saffron-700 font-bold text-sm flex items-center gap-1 transition-colors">
                  Key Highlights <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-saffron-500" />
                <span className="font-semibold">Direct Email:</span>
                <EditableText
                  id="speaker_email"
                  value={visualContent.speaker_email}
                  fallback={settings?.email || 'kadambkanan.rns@gmail.com'}
                  isEditMode={isEditMode}
                  onChange={onTextChange}
                  className="font-bold text-slate-900 hover:text-saffron-600 transition-colors"
                />
              </div>
            </div>

            {/* ── Right: Photo in seminar context ── */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-saffron-500/30 via-amber-400/20 to-orange-300/10 rounded-3xl blur-sm" />

                {/* Stage/seminar photo - wide cinematic */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                  <img
                    src="/assets/speaker_stage.jpg"
                    alt="Kadamb Kanan Das addressing corporate seminar"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => { e.target.src = speakerPhoto; }}
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-sm">
                      <EditableText id="photo_name_overlay" value={visualContent.photo_name_overlay} fallback="Kadamb Kanan Das" isEditMode={isEditMode} onChange={onTextChange} />
                    </p>
                    <p className="text-amber-400 text-xs font-semibold">
                      <EditableText id="photo_sub_overlay" value={visualContent.photo_sub_overlay} fallback="Keynote Speaker & Vedic Coach · ISKCON VOICE Faculty" isEditMode={isEditMode} onChange={onTextChange} />
                    </p>
                  </div>
                </div>

                {/* Real photo as profile badge */}
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-xl ring-2 ring-saffron-500/30">
                  <img src={speakerPhoto} alt="Kadamb Kanan Das" className="w-full h-full object-cover object-top" />
                </div>

                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-saffron-500/20 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full gradient-saffron text-white flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      <EditableText id="float_stat_title" value={visualContent.float_stat_title} fallback="100,000+ Lives Guided" isEditMode={isEditMode} onChange={onTextChange} />
                    </h4>
                    <p className="text-xs text-slate-500">
                      <EditableText id="float_stat_sub" value={visualContent.float_stat_sub} fallback="IITs · Universities · Corporate Workshops" isEditMode={isEditMode} onChange={onTextChange} />
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {[
              { valId: 'stat_1_val', labelId: 'stat_1_label', defaultVal: '12+', defaultLabel: 'Years Mentorship Experience' },
              { valId: 'stat_2_val', labelId: 'stat_2_label', defaultVal: '50+', defaultLabel: 'Institutions & Companies' },
              { valId: 'stat_3_val', labelId: 'stat_3_label', defaultVal: '100k+', defaultLabel: 'Students & Executives' },
              { valId: 'stat_4_val', labelId: 'stat_4_label', defaultVal: 'Pan-India', defaultLabel: 'Youth Leadership Advocate' },
            ].map(s => (
              <div key={s.valId} className="text-center pt-4 md:pt-0">
                <div className="text-4xl font-extrabold text-amber-400">
                  <EditableText id={s.valId} value={visualContent[s.valId]} fallback={s.defaultVal} isEditMode={isEditMode} onChange={onTextChange} />
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  <EditableText id={s.labelId} value={visualContent[s.labelId]} fallback={s.defaultLabel} isEditMode={isEditMode} onChange={onTextChange} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION (Executive Profile Highlights) ── */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 text-saffron-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Mic className="w-4 h-4" /> About the Speaker
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              <EditableText id="about_heading" value={visualContent.about_heading} fallback="Executive Profile & Key Highlights" isEditMode={isEditMode} onChange={onTextChange} />
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
              <EditableText id="about_subheading" value={visualContent.about_subheading} fallback="A unique synthesis of high-tech engineering background and deep Vedic wisdom — delivering practical, inspiring, and high-impact keynotes for corporate and academic institutions." isEditMode={isEditMode} onChange={onTextChange} />
            </p>
          </div>

          {/* Two-column: Story + Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Executive Highlights */}
            <div className="space-y-5 text-slate-600 leading-relaxed text-[15px]">
              <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                <p className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-saffron-500" />
                  <EditableText id="card1_title" value={visualContent.card1_title} fallback="Technology & Academic Background" isEditMode={isEditMode} onChange={onTextChange} />
                </p>
                <p>
                  <EditableText id="card1_body" value={visualContent.card1_body} fallback="Kadamb Kanan Das completed his B.E. in Information Technology from PICT Pune (one of India's top engineering colleges), earning honors in Artificial Intelligence. He served as a Senior Software Developer at Persistent Systems, delivering enterprise Data Warehousing solutions for US-based Fortune 500 tech clients." isEditMode={isEditMode} onChange={onTextChange} multiline />
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <EditableText id="card2_title" value={visualContent.card2_title} fallback="Corporate & Campus Keynotes" isEditMode={isEditMode} onChange={onTextChange} />
                </p>
                <p>
                  <EditableText id="card2_body" value={visualContent.card2_body} fallback="Drawing on his corporate technology background, he bridges modern industry challenges with ancient Vedic wisdom. His sessions focus on stress resilience, focus, emotional intelligence, and ethical leadership for modern professionals." isEditMode={isEditMode} onChange={onTextChange} multiline />
                </p>
              </div>

              <div className="p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <EditableText id="card3_title" value={visualContent.card3_title} fallback="ISKCON VOICE & Youth Mentorship" isEditMode={isEditMode} onChange={onTextChange} />
                </p>
                <p>
                  <EditableText id="card3_body" value={visualContent.card3_body} fallback="He serves as Project Manager & Counselor at MIT VOICE Pune and is an active member of the ISKCON India Youth Council. Over the past decade, he has guided over 100,000 students and professionals across top institutions." isEditMode={isEditMode} onChange={onTextChange} multiline />
                </p>
              </div>
            </div>

            {/* Credentials + Photo */}
            <div className="space-y-6">
              {/* Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] max-w-sm mx-auto lg:mx-0">
                <img src={speakerPhoto} alt="Kadamb Kanan Das" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-white font-extrabold text-xl brand-signature">
                    <EditableText id="about_photo_name" value={visualContent.about_photo_name} fallback="Kadamb Kanan Das" isEditMode={isEditMode} onChange={onTextChange} />
                  </p>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <EditableText id="about_photo_title" value={visualContent.about_photo_title} fallback="Spiritual Mentor · Vedic Coach" isEditMode={isEditMode} onChange={onTextChange} />
                  </p>
                </div>
              </div>

              {/* Credentials grid */}
              <div className="grid grid-cols-1 gap-3">
                {DEFAULT_CREDENTIALS.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-saffron-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-saffron-500/10 flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-saffron-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        <EditableText id={`${c.id}_label`} value={visualContent[`${c.id}_label`]} fallback={c.label} isEditMode={isEditMode} onChange={onTextChange} />
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        <EditableText id={`${c.id}_sub`} value={visualContent[`${c.id}_sub`]} fallback={c.sub} isEditMode={isEditMode} onChange={onTextChange} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keynote Topics */}
          <div className="mb-14">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">
              <EditableText id="topics_heading" value={visualContent.topics_heading} fallback="Keynote & Workshop Topics for Corporate & Campus Events" isEditMode={isEditMode} onChange={onTextChange} />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEFAULT_TOPICS.map((t) => (
                <div key={t.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-saffron-500/30 transition-all group">
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-saffron-600 transition-colors mb-2">
                    <EditableText id={`${t.id}_title`} value={visualContent[`${t.id}_title`]} fallback={t.title} isEditMode={isEditMode} onChange={onTextChange} />
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    <EditableText id={`${t.id}_desc`} value={visualContent[`${t.id}_desc`]} fallback={t.desc} isEditMode={isEditMode} onChange={onTextChange} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutions served */}
          <div className="bg-slate-900 rounded-3xl p-8">
            <h3 className="text-white font-extrabold text-xl text-center mb-6 flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <EditableText id="inst_heading" value={visualContent.inst_heading} fallback="Institutions & Organizations Addressed" isEditMode={isEditMode} onChange={onTextChange} />
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {INSTITUTIONS.map((inst, idx) => (
                <span key={idx} className="text-sm font-semibold bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  <EditableText id={`inst_${idx}`} value={visualContent[`inst_${idx}`]} fallback={inst} isEditMode={isEditMode} onChange={onTextChange} />
                </span>
              ))}
            </div>
            <div className="text-center mt-8">
              <button onClick={onOpenBooking}
                className="gradient-saffron text-white px-8 py-3.5 rounded-full font-bold shadow-xl hover:scale-105 transition-all">
                Invite Kadamb Kanan Das to Your Event →
              </button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
