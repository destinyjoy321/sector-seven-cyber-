# Sector Seven Cyber — Implementation Status & Remaining Action Items (`what_remains.md`)

**Date:** September 27, 2026  
**Master Specification:** Destiny Joy Sagay — Sector Seven Cyber Customer Flow & Pricing Update (`FINAL FINAL.docx`)  
**Repository:** [`https://github.com/emmanuelikeh2993/sector-seven-cyber.git`](https://github.com/emmanuelikeh2993/sector-seven-cyber.git)  
**Status:** **100% of Application Code & UX Logic Implemented & Verified Locally**

---

## I. Completed Technical Implementation (Against `FINAL FINAL.docx`)

All 25 sections specified by Destiny Joy Sagay have been implemented and validated across the application codebase:

| Spec Section | Feature / Requirement | Implementation Details | Status |
| :--- | :--- | :--- | :--- |
| **Section 1–3** | **Company Positioning & Service Voice** | B2B Managed Cybersecurity; Cloud & Endpoint Managed Detection & Response (MDR); 24/7 human-led SOC with Active Response. No insurance-carrier or brokerage branding. | ✅ Complete |
| **Section 4** | **Simplified Assessment Form** | 2-step assessment: Full Name, Executive Title, Legal Entity Name, Business Email, Phone, Industry dropdown (with dynamic "Other" specification input). | ✅ Complete |
| **Section 5** | **Insurance Partner Attribution** | Tracking field for referring independent insurance brokerage/agent. Zero commissions or referral fees built into the system. | ✅ Complete |
| **Section 6** | **Cyber Liability Coverage Status** | Captures whether business has active coverage, facing audit/renewal, applying for new policy, or proactively strengthening defenses. | ✅ Complete |
| **Section 7** | **Legacy File Uploads Removed** | Eliminated document upload and discovery tool requirements; replaced with seamless online intake. | ✅ Complete |
| **Section 8** | **Exact Device & Cloud Inputs** | Verbatim numerical questions for company computers and Microsoft 365 / Google Workspace accounts with exact helper text. | ✅ Complete |
| **Section 9–10** | **Tiered Scale & Higher-of-Two Logic** | Automated pricing: 1–10 ($500/mo), 11–20 ($750/mo), 21–30 ($1,000/mo). Band determined strictly by `max(devices, cloud_users)`. Environments >30 units route to Custom Cybersecurity Plan. | ✅ Complete |
| **Section 11** | **Internal Cost Isolation** | Backend tracks cost: `(Devices × $2.00) + (Cloud Users × $2.50)`. Completely hidden from customer-facing screens, quotes, receipts, and frontend bundles. | ✅ Complete |
| **Section 12–14** | **Dedicated Quote Experience** | Professional quote page: monthly rate prominent at top, official 9-capability "What's Included" checklist, no individual item prices, protected asset breakdown. | ✅ Complete |
| **Section 15** | **Agreement & Activation Page** | Organization summary, View Service Agreement modal, mandatory authorization checkbox, and "Agree & Pay" action. | ✅ Complete |
| **Section 16** | **Stripe Recurring Subscription** | Launches Stripe Checkout for exact monthly subscription price. Post-checkout redirects to onboarding and marks status as `PAID — READY FOR ONBOARDING`. | ✅ Complete |
| **Section 17** | **Onboarding Scale Adjustment Notice** | Verbatim notice informing clients that price may adjust if actual onboarding asset count differs from assessment. | ✅ Complete |
| **Section 18** | **Admin Command Console** | Internal dashboard displaying organization, contact, industry, broker attribution, price, internal cost estimate, net margin, and pipeline statuses. | ✅ Complete |
| **Section 19** | **How It Works (6 Steps)** | Updated 6-step sequence from assessment to 24/7 managed protection. | ✅ Complete |
| **Section 20–21** | **FAQ & Retainer Cleanup** | Removed absolute guarantees ("within minutes", "neutralize before data stolen") and old retainer/vendor references. | ✅ Complete |
| **Section 22–23** | **Legal Pages & Primary CTAs** | Terms of Service, Privacy Policy, and standardized "START YOUR SECURITY ASSESSMENT" CTAs. | ✅ Complete |
| **Audit Fix** | **Executive Coverage Certificate** | Single-page Certificate of Cyber Protection Coverage with formal underwriter attestation, corporate seal, signature block, and print stylesheet (`@media print`). | ✅ Complete |

---

## II. What Remains To Implement / Configure For Live Launch

The remaining items are non-code operational tasks, live credentials, and external configurations required before going live to real paying customers:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REMAINING LAUNCH CHECKLIST                            │
│                                                                                 │
│  [ ] 1. Stripe Live Mode API Keys (Switch from Test Mode to Live Subscriptions)  │
│  [ ] 2. Attorney-Finalized Client Service Agreement (Replace Draft Text)        │
│  [ ] 3. Destiny Joy's Pricing Bands for > 30 Units (When Finalized)             │
│  [ ] 4. Production Domain DNS Cutover (sectorsevencyber.com on Namecheap)       │
│  [ ] 5. Client End-to-End Walkthrough Approval (Destiny Joy Test Run)           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Stripe Live Mode Subscription Configuration
*Reference: Section 16 & Section 25*

- **Current State:** The checkout flow runs on Stripe Test Mode (`sk_test_...` / `pk_test_...`). Test payments succeed and simulate real recurring monthly subscriptions.
- **Action Required:**
  1. Retrieve live API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
     - `STRIPE_SECRET_KEY` (Live secret key: `rk_live_...` or `sk_live_...`)
     - `VITE_STRIPE_PUBLIC_KEY` (Live publishable key: `pk_live_...`)
  2. Configure the Stripe Webhook endpoint in the Stripe Dashboard:
     - Endpoint URL: `https://sectorsevencyber.com/api/stripe-webhook`
     - Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_succeeded`
     - Copy the Signing Secret: `STRIPE_WEBHOOK_SECRET` (`whsec_...`)
  3. Add these variables to your Vercel Environment Variables (**Project Settings ➔ Environment Variables**).

---

### 2. Client Service Agreement Final Legal Text
*Reference: Section 15 & Section 22*

- **Current State:** The activation screen links to an executive B2B Managed Security Service Agreement draft covering continuous 24/7 SOC surveillance, authorization for host-level isolation, recurring billing authorization, and Section 17 quantity adjustments.
- **Action Required:**
  - Destiny Joy noted in Section 22: *"The customer Service Agreement used during Agree & Pay will be finalized separately."*
  - Once Destiny Joy provides the final attorney-approved agreement copy, paste it into [`src/pages/ActivatePage.tsx`](file:///c:/Users/Emmanuel/OneDrive/Desktop/demoseven/src/pages/ActivatePage.tsx) or provide the official signed PDF link.

---

### 3. Extended Enterprise Pricing Bands (> 30 Units)
*Reference: Section 9 & Section 10*

- **Current State:** Organizations with 1–10 units ($500/mo), 11–20 units ($750/mo), and 21–30 units ($1,000/mo) receive instant automated quotes and can proceed directly to checkout. Environments with > 30 devices or cloud accounts are routed to the **Custom Cybersecurity Plan** flow with direct telephone dispatch `(470) 363-9083`.
- **Action Required:**
  - Destiny Joy noted in Section 9: *"I will provide the larger environment rates separately once finalized... Please make the pricing table/configuration editable from the backend/admin side so we can change pricing later without rebuilding the website."*
  - The Supabase database contains the dynamic `pricing_config` table. When Destiny Joy provides finalized rates for larger tiers (e.g., 31–50 units, 51–100 units), add them via the Admin Console or SQL editor without needing a site rebuild.

---

### 4. Custom Domain DNS Cutover (`sectorsevencyber.com`)

- **Current State:** The application is hosted on Vercel staging (`sectorsevencyber.vercel.app`) with full HTTPS and automated API routing.
- **Action Required:**
  1. **In Vercel Dashboard:**
     - Go to **Settings ➔ Domains**.
     - Add `sectorsevencyber.com` and `www.sectorsevencyber.com`.
  2. **In Namecheap Advanced DNS:**
     - Add/update the following 2 DNS records:
       | Record Type | Host | Target / Value | TTL |
       | :--- | :--- | :--- | :--- |
       | **A Record** | `@` | `76.76.21.21` | Automatic |
       | **CNAME Record** | `www` | `cname.vercel-dns.com.` | Automatic |
     - *(Remove any previous conflicting `googlehosted.com` CNAME entries).*

---

### 5. Client Test Run & Acceptance Sign-off
*Reference: Section 25*

Destiny Joy requested:
> *"Once these changes are implemented on the test site, please send me the test link so I can run through the entire customer journey from assessment → quote → agreement → Stripe checkout → onboarding before anything goes live."*

#### Journey Verification Steps to Provide to Destiny Joy:
1. **Start Assessment**: Navigate to `/apply` and enter test business details (e.g., Law Firm, 15 computers, 12 cloud users).
2. **Instant Quote**: Verify the quote page displays **Sector Seven Cyber Protection** at **$750/month** (Tier 11–20) with the 9-point checklist and zero vendor cost leaks.
3. **Activation**: Click *Continue to Activation*, review the agreement, and check the authorization box.
4. **Checkout**: Click *Agree & Pay* to launch Stripe Checkout. Complete with test card `4242 4242 4242 4242`.
5. **Onboarding & Certificate**:
   - Verify redirect to `/dashboard` showing status **`PAID — READY FOR ONBOARDING`**.
   - Review the authentic MDR coordination steps (Windows Defender / Defender for Endpoint, M365/Google tenant link).
   - Click **"Print / Save Coverage Certificate"** and verify the single-page, executive certificate renders with underwriter attestation and no website chrome.
