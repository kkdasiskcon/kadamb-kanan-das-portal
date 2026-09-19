/**
 * Advanced Media Helper Utility for Google Drive & YouTube links
 */

// Parse Google Drive URL to get preview, proxy stream & thumbnail links
export function parseDriveUrl(url) {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return {
      fileId,
      // Vercel Edge proxy URL — works on localhost (via Vite proxy) AND on Vercel deployment
      // This bypasses all Google Drive CORS restrictions server-side
      streamUrl: `/api/audio-proxy?id=${fileId}`,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      directUrl: `https://drive.google.com/uc?id=${fileId}`,
      thumbUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    };
  }
  return null;
}


// Parse YouTube URL or raw video ID
export function parseYouTubeId(input) {
  if (!input) return null;
  if (input.length === 11 && !input.includes('/') && !input.includes('.')) {
    return input;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = input.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Format seconds into MM:SS or HH:MM:SS
export function formatDurationSeconds(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

// Auto-detect duration from audio/video URL in browser using HTML5 media metadata
export function autoDetectDuration(url) {
  return new Promise((resolve) => {
    if (!url) return resolve('Auto');

    const driveObj = parseDriveUrl(url);
    const mediaUrl = driveObj ? driveObj.streamUrl : url;

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = mediaUrl;

    const timer = setTimeout(() => {
      audio.src = '';
      resolve('Auto');
    }, 4000);

    audio.onloadedmetadata = () => {
      clearTimeout(timer);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        const formatted = formatDurationSeconds(audio.duration);
        audio.src = '';
        resolve(formatted);
      } else {
        resolve('Auto');
      }
    };

    audio.onerror = () => {
      clearTimeout(timer);
      resolve('Auto');
    };
  });
}

