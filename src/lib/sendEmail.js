export async function sendEmail(type, email, data = {}) {
  try {
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, email, data }),
    });
    return await res.json();
  } catch (error) {
    console.error('Email error:', error);
  }
}
