import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://lmexwjocppravvmtwvzc.supabase.co';

const supabaseServiceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

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
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Support both GET query params and POST body
  const sessionId =
    (req.query.session_id as string) ||
    (req.query.sessionId as string) ||
    req.body?.sessionId ||
    req.body?.session_id;

  const applicationId =
    (req.query.id as string) ||
    (req.query.applicationId as string) ||
    req.body?.applicationId ||
    req.body?.id;

  if (!sessionId && !applicationId) {
    return res.status(400).json({ error: 'Missing sessionId or applicationId parameter' });
  }

  const stripeKey = (
    process.env.STRIPESANDBOX_SECRET_KEY ||
    process.env.STRIPE_SECRET_KEY ||
    process.env.VITE_STRIPE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ||
    ''
  ).trim();

  // 1. Live Stripe Verification (using Secret Key directly against Stripe API)
  if (stripeKey && sessionId && !sessionId.startsWith('sim_') && !sessionId.startsWith('local_sim_')) {
    try {
      const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
        },
      });

      const session = await stripeRes.json();

      if (!stripeRes.ok || session.error) {
        console.error('Stripe session retrieval error:', session.error);
        return res.status(400).json({
          error: session.error?.message || 'Unable to retrieve Stripe checkout session',
          verified: false,
        });
      }

      const isPaid = session.payment_status === 'paid' || session.status === 'complete';
      const appId = applicationId || session.client_reference_id || session.metadata?.application_id;

      if (isPaid && appId) {
        const now = new Date().toISOString();
        const subscriptionId = session.subscription || null;
        const customerId = session.customer || null;
        const amountTotal = (session.amount_total || 0) / 100;

        // Instantly mark client application as PAID in Supabase
        await supabaseAdmin
          .from('applications')
          .update({
            status: 'PAID',
            onboarding_status: 'IN_PROGRESS',
            stripe_session_id: session.id,
            stripe_subscription_id: subscriptionId,
            paid_at: now,
            updated_at: now,
          })
          .eq('id', appId);

        // Record immediate audit log
        try {
          await supabaseAdmin.from('audit_logs').insert([
            {
              event_type: 'PAYMENT_COMPLETED',
              actor: 'CLIENT',
              application_id: appId,
              title: 'Stripe Payment Verified Instantly',
              detail: `Direct Stripe API verification confirmed for ${appId}. Total: $${amountTotal}`,
              metadata: {
                stripe_session_id: session.id,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                payment_status: session.payment_status,
              },
            },
          ]);
        } catch (auditErr) {
          console.warn('Audit log write notice:', auditErr);
        }

        // Record subscription in database
        if (subscriptionId) {
          try {
            await supabaseAdmin.from('subscriptions').upsert([
              {
                id: subscriptionId,
                application_id: appId,
                stripe_customer_id: customerId || 'cust_stripe',
                status: 'active',
                monthly_amount: amountTotal,
                protected_device_count: Number(session.metadata?.device_count || 1),
                protected_cloud_user_count: Number(session.metadata?.cloud_user_count || 0),
                updated_at: now,
              },
            ]);
          } catch (subErr) {
            console.warn('Subscription upsert notice:', subErr);
          }
        }

        let updatedApp = null;
        try {
          const { data } = await supabaseAdmin
            .from('applications')
            .select('*')
            .eq('id', appId)
            .maybeSingle();
          updatedApp = data;
        } catch {
          // ignore
        }

        return res.status(200).json({
          verified: true,
          status: 'PAID',
          applicationId: appId,
          sessionId: session.id,
          subscriptionId: subscriptionId,
          customerEmail: session.customer_details?.email || session.customer_email,
          application: updatedApp,
        });
      }

      return res.status(200).json({
        verified: isPaid,
        status: isPaid ? 'PAID' : session.payment_status || 'PENDING',
        applicationId: appId,
      });
    } catch (stripeErr: any) {
      console.error('Instant payment verification exception:', stripeErr);
      return res.status(500).json({ error: stripeErr.message || 'Payment verification exception' });
    }
  }

  // 2. Simulation / Fallback Mode (e.g. local development or demo sessions)
  if (applicationId) {
    const now = new Date().toISOString();
    let updatedApp = null;
    try {
      await supabaseAdmin
        .from('applications')
        .update({
          status: 'PAID',
          onboarding_status: 'IN_PROGRESS',
          stripe_session_id: sessionId || `sim_cs_${Date.now().toString(36)}`,
          paid_at: now,
          updated_at: now,
        })
        .eq('id', applicationId);

      const { data } = await supabaseAdmin
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle();
      updatedApp = data;
    } catch (dbErr) {
      console.warn('Database simulation update notice:', dbErr);
    }

    return res.status(200).json({
      verified: true,
      simulated: true,
      status: 'PAID',
      applicationId,
      sessionId: sessionId || 'demo_session',
      application: updatedApp,
    });
  }

  return res.status(400).json({ error: 'Unable to verify payment without session details' });
}
