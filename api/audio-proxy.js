/**
 * Vercel Edge Function: Google Drive Audio Proxy
 * 
 * Fetches Google Drive audio files server-side (no CORS), then streams
 * raw audio bytes back to the browser with full Range-request support for seeking.
 * 
 * Usage: /api/audio-proxy?id=GOOGLE_DRIVE_FILE_ID
 * 
 * Deploy: Automatically active when project is deployed to Vercel.
 * Local:  Run `npx vercel dev` to test locally.
 */

export const config = { runtime: 'edge' };

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type',
      },
    });
  }

  // Validate file ID
  if (!id || !/^[a-zA-Z0-9_-]{10,}$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid Google Drive file ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    // Google Drive direct download URL (bypasses the HTML warning page)
    const driveUrl = `https://docs.google.com/uc?export=download&id=${id}&confirm=t`;

    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (compatible; KKDAudioProxy/1.0)',
      'Accept': 'audio/*,*/*',
    };

    // Forward Range header for seeking support (critical for audio scrubbing)
    const range = request.headers.get('range');
    if (range) fetchHeaders['Range'] = range;

    const upstream = await fetch(driveUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!upstream.ok && upstream.status !== 206) {
      return new Response(`Upstream error: ${upstream.status} ${upstream.statusText}`, {
        status: upstream.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Build response headers
    const responseHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': upstream.headers.get('content-type') || 'audio/mpeg',
    });

    // Forward content length & range headers (needed for seek to work)
    const contentLength = upstream.headers.get('content-length');
    const contentRange = upstream.headers.get('content-range');
    const contentDisposition = upstream.headers.get('content-disposition');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    if (contentDisposition) responseHeaders.set('Content-Disposition', contentDisposition);

    // Stream body directly — Edge runtime supports ReadableStream passthrough
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy failed: ' + err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
