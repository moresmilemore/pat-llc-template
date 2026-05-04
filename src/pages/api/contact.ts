// Contact form handler. Validates Turnstile token, sends via Resend.
//
// Env vars (per .env.example + knowledge/tooling.md):
//   RESEND_API_KEY        — secret
//   RESEND_FROM_EMAIL     — verified sender
//   RESEND_TO_EMAIL       — client's inbox
//   TURNSTILE_SECRET_KEY  — secret (paired with PUBLIC_TURNSTILE_SITE_KEY in form)
//
// Per knowledge/astro.md, prefer astro:env/server when this becomes load-bearing
// (currently in template state with no client wired, raw env access is fine).
//
// SECURITY:
//   - Turnstile validation happens server-side (token from form, not trusted client claim)
//   - Rate limiting is left to Vercel platform + Resend's own throttling
//   - No PII logged

import type { APIRoute } from 'astro';

export const prerender = false;

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // template-mode: skip verification, will fail at deploy if not configured
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

async function sendViaResend(payload: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return { ok: false, error: 'email-not-configured' };
  }
  const subject = `New contact form: ${payload.name}`;
  const text = [
    `Name:    ${payload.name}`,
    `Phone:   ${payload.phone}`,
    payload.email ? `Email:   ${payload.email}` : null,
    '',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text, reply_to: payload.email }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `resend-${res.status}-${err.slice(0, 100)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: 'network-error' };
  }
}

function sanitize(s: string, max = 5000): string {
  return s.replace(/\s+/g, ' ').trim().slice(0, max);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return new Response('invalid-form', { status: 400 });
  }

  const name = sanitize(String(body.get('name') ?? ''), 200);
  const phone = sanitize(String(body.get('phone') ?? ''), 50);
  const emailRaw = sanitize(String(body.get('email') ?? ''), 200);
  const email = emailRaw && /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(emailRaw) ? emailRaw : undefined;
  const message = sanitize(String(body.get('message') ?? ''), 5000);
  const turnstileToken = String(body.get('cf-turnstile-response') ?? '');

  if (!name || name.length < 2) return new Response('name-required', { status: 400 });
  if (!phone || phone.length < 10) return new Response('phone-required', { status: 400 });
  if (!message || message.length < 10) return new Response('message-too-short', { status: 400 });

  // Turnstile if configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) return new Response('turnstile-missing', { status: 400 });
    const ok = await verifyTurnstile(turnstileToken, clientAddress ?? '');
    if (!ok) return new Response('turnstile-failed', { status: 400 });
  }

  const result = await sendViaResend({ name, phone, email, message });
  if (!result.ok) {
    return new Response(result.error ?? 'send-failed', { status: 500 });
  }
  return new Response('ok', { status: 200 });
};
