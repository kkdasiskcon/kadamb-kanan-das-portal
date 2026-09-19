# Complete Setup Guide: Supabase, Resend & Vercel ($0/month)

Follow these simple steps to connect your free database, automated emailing, and publish `www.kadambkanandas.com`.

---

## 1. Supabase Database Setup (Free PostgreSQL)

1. Go to **[supabase.com](https://supabase.com)** and sign up for a free account.
2. Click **New Project** -> Name: `kadamb-kanan-das-portal` -> Set a password -> Click **Create**.
3. Once loaded, click on the **SQL Editor** tab on the left sidebar (`< / >`).
4. Copy the entire contents of **[schema.sql](file:///C:/Users/Kadamb%20Kanan%20Das%20RNS/.gemini/antigravity/scratch/kadamb-kanan-das-portal/schema.sql)**.
5. Paste into the SQL Editor and click **RUN**.
6. Go to **Project Settings** -> **API**:
   - Copy `Project URL`
   - Copy `anon public Key`

---

## 2. Automated Dual Email Setup (Resend API - Free 3,000 Emails/month)

1. Sign up at **[resend.com](https://resend.com)** (Free).
2. Click **API Keys** -> **Create API Key**.
3. Copy the key starting with `re_...`.

*(When someone submits the "Invite Speaker" form, you get an email at `kadambkanan.rns@gmail.com` AND the organizer receives an automated thank-you reply!)*

---

## 3. Environment Variables Configuration

Create a file named `.env.local` inside your project folder:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_RESEND_API_KEY=re_1234567890abcdef
```

---

## 4. Free Deployment to Vercel (`www.kadambkanandas.com`)

1. Upload/Push this folder `kadamb-kanan-das-portal` to GitHub.
2. Go to **[vercel.com](https://vercel.com)** -> Click **Add New Project**.
3. Select your GitHub repository.
4. Under **Environment Variables**, paste:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RESEND_API_KEY`
5. Click **Deploy**!
6. In Vercel Project Settings -> **Domains**, add `www.kadambkanandas.com`.

---

## 5. How to Update Content via Admin CMS Panel

1. Open your live website `www.kadambkanandas.com` (or `http://localhost:3000`).
2. Click **CMS Login** in the top navbar.
3. Password: `admin123` or `kadamb2026`.
4. Add your real **Google Drive Audio Links**, **YouTube Video IDs**, **Blogs**, and manage **Event Invitations**!
