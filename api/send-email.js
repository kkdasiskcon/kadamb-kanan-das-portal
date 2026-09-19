/**
 * Vercel Edge Serverless Function: Invitation Email Dispatcher
 * Route: /api/send-email
 */

export const config = { runtime: 'edge' };

export default async function handler(request) {
  // CORS Handling
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const payload = await request.json();
    const {
      org_name, event_type, contact_name, contact_email,
      contact_phone, event_date, audience_size, notes
    } = payload;

    const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'Missing VITE_RESEND_API_KEY in environment variables' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

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

    // Dispatch via Resend API
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['kadambkanan.rns@voicepune.com', 'kadambkanan.rns@gmail.com'],
        reply_to: contact_email,
        subject: speakerSubject,
        text: speakerText,
      }),
    });

    const data = await resendRes.json();

    if (resendRes.ok) {
      return new Response(JSON.stringify({ success: true, messageId: data.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: data?.message || data?.name || 'Resend error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
