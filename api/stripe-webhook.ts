import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripeKey = (
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPESANDBOX_SECRET_KEY ||
  process.env.VITE_STRIPE_SECRET_KEY ||
  ''
).trim();

const webhookSecret = (
  process.env.STRIPE_WEBHOOK_SECRET ||
  process.env.STRIPESANDBOX_WEBHOOK_SECRET ||
  ''
).trim();

const stripe = new Stripe(stripeKey || 'sk_test_placeholder');

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://lmexwjocppravvmtwvzc.supabase.co';

const supabaseServiceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

async function getRawBody(req: VercelRequest): Promise<string | Buffer> {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  // Cryptographic Webhook Signature Verification (CWE-347)
  if (webhookSecret && sig) {
    try {
      const rawBody = await getRawBody(req);
      event = stripe.webhooks.constructEvent(rawBody, sig as string, webhookSecret);
    } catch (err: any) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Webhook signature verification failed.' });
    }
  } else if (!webhookSecret) {
    console.error('CRITICAL: STRIPE_WEBHOOK_SECRET is not configured on server.');
    return res.status(500).json({ error: 'Webhook signing secret not configured.' });
  } else {
    return res.status(400).json({ error: 'Missing stripe-signature header.' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const applicationId = session.client_reference_id || session.metadata?.application_id;
      const subscriptionId = (session.subscription as string) || null;
      const customerId = (session.customer as string) || null;
      const amountTotal = (session.amount_total || 0) / 100;

      if (applicationId) {
        const now = new Date().toISOString();

        // 1. Update application record to PAID & ONBOARDING
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
          .eq('id', applicationId);

        // 2. Insert audit log stream record
        try {
          await supabaseAdmin.from('audit_logs').insert([
            {
              event_type: 'PAYMENT_COMPLETED',
              actor: 'STRIPE_WEBHOOK',
              application_id: applicationId,
              title: 'Stripe Subscription Payment Confirmed',
              detail: `Recurring payment confirmed for lead ${applicationId}. Session ID: ${session.id}`,
              metadata: {
                stripe_session_id: session.id,
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                amount_total: amountTotal,
              },
            },
          ]);
        } catch (auditErr) {
          console.warn('Audit log insert notice from stripe webhook:', auditErr);
        }

        // 3. Upsert subscription record if present
        if (subscriptionId) {
          try {
            await supabaseAdmin.from('subscriptions').upsert([
              {
                id: subscriptionId,
                application_id: applicationId,
                stripe_customer_id: customerId || 'cust_unknown',
                status: 'active',
                monthly_amount: amountTotal,
                protected_device_count: Number(session.metadata?.device_count || 1),
                protected_cloud_user_count: Number(session.metadata?.cloud_user_count || 0),
                updated_at: now,
              },
            ]);
          } catch (subErr) {
            console.warn('Subscriptions table record notice:', subErr);
          }
        }

        console.log(`Successfully verified and processed Stripe payment for application ${applicationId}`);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Stripe webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
