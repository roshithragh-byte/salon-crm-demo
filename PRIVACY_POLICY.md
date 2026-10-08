# PilotWave Salon Management Platform — Privacy Policy

**Effective Date:** October 8, 2026  
**Last Updated:** October 8, 2026  

---

## 1. Introduction & Scope

Welcome to **Natural's Salon Kottakkal** ("we", "our", or "us") and the **PilotWave Salon Management Platform**. We provide salon operations, appointment scheduling, customer relationship management (CRM), and AI-driven business intelligence for luxury wellness studios and premier salons, including our flagship studio **Natural's Salon** (located in Kottakkal, Kerala, India).

This Privacy Policy explains how we collect, use, process, disclose, and safeguard your personal data when you visit our website ([salon-crm-demo-theta.vercel.app](https://salon-crm-demo-theta.vercel.app)), book appointments, interact with our customer portals, or use our salon management platform.

We are committed to protecting your privacy in compliance with applicable data protection laws, including the **Digital Personal Data Protection Act, 2023 (DPDPA - India)**, and international data protection standards (such as **GDPR** for European visitors/clients).

---

## 2. Personal Data We Collect

We collect information that identifies, relates to, or could reasonably be linked with you ("Personal Data"):

### A. Information You Provide Directly
1. **Contact & Identity Details:** Full name, mobile phone number, email address, and demographic information provided during appointment bookings or account creation.
2. **Appointment & Treatment Records:** Date and time of booking, selected hair/skincare services, requested add-ons, assigned stylist/therapist, special notes or treatment preferences.
3. **Customer Account & Profile:** Profile pictures, preferred communication channels, login credentials (hashed passwords for registered staff/clients).
4. **Reviews & Feedback:** Ratings, written testimonials, customer satisfaction feedback, and feedback source (e.g. Google, direct salon portal).

### B. Information Collected Automatically
1. **Transaction & Payment Data:** Provider order ID, payment transaction ID, timestamp, currency, and payment status (e.g. `SUCCESS`, `PENDING`, `FAILED`).  
   > **Note on Payment Security:** We integrate with PCI-DSS compliant third-party payment gateways (such as Razorpay). We **never** store, handle, or log credit/debit card numbers, CVV, or banking PINs on our servers.
2. **Loyalty Program Ledger:** Accumulated loyalty points, points redemption history, visit frequencies, and transactional audit trails.
3. **Device & Log Information:** IP address, browser type, operating system, referrer URL, access timestamps, request IDs, and security event logs.
4. **Cookies & Session Tokens:** NextAuth session tokens (HS256 signed JSON Web Tokens) and essential cookies required for session persistence and CSRF protection.

---

## 3. How We Use Your Personal Data

We process your data strictly for legitimate, declared purposes:

| Purpose / Use Case | Categories of Data Used | Legal Basis |
| :--- | :--- | :--- |
| **Fulfilling Bookings & Scheduling** | Name, Phone, Email, Service, Slot | Performance of Contract |
| **Payment Processing & Invoicing** | Transaction ID, Order ID, Amount | Legal Obligation & Contract |
| **Loyalty Rewards & CRM Benefits** | Visit count, Point accrual ledger | Legitimate Business Interest |
| **Appointment Reminders & Updates** | Phone number (SMS/WhatsApp), Email | Performance of Contract |
| **AI Quality & Sentiment Analysis** | Anonymized review text & ratings | Legitimate Business Interest |
| **Platform Security & Fraud Defense** | IP address, session tokens, audit logs | Security & Legal Compliance |

---

## 4. Artificial Intelligence & Automated Processing

PilotWave employs TypeSafe AI modules to enhance service quality:
- **Sentiment & Review Topic Categorization:** Reviews and feedback are processed through AI models to categorize topics (e.g., *Staff Courtesy*, *Cleanliness*, *Treatment Quality*) and evaluate customer satisfaction scores.
- **Stylist Matching & No-Show Prediction:** Statistical heuristics and machine-learning signals are used to match client preferences with stylist expertise and optimize schedule utilization.
- **Zero Training on Private Sensitive Data:** We do not sell, rent, or feed identifiable customer records into public LLM training datasets.

---

## 5. How We Share & Disclose Information

We do not sell personal data. We only share information with trusted third-party service providers under strict data processing agreements:

1. **Cloud Hosting & Infrastructure:** Managed cloud infrastructure providers (Vercel, Railway) located in secure data center regions with end-to-end TLS 1.3 encryption.
2. **Payment Processors:** Certified payment gateway providers (Razorpay) for processing booking payments and issuing receipts.
3. **Database & Cache Providers:** Managed PostgreSQL clusters protected by strict firewall rules and network isolation.
4. **Legal Compliance:** Law enforcement or regulatory authorities only when strictly required by applicable law or a valid court order.

---

## 6. Data Security & Storage Architecture

We apply industry-grade technical and organizational safeguards:
- **Zero-Trust Token Hardening:** Canonical HS256 JWT verification with explicit `iss`, `aud`, `exp`, and role/tenant claims.
- **Cryptographic Webhook Verification:** Timing-safe HMAC-SHA256 signature verification over raw request bodies for all payment webhooks.
- **Encryption Standards:** TLS 1.3 in transit and AES-256 encryption at rest for database clusters.
- **Tenant Isolation:** Multi-tenant PostgreSQL partitioning and strict NestJS `RolesGuard` scoping to prevent cross-salon data access.

---

## 7. Data Retention Policy

- **Active Booking & Profile Data:** Retained for the lifetime of the salon-customer relationship or until account deletion is requested.
- **Financial & Payment Records:** Retained for 7 years in compliance with applicable Indian tax and financial accounting regulations.
- **Technical Logs & Audit Trails:** Rotated and purged automatically within 90 days.

---

## 8. Your Data Subject Rights

Under the **DPDPA 2023** and international privacy frameworks, you have the following rights:
1. **Right to Access:** Request a summary of your personal data and processing activities.
2. **Right to Correction / Rectification:** Update or rectify inaccurate personal or contact details.
3. **Right to Erasure ("Right to be Forgotten"):** Request deletion of your profile and appointment history, subject to legal retention obligations.
4. **Right to Grievance Redressal:** Submit inquiries or complaints regarding the processing of your data to our Grievance Officer.
5. **Right to Withdraw Consent:** Opt-out of non-essential marketing notifications at any time.

To exercise any of these rights, email us at **privacy@pilotwave.io**.

---

## 9. Contact Information & Grievance Redressal

If you have questions, feedback, or wish to exercise your privacy rights, please contact our Data Protection & Grievance Officer:

**Grievance Officer:**  
Privacy & Compliance Team  
Natural's Salon Kottakkal / PilotWave Platform  
1st Floor, Al Wahad Complex, Changuvetty, Kottakkal, Malappuram, Kerala, India — 676501  
**Email:** `privacy@naturalssalon.com`  
**Website:** [https://salon-crm-demo-theta.vercel.app](https://salon-crm-demo-theta.vercel.app)  

---

## 10. Updates to this Privacy Policy

We may update this policy periodically to reflect platform enhancements or regulatory changes. The "Effective Date" at the top will indicate when the latest revisions took effect. Continued use of the platform after updates constitutes acceptance of the revised terms.
