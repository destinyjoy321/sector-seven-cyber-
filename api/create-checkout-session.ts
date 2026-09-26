import type { VercelRequest, VercelResponse } from '@vercel/node';

function isOriginAllowed(origin: string | undefined, hostHeader?: string): boolean {
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname.toLowerCase();
    const cleanHost = (hostHeader || '').split(':')[0].trim().toLowerCase();

    if (cleanHost && (originHost === cleanHost || originHost.endsWith('.' + cleanHost) || cleanHost.endsWith('.' + originHost))) {
      return true;
    }

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
  const hostHeader = (req.headers['x-forwarded-host'] as string) || (req.headers.host as string) || '';
  const origin = req.headers.origin as string | undefined;

  if (origin && isOriginAllowed(origin, hostHeader)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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

  const { applicationId, companyName, email, contactName, monthlyPrice, deviceCount, cloudUserCount } = req.body || {};

  if (!applicationId || !monthlyPrice) {
    return res.status(400).json({ error: 'Missing applicationId or monthlyPrice parameter' });
  }

  const stripeKey = (
    process.env.STRIPESANDBOX_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.VITE_STRIPE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ||
    ''
  ).trim();

  let requestOrigin = origin;
  if (!requestOrigin && req.headers.referer) {
    try {
      requestOrigin = new URL(req.headers.referer as string).origin;
    } catch {
      // ignore
    }
  }

  const siteUrl = (
    requestOrigin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VITE_SITE_URL ||
    'https://sectorsevencyber.vercel.app'
  ).trim().replace(/\/+$/, '');

  // If Stripe Secret Key is configured in environment, create live Stripe Checkout Session
  if (stripeKey) {
    try {
      // Dynamic import to support environments where stripe SDK is loaded or direct REST API
      const stripeParams = new URLSearchParams();
      stripeParams.append('mode', 'subscription');
      stripeParams.append('payment_method_types[0]', 'card');
      stripeParams.append('customer_email', email || '');
      stripeParams.append('client_reference_id', applicationId);
      stripeParams.append('line_items[0][price_data][currency]', 'usd');
      stripeParams.append('line_items[0][price_data][recurring][interval]', 'month');
      stripeParams.append('line_items[0][price_data][unit_amount]', String(Math.round(monthlyPrice * 100)));
      stripeParams.append('line_items[0][price_data][product_data][name]', 'Sector Seven Cyber Protection');
      stripeParams.append(
        'line_items[0][price_data][product_data][description]',
        `Cloud & Endpoint MDR subscription for ${companyName} (${deviceCount} devices, ${cloudUserCount} cloud users)`
      );
      stripeParams.append('line_items[0][quantity]', '1');
      stripeParams.append(
        'success_url',
        `${siteUrl}/dashboard?id=${encodeURIComponent(applicationId)}&session_id={CHECKOUT_SESSION_ID}`
      );
      stripeParams.append(
        'cancel_url',
        `${siteUrl}/activate?id=${encodeURIComponent(applicationId)}&canceled=true`
      );
      stripeParams.append('metadata[application_id]', applicationId);
      stripeParams.append('metadata[company_name]', companyName || '');
      stripeParams.append('metadata[device_count]', String(deviceCount || 0));
      stripeParams.append('metadata[cloud_user_count]', String(cloudUserCount || 0));

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: stripeParams.toString(),
      });

      const session = await stripeRes.json();

      if (session.url) {
        return res.status(200).json({ url: session.url, sessionId: session.id });
      } else {
        console.error('Stripe API error response:', session);
        return res.status(500).json({ error: session.error?.message || 'Stripe session creation failed' });
      }
    } catch (stripeErr: any) {
      console.error('Stripe session creation exception:', stripeErr);
      return res.status(500).json({ error: stripeErr.message || 'Stripe service error' });
    }
  }

  // Fallback: If Stripe key is not configured in local development, return local simulation mode
  return res.status(200).json({
    simulated: true,
    message: 'Stripe Secret Key not yet provided in environment. Running in local test simulation.',
    redirectUrl: `${siteUrl}/dashboard?id=${encodeURIComponent(applicationId)}&session_id=local_sim_${Date.now().toString(36)}`,
  });
}
