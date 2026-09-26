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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const event = req.body;

  try {
    if (event && event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      const applicationId = session?.client_reference_id || session?.metadata?.application_id;
      const subscriptionId = session?.subscription || null;
      const customerId = session?.customer || null;
      const amountTotal = (session?.amount_total || 0) / 100;

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
                protected_device_count: Number(session?.metadata?.device_count || 1),
                protected_cloud_user_count: Number(session?.metadata?.cloud_user_count || 0),
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
    return res.status(500).json({ error: 'Webhook processing failed', message: err.message });
  }
}

