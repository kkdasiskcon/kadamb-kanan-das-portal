/**
 * Local Proxy & Direct Gmail SMTP Server (port 3001)
 * 1) Audio Proxy for Google Drive streaming
 * 2) Google Workspace Gmail SMTP Direct Mail Dispatcher (kadambkanan.rns@voicepune.com)
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const PORT = 3001;

// Load .env file variables into process.env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...val] = trimmed.split('=');
      if (key && val.length) {
        process.env[key.trim()] = val.join('=').trim();
      }
    }
  });
}

function fetchWithRedirects(targetUrl, passHeaders, res, redirectCount = 0) {
  if (redirectCount > 12) {
    if (!res.headersSent) { res.writeHead(500); res.end('Too many redirects'); }
    return;
  }

  let parsed;
  try { parsed = new URL(targetUrl); } catch {
    if (!res.headersSent) { res.writeHead(400); res.end('Bad URL'); }
    return;
  }

  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'audio/*,*/*;q=0.9',
      ...passHeaders,
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
      let loc = proxyRes.headers.location;
      if (!loc.startsWith('http')) loc = `https://${parsed.hostname}${loc}`;
      proxyRes.resume();
      return fetchWithRedirects(loc, passHeaders, res, redirectCount + 1);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'audio/mpeg');

    const cl = proxyRes.headers['content-length'];
    const cr = proxyRes.headers['content-range'];
    if (cl) res.setHeader('Content-Length', cl);
    if (cr) res.setHeader('Content-Range', cr);

    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('[audio-proxy] error:', err.message);
    if (!res.headersSent) { res.writeHead(502); res.end('Proxy error: ' + err.message); }
  });

  proxyReq.end();
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  // 1. Google Drive Audio Proxy
  if (reqUrl.pathname === '/api/audio-proxy') {
    const id = reqUrl.searchParams.get('id');
    if (!id || !/^[a-zA-Z0-9_-]{10,}$/.test(id)) {
      res.writeHead(400);
      return res.end('Invalid or missing Google Drive file ID');
    }
    const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&authuser=0&confirm=t`;
    const passHeaders = {};
    if (req.headers['range']) passHeaders['Range'] = req.headers['range'];
    return fetchWithRedirects(driveUrl, passHeaders, res);
  }

  // 2. Direct Google Workspace Gmail SMTP Mailer
  if (reqUrl.pathname === '/api/send-email' && req.method === 'POST') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyData || '{}');
        const {
          org_name, event_type, contact_name, contact_email,
          contact_phone, event_date, audience_size, notes
        } = payload;

        const gmailUser = process.env.GMAIL_USER || 'kadambkanan.rns@voicepune.com';
        const gmailPass = process.env.GMAIL_APP_PASS;

        if (!gmailPass) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            error: 'Missing GMAIL_APP_PASS in .env. Please generate a 16-character Google App Password at myaccount.google.com/apppasswords'
          }));
        }

        // Create Nodemailer Gmail Transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass.replace(/\s+/g, '') // remove spaces from 16-char app pass
          }
        });

        const speakerSubject = `[NEW INVITATION] ${event_type} — ${org_name}`;
        const speakerText = `
Dear Kadamb Kanan Das,

You have received a new speaking engagement invitation from ${org_name}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Organization : ${org_name}
Event Type   : ${event_type}
Proposed Date: ${event_date || 'Flexible / TBD'}
Audience Size: ${audience_size || '100+'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORGANIZER CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name  : ${contact_name}
Email : ${contact_email}
Phone : ${contact_phone || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENT THEME / NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${notes || 'No specific notes provided.'}
        `.trim();

        // Send Email via official Gmail SMTP
        const info = await transporter.sendMail({
          from: `"Kadamb Kanan Das Portal" <${gmailUser}>`,
          to: gmailUser,
          replyTo: contact_email,
          subject: speakerSubject,
          text: speakerText
        });

        console.log(`[Gmail SMTP] ✅ Email dispatched to ${gmailUser}, Message ID: ${info.messageId}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          mode: 'gmail_smtp',
          messageId: info.messageId
        }));

      } catch (err) {
        console.error('[Gmail SMTP Error]:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: err.message
        }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n📧  Direct Gmail SMTP & Audio Server running → http://localhost:${PORT}\n`);
});
