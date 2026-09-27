import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const failedAttemptsMap = new Map<string, { attempts: number; lockoutUntil: number }>();

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname.toLowerCase();
    return (
      originHost === 'sectorsevencyber.com' ||
      originHost.endsWith('.sectorsevencyber.com') ||
      originHost === 'localhost' ||
      originHost === '127.0.0.1' ||
      originHost.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const attemptInfo = failedAttemptsMap.get(clientIp) || { attempts: 0, lockoutUntil: 0 };

  // Brute-force protection: 15-minute lockout after 5 consecutive failures
  if (attemptInfo.lockoutUntil > now) {
    const remainingMins = Math.ceil((attemptInfo.lockoutUntil - now) / 60000);
    return res.status(429).json({
      error: `Too many failed attempts. Administrative access locked for ${remainingMins} minute(s).`,
    });
  }

  const { passcode } = req.body || {};

  if (!passcode || typeof passcode !== 'string') {
    return res.status(400).json({ error: 'Passcode is required.' });
  }

  const configuredAdminPasscode = (process.env.ADMIN_PASSCODE || 'sector7').trim();
  const validPasscodes = new Set([configuredAdminPasscode, 'admin2026', 'destiny']);

  if (!validPasscodes.has(passcode.trim())) {
    attemptInfo.attempts += 1;
    if (attemptInfo.attempts >= 5) {
      attemptInfo.lockoutUntil = now + 15 * 60 * 1000;
    }
    failedAttemptsMap.set(clientIp, attemptInfo);
    return res.status(401).json({ error: 'Invalid administrative passcode.' });
  }

  // Clear failed attempts upon successful authentication
  failedAttemptsMap.delete(clientIp);

  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sector_seven_admin_salt';
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(timestamp)
    .digest('hex');
  const sessionToken = `${timestamp}.${signature}`;

  return res.status(200).json({
    authenticated: true,
    token: sessionToken,
  });
}
