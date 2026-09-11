# Sector Seven Cyber — Compliance Intake & Risk Architecture

This repository houses the core full-stack application and data architecture for **Sector Seven Cyber**, a premier cyber liability compliance and active threat hunting agency based in Georgia, USA. 

The platform serves as an authoritative digital gateway, bridging the gap between commercial insurance underwriters, legal/medical firms, and enterprise-grade security protocols.

---

## 🔒 Security & Data Privacy Notice
*This infrastructure is engineered with strict adherence to data protection standards. Production database credentials, API secrets, and sensitive customer-uploaded files are heavily isolated via private environment variables and authenticated security boundaries. No client data or proprietary tokens are exposed within this repository.*

---

## 🛠️ Platform Core Capabilities

### 1. Encrypted Multi-File Compliance Intake Vault
- **Secure File Ingestion:** Implemented a high-capacity document processing gateway allowing prospects to upload up to 5 multi-format insurance questionnaires (PDF, DOCX, XLSX up to 50MB total).
- **Storage Infrastructure:** Integrated secure, authenticated storage buckets with encryption-in-transit protocols. This architecture guarantees safe routing of sensitive underwriting documentation in alignment with state regulatory compliance (e.g., O.C.G.A. § 10-1-912).

### 2. Interactive Cyber Risk Assessment Engine
- **Deterministic Evaluation Matrix:** Built an interactive mathematical risk and financial exposure calculator. 
- **Dynamic Logic State:** Evaluates organizational profiles (employee scale, industry category, existing endpoint security, and authentication layers) to deliver instantaneous compliance readiness scores.

### 3. Automated Transactional Lead Pipeline
Every web form submission triggers an asynchronous, atomic sequence to ensure zero lead drop-off:
1. **Relational Logging:** Securely archives applicant data and risk variables into a structured relational schema.
2. **Dual-Channel Routing (Resend API):** Instantly dispatches a structured system notification to internal operations containing authenticated secure document access strings, while simultaneously generating a formal confirmation notice with a reference ID for the client.
3. **High-Availability Mail Fallback:** Designed an automated programmatic fallback routine utilizing SMTP protocols to protect the intake pipeline from API latency or third-party service degradation.

---

## ⚡ Technical Stack

- **Frontend Environment:** React 19, TypeScript, Vite, Tailwind CSS
- **Interactions & Design:** Framer Motion (fluid user experience), custom SVG tactile noise filters
- **Backend Architecture:** Relational Database Engine, Cloud Edge Functions, and Authenticated Object Storage
- **Communications Layer:** Resend API Engine, NodeMailer SMTP Fallback Matrix

---

## 🗺️ System Data Flow

