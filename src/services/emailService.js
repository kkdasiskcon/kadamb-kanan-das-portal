/**
 * Direct Email Dispatcher via Google Workspace Gmail SMTP
 * Sends: Direct notification from kadambkanan.rns@voicepune.com
 */

export const sendInvitationEmails = async (invitation) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitation),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('[Gmail SMTP] ✅ Email Sent! Message ID:', data.messageId);
      return { delivered: true, emailId: data.messageId };
    } else {
      console.warn('[Gmail SMTP] ⚠️ Email Error Response:', data);
      return {
        delivered: false,
        reason: data?.error || 'Gmail SMTP dispatch error'
      };
    }
  } catch (err) {
    console.error('[Gmail SMTP] Network Error:', err.message);
    return {
      delivered: false,
      reason: `Network error: ${err.message}`
    };
  }
};
