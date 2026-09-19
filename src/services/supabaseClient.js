import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let client = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn('Supabase client initialization warning:', e);
}

export const supabase = client;

// Helper to check if live Supabase is active
export const isSupabaseConfigured = () => Boolean(supabase);

// Fetch data seamlessly from Supabase DB or LocalStorage
export const fetchTableData = async (tableName) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn(`Supabase fetch failed for ${tableName}, falling back to LocalStorage`, e);
    }
  }

  return getLocalData(tableName);
};

// Insert / Save data seamlessly
export const saveTableData = async (tableName, record) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(tableName).insert([record]).select();
      if (!error) return data;
    } catch (e) {
      console.warn(`Supabase insert failed for ${tableName}`, e);
    }
  }

  // LocalStorage Fallback
  const current = getLocalData(tableName);
  const updated = [record, ...(Array.isArray(current) ? current : [])];
  setLocalData(tableName, updated);
  return updated;
};

// Initial Mock Seed Data
const initialData = {
  settings: {
    hero_title: 'Fusing High-Tech Excellence with Timeless Vedic Wisdom',
    hero_lead: 'Empowering corporate enterprises, leadership teams, and university students across India to cultivate stress resilience, mindful focus, and purpose-driven success.',
    email: 'kadambkanan.rns@gmail.com',
    phone: '+91 9876543210',
    years_service: 12,
    institutions_count: 50,
    impacted_count: 100000,
  },
  audio: [
    {
      id: 'aud-1',
      title: 'Science of Mind Control & Overcoming Anxiety',
      category: 'Youth Focus',
      drive_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: '45:00',
      views: 3420,
      created_at: '2026-09-10'
    },
    {
      id: 'aud-2',
      title: 'Mindful Leadership under High Corporate Stress',
      category: 'Corporate Executive',
      drive_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: '38:15',
      views: 2890,
      created_at: '2026-09-05'
    },
    {
      id: 'aud-3',
      title: 'Universal Human Values - Wisdom Eye Principles',
      category: 'Vedic Science',
      drive_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: '52:40',
      views: 5120,
      created_at: '2026-08-28'
    }
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Keynote Address at IIT Kharagpur Conclave',
      youtube_id: 'dQw4w9WgXcQ',
      category: 'University Keynote',
      duration: '24:30',
      created_at: '2026-09-12'
    },
    {
      id: 'vid-2',
      title: 'Executive Wellness & Karma Mechanics at IBM',
      youtube_id: 'L_LUpnjgPso',
      category: 'Corporate Seminar',
      duration: '32:10',
      created_at: '2026-08-15'
    }
  ],
  blogs: [
    {
      id: 'b-1',
      title: 'Rewiring Attention in the Smartphone Era',
      slug: 'rewiring-attention-smartphone-era',
      excerpt: 'How modern professionals and Gen-Z students can reclaim deep focus using ancient Vedic meditation techniques.',
      content: 'In today’s hyper-connected digital landscape, attention is our most valuable asset. The ancient Bhagavad Gita explains that an uncontrolled mind is one’s worst enemy...',
      cover_image: '/assets/seminar_auditorium.jpg',
      published: true,
      created_at: '2026-09-14'
    },
    {
      id: 'b-2',
      title: 'Mindful Leadership & Stress-Free Productivity',
      slug: 'mindful-leadership-stress-free-productivity',
      excerpt: 'Lessons from 12+ years of Vedic coaching and corporate tech leadership at IBM & Persistent Systems.',
      content: 'True leadership is not merely managing deadlines; it is managing one’s internal state under high pressure...',
      cover_image: '/assets/corporate_workshop.jpg',
      published: true,
      created_at: '2026-09-01'
    }
  ],
  photos: [],
  invitations: [
    {
      id: 'inv-1',
      org_name: 'IIT Kharagpur Techfest',
      event_type: 'College Youth Conclave',
      contact_name: 'Ananya Sharma',
      contact_email: 'ananya@iitkgp.ac.in',
      contact_phone: '+91 9876501234',
      event_date: '2026-10-15',
      audience_size: '500 - 2000+ Attendees',
      notes: 'Keynote speech on Purpose & Mind Mastery for Engineering Students.',
      status: 'Acknowledged',
      created_at: '2026-09-18'
    }
  ]
};

export const getLocalData = (key) => {
  try {
    const data = localStorage.getItem(`kkd_${key}`);
    if (!data || data === 'undefined' || data === 'null') {
      const defaultValue = initialData[key] || [];
      localStorage.setItem(`kkd_${key}`, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (e) {
    console.warn(`Error reading localStorage for key kkd_${key}:`, e);
    return initialData[key] || [];
  }
};

export const setLocalData = (key, value) => {
  try {
    localStorage.setItem(`kkd_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error setting localStorage for key kkd_${key}:`, e);
  }
};
