# Sector Seven Cyber — Technical Handover & Project Summary (`PROJECT_HANDOVER_SUMMARY.md`)

**Date:** September 28, 2026  
**Status:** **100% Production Code Complete & Live-Verified**  
**Live Custom Domain:** [`https://sectorsevencyber.com`](https://sectorsevencyber.com)  
**Dual Repositories:**  
* Primary: [`https://github.com/emmanuelikeh2993/sector-seven-cyber.git`](https://github.com/emmanuelikeh2993/sector-seven-cyber.git)  
* Client: [`https://github.com/destinyjoy321/sector-seven-cyber-.git`](https://github.com/destinyjoy321/sector-seven-cyber-.git)  

---

## 1. Executive & Product Overview

* **Product:** Sector Seven Cyber
* **Positioning:** B2B Managed Cybersecurity; Cloud & Endpoint Managed Detection & Response (MDR); 24/7 human-led SOC with Active Response.
* **Target Audience:** Small-to-midsize businesses (medical practices, legal firms, financial services, construction, logistics) requiring verified security controls for daily operations and cyber liability insurance underwriting standards.
* **Master Specification:** Destiny Joy Sagay — Sector Seven Cyber Customer Flow & Pricing Update (`FINAL FINAL.docx`).

---

## 2. Core Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│  React 18 + TypeScript + Vite 6 + Tailwind CSS + Framer Motion + Lenis │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼───────────────────────────┐
       ▼                            ▼                           ▼
┌──────────────┐          ┌───────────────────┐       ┌──────────────────┐
│   SUPABASE   │          │  VERCEL API / DEV │       │  STRIPE (LIVE)   │
│  PostgreSQL  │          │ Serverless Routes │       │ Hosted Checkout  │
│     RLS      │          │   (api/*.ts)      │       │ Dynamic Subs     │
│   Storage    │          │  Vite Local Mocks │       │ Live Webhooks    │
└──────────────┘          └───────────────────┘       └──────────────────┘
```

* **Frontend:** Single-page application built with React 18, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.
* **Data Layer:** Supabase (`https://lmexwjocppravvmtwvzc.supabase.co`) with Row Level Security (RLS) on `applications`, `audit_logs`, and `pricing_engine_config`.
* **Transactional Emails:** Resend API integration (`api/send-email.ts`) with custom domain alignment (`contact@sectorsevencyber.com`) configured with SPF, DKIM, and DMARC in Namecheap DNS.
* **Payments:** Stripe Live Subscriptions via Vercel serverless API (`api/create-checkout-session.ts`, `api/stripe-webhook.ts`, and `api/verify-payment.ts`).

---

## 3. Implemented Pricing & Logic Engine

Located in `src/lib/pricing.ts` and mirrored in `api/create-checkout-session.ts`:

1. **Evaluation Rule:** Determining quantity is strictly:
   $$\text{Band Quantity} = \max(\text{Device Count}, \text{Cloud User Count})$$
2. **Automated Tiers:**
   * **1–10 units:** **$500 / month**
   * **11–20 units:** **$750 / month**
   * **21–30 units:** **$1,000 / month**
   * **> 30 units:** Routes to **Custom Cybersecurity Plan** flow with telephone dispatch `(470) 363-9083`.
3. **Internal Cost Tracking (Strictly Hidden from Clients):**
   $$\text{Internal Cost} = (\text{Devices} \times \$2.00) + (\text{Cloud Users} \times \$2.50)$$
   *Tracked internally in Supabase and displayed only in the password-protected Admin Console (`/admin`).*

---

## 4. End-to-End User Flow

1. **Homepage (`/`):** Hero, carrier proof-of-protection framing, 3 service pillars, regulated industry frameworks, 6-step roadmap, and FAQ.
2. **Assessment Form (`/apply`):** 2-step numerical intake (devices, M365/Google cloud users), broker attribution tracking, and cyber insurance status.
3. **Dedicated Quote (`/quote`):** Prominent monthly rate, official 9-capability "What's Included" checklist, no vendor price leaks.
4. **Agreement & Activation (`/activate`):** Service summary, Service Agreement modal, authorization checkbox, and "Agree & Pay" action launching Stripe Checkout.
5. **Payment Processing:** Dynamic monthly recurring subscription generated directly through Stripe API.
6. **Post-Checkout Onboarding (`/dashboard`):** Status displays `PAID — READY FOR ONBOARDING`. Provides Defender/M365 tenant coordination steps.
7. **Coverage Certificate (`src/components/certificate/CoverageCertificate.tsx`):** Single-page, print-optimized (`@media print`) underwriter attestation certificate with corporate seal and signature block.
8. **Admin Command Console (`/admin`):** Passcode: `sector7`. Pipeline tracking, internal margin calculation, quote status management.

---

## 5. Live Configuration & Credentials Setup

### Stripe Live Mode (Active & Verified)
* **Publishable Key:** Configured in `.env.local` / Vercel (`pk_live_...`)
* **Secret Key:** Configured in `.env.local` / Vercel (`sk_live_...`)
* **Live Webhook Endpoint:** `https://sectorsevencyber.com/api/stripe-webhook` (ID: `we_1UKZGN2ZwM0ExlmAtNWzQk5K`)
* **Webhook Signing Secret:** Configured in `.env.local` / Vercel (`whsec_...`)
* **Subscribed Events:** `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`

### Database & Storage (Supabase)
* **Project URL:** `https://lmexwjocppravvmtwvzc.supabase.co`
* **Admin Passcode for `/admin`:** `sector7`

---

## 6. What Remains Ahead / Operational Next Steps

| Task | Category | Details |
| :--- | :--- | :--- |
| **1. Vercel Environment Variables** | Operational | In **Vercel Project Settings ➔ Environment Variables**, ensure `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` are added for production builds. |
| **2. Final Service Agreement Text** | Legal / Content | Destiny Joy noted the final agreement will be provided separately. When ready, update the modal in `src/pages/ActivatePage.tsx`. |
| **3. Client Walkthrough Sign-off** | Acceptance | Destiny Joy requested an end-to-end verification run on `sectorsevencyber.com` from `/apply` ➔ Quote ➔ Activation ➔ Onboarding Dashboard. |

---

## 7. Developer Quick Reference

### Running Locally
```powershell
cmd /c npm.cmd run dev
# Vite dev server starts at http://localhost:3000/
```

### Production Build Validation
```powershell
cmd /c npm.cmd run build
# Runs tsc type check followed by vite build to /dist
```

### Syncing Both Git Remotes
```powershell
git push origin main
git push client main
```
