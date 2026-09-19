/**
 * Vercel / Local Edge Function: Resend API Email Proxy
 * 
 * Bypasses Browser CORS restrictions by forwarding email dispatches
 * from server-side Node.js directly to api.resend.com.
 */

export const config = { runtime: 'edge' };

export default async function handler(request) {
  // CORS Preflight Handling
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const body = await request.json();
    const apiKey = request.headers.get('Authorization') || process.env.VITE_RESEND_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing Resend API Key' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Forward request server-to-server to Resend API (No CORS limitations!)
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await resendRes.json();

    return new Response(JSON.stringify(data), {
      status: resendRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Resend Proxy Error: ' + err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
