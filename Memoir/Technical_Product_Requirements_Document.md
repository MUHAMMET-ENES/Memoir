# Product Requirements Document (PRD)

**Product Name:** Memoir - Your Life, Beautifully Remembered
**Document Status:** Draft – In Review
**Platform:** iOS (v1) · Android (v2)
**Last Updated:** April 2026

---

## 1. Executive Summary
Memoir is a premium, privacy-first, AI-powered memory journal application for iOS and Android. It presents a user's life as a beautifully typeset digital book with realistic page-turn interactions. All data and AI processing remain entirely on-device. Memoir targets emotionally-driven users who want a meaningful, personal, and lasting way to document their lives — and who are willing to pay a recurring subscription for an exceptional, trustworthy experience.

**Core value proposition:** "The most personal app on your phone. Everything lives on your device. It grows smarter the longer you use it."

## 2. Project Overview

### 2.1 Product Background
The digital journaling market is fragmented between utilitarian note-taking apps that lack emotional warmth, and social memory apps that compromise privacy. Memoir fills the premium private-journal segment with a product that combines the aesthetics of a physical book, the intelligence of a local AI model, and the richness of multimedia — all secured behind device-level encryption.

### 2.2 Problem Statement
People want to remember their lives meaningfully but existing tools fail them in three ways:
* **Aesthetics:** Most journaling apps feel like spreadsheets or note apps, not personal artifacts.
* **Privacy:** Cloud-synced apps create unease about who reads the data.
* **Continuity:** No app successfully turns journaling into a lifelong habit.

### 2.3 Solution
Memoir is a book-metaphor journal that stores everything locally, uses a small on-device language model for intelligent features, and employs habit-design principles to build a daily writing ritual. The printed hardcover export and Legacy Vault create deep, long-term lock-in through emotional investment.

### 2.4 Market Opportunity
| Metric | Value | Source / Notes |
| :--- | :--- | :--- |
| **Global journaling app market (2025)** | $1.4B | Statista estimate |
| **Avg. monthly revenue, top journal app (Day One)** | ~$700K | App Store intelligence data |
| **Target addressable users (iOS, EN-speaking markets)** | ~85 million | iPhone journaling-intent users |
| **Estimated conversion to paid (2.5%)** | ~2.1 million | Industry benchmark, lifestyle apps |
| **ARR at $4.99/mo avg.** | $125M+ | Full potential at scale |

### 2.5 Assumptions
* Users prefer local-first privacy over cross-device sync convenience.
* A book metaphor is emotionally superior to list-based or timeline-based journals.
* On-device AI models (1–3B parameters) are sufficient for core personalization features on modern smartphones (2022+).
* A meaningful percentage of power users (target: 5%) will upgrade to Legacy tier for family and print features.

---

## 3. Objectives

### 3.1 Primary Business Objectives
* Achieve 100,000 downloads within 90 days of iOS App Store launch.
* Convert 8% of free users to paid subscribers within the first 30 days.
* Reach $500K MRR within 12 months of launch.
* Maintain a 30-day retention rate of 45%+ (industry average for lifestyle apps: 25%).
* Achieve an App Store rating of 4.7 or above at 1,000+ reviews.

### 3.2 Product Objectives
* Deliver a book-quality UI that users describe as 'beautiful' in qualitative feedback.
* Implement all AI features 100% on-device with zero data egress for journal content.
* Enable the complete writing loop (open app, write, close) in under 60 seconds.
* Ensure the app functions with full feature set in airplane mode.
* Support multimedia entries (text, photo, audio, video) in a single unified page.

### 3.3 Strategic Objectives
* Establish Memoir as the recognized premium standard for private digital journaling.
* Build the printed hardcover export as a category-defining word-of-mouth engine.
* Create the Legacy Vault as a unique feature moat with no direct competitor equivalent.

---

## 4. User Personas

### PERSONA 1 — The Reflective Professional
* **Age:** 28–42
* **Occupation:** Knowledge worker (design, tech, marketing, consulting)
* **Device:** iPhone 14 or newer
* **Journaling experience:** Tried apps and paper notebooks; nothing stuck
* **Goals:** Preserve meaningful life moments without the time cost of elaborate scrapbooking. Reflect privately without the anxiety of cloud storage. Build a lasting personal archive that feels worthy of their life.
* **Pain Points:** Existing apps feel cold and generic. Concerned about privacy — does not want their inner thoughts on a server. Has abandoned journaling habits 3+ times due to lack of engagement.
* **Quote:** "I want something that feels like a real journal — not a database."

### PERSONA 2 — The Family Documenter
* **Age:** 35–60
* **Occupation:** Parent, grandparent, educator
* **Device:** iPhone or mid-range Android
* **Journaling experience:** Baby books, travel diaries, occasional social media posts
* **Goals:** Document children's and grandchildren's milestones in a lasting, organized format. Leave a personal record for future generations. Send a printed book to family each year.
* **Pain Points:** Photos are scattered across iCloud, WhatsApp, and USB drives. Finds most apps too complicated. Wants something tangible — not just digital.
* **Quote:** "I want my grandchildren to know who I was."

### PERSONA 3 — The Creative Journaler
* **Age:** 18–30
* **Occupation:** Student, creative professional, artist
* **Device:** iPhone with Apple Pencil / iPad
* **Journaling experience:** Bullet journaling, art journals, daily diary
* **Goals:** Merge handwritten sketches, photos, voice notes, and prose in one place. Express themselves aesthetically — the look and feel of the journal matters greatly. Build a beautiful, coherent archive of their creative life.
* **Pain Points:** No single app handles text + drawing + audio well. Existing 'beautiful' journal apps are template-rigid with no flexibility. Wants rich personalization — themes, fonts, ink colors — without design expertise.
* **Quote:** "I want my journal to look like me."

---

## 5. Success Metrics / KPIs

### 5.1 Acquisition Metrics
| Metric | Target | Measurement Window | Tool |
| :--- | :--- | :--- | :--- |
| **App Store downloads** | 100,000 | First 90 days | App Store Connect |
| **Organic search ranking** | Top 3 for 'private journal app' | Month 3 | ASO monitoring |
| **Press coverage placements** | 10+ tier-1 editorial mentions | Launch week | Manual tracking |
| **Referral download rate** | 15% of downloads | Ongoing | Branch.io / SKAdNetwork |

### 5.2 Activation Metrics
| Metric | Target | Notes |
| :--- | :--- | :--- |
| **Onboarding completion rate** | >75% | Users who complete cover setup and write first entry |
| **Time to first entry** | <3 minutes | From app open to first published entry |
| **Day-1 retention** | >60% | User returns day after install |
| **Week-1 retention** | >40% | User writes at least 3 entries in first week |

### 5.3 Retention & Revenue Metrics
| Metric | Target | Timeframe |
| :--- | :--- | :--- |
| **D30 retention** | 45%+ | Rolling 30-day cohort |
| **Free-to-Plus conversion** | 8%+ | Within 30 days of install |
| **Plus-to-Legacy upgrade rate** | 5%+ of Plus | Within 90 days of Plus subscription |
| **Monthly Recurring Revenue** | $500K+ | Month 12 post-launch |
| **Churn rate (monthly)** | <3.5% | Subscription cancellations |
| **NPS score** | 50+ | Quarterly in-app survey |
| **Printed book purchase rate** | 12% of Legacy users/year | Annual metric |

### 5.4 Quality Metrics
* **App Store rating:** 4.7+ stars at minimum 1,000 reviews.
* **Crash-free sessions:** 99.5%+ measured via Firebase Crashlytics.
* **AI response latency (on-device):** <2 seconds for all inference tasks.
* **App cold launch time:** <1.5 seconds on iPhone 12 or newer.
* **Battery impact:** <5% per hour of active use during recording.

---

## 6. Key Features & Requirements (MoSCoW)
*(M) = Must Have, (S) = Should Have, (C) = Could Have, (W) = Won't Have*

### 6.1 Book Experience
* **Realistic page-turn animation (M):** Physics-based curl with finger tracking and velocity response.
* **Book cover designer (M):** Choose photo, texture, title font, and binding style.
* **Chapter structure (by month/era) (M):** User-defined chapters. Auto-created monthly by default.
* **Bookshelf view (all years) (M):** Pinch-out from book to see full shelf of all volumes.
* **Table of contents per book (S):** Auto-generated from entry titles and dates.
* **Chapter intro auto-generated by AI (S):** One-paragraph AI summary per chapter, editable.
* **Print-ready PDF export (S):** Layouts match the in-app book exactly.

### 6.2 Entry & Media
* **Rich text editor (M):** Fonts, bold, italic, indent, pull-quote. No markdown required.
* **Photo attachment (up to 20) (M):** Auto-layout in magazine grid. Tap to expand full-screen.
* **Voice recording + transcription (M):** On-device Whisper ASR. Waveform visualization inline.
* **Location tagging (M):** Auto GPS or manual. Rendered as illustrated mini-map on page.
* **Mood selector (M):** 5-state selector (icon + color). Stored for emotion map.
* **Short video (up to 3 min) (S):** Inline playback. AI-suggested highlight trim.
* **Hand-drawn sketches / Pencil (S):** Drawing canvas layer with pressure sensitivity (iPad/Pencil).
* **Sticker overlay system (S):** Curated sticker packs. Drag, rotate, resize on page.
* **Weather auto-tag (C):** Auto-attach local weather conditions to each entry.

### 6.3 On-Device AI Engine
* **Writing companion (autocomplete) (M):** Soft suggestion appears on pause. Tap to accept. Never overwrites.
* **Semantic full-text search (M):** Natural-language search across all entries. Local vector index.
* **Context-aware writing prompts (M):** AI nudge based on last entry topic, days since last write.
* **Memory Echo (On This Day) (M):** Surfaces past entries matching today's date from prior years.
* **Emotion map / mood heatmap (S):** Aggregated mood data visualized as an annual calendar heatmap.
* **Monthly auto-summary (S):** AI-generated one-paragraph digest per chapter. Editable by user.
* **Year in Review generation (S):** Annual visual summary card: top moments, places, people, mood arc.
* **Background photo removal (C):** On-device segmentation for sticker-style photo clippings.
* **AI voice portrait (C):** Synthesized voice from 10-min recording. Reads entries in user's voice.

### 6.4 Personalization
* **Page themes (8 at launch) (M):** Linen, cream, dark ink, watercolor, graph paper, leather, etc.
* **Ink color palette (12 tones) (M):** Curated ink colors: sepia, slate, forest, burgundy, etc.
* **Typography pairs (6 pairs) (M):** Curated font combos. No raw font picker exposed to user.
* **Monthly sticker drops (S):** New sticker pack unlocked for Plus subscribers each month.
* **Artist marketplace for themes/stickers (C):** Community-designed; creator revenue share.

### 6.5 Retention & Habit Features
* **Soft daily reminder (configurable) (M):** One notification per day. Beautiful card style, not generic.
* **Warmth Streak meter (M):** Candle-flame streak that dims (not dies) on missed days.
* **Time Capsule mode (S):** Lock an entry until a user-specified future date.
* **365-day challenge tracker (S):** Illustrated progress tracker. Year-end badge + reward.
* **Weekly Digest notification (S):** Sunday AI summary of the week's entries.
* **Annual Year in Review (S):** Delivered every January 1st. Shareable image card.

---

## 7. User Stories

### 7.1 Onboarding
* **US-001:** As a new user, I want to set up my book cover on first launch so I feel ownership of the app immediately. *(Criteria: Cover designer shown after permissions. User can pick photo, title, texture. Skippable. Defaults applied.)*
* **US-002:** As a new user, I want a privacy promise screen that explains my data never leaves my device so I trust the app. *(Criteria: Shown on first launch. Plain-language statement. Dismissible. Stored as seen.)*
* **US-003:** As a user, I want to write my first entry with a gentle guided prompt so I don't face blank-page paralysis. *(Criteria: AI-generated prompt appears in empty first entry. Dismissible.)*

### 7.2 Core Writing
* **US-010:** As a journaler, I want to add text, photos, and voice to the same page so my entries feel complete. *(Criteria: All three media types addable within a single entry. Displayed inline on page.)*
* **US-011:** As a user, I want to flip through my journal like a real book so the experience feels emotionally meaningful. *(Criteria: Page-turn gesture responds to swipe with curl animation <16ms frame time.)*
* **US-012:** As a user, I want the AI to suggest how to continue my writing when I pause so I never feel stuck. *(Criteria: Suggestion appears after 8-second pause. Greyed italic text. Tap-to-accept. Ignore fades after 3s.)*
* **US-013:** As a user, I want to tag my location automatically so I remember where each memory happened. *(Criteria: GPS coordinates captured on entry create. Rendered as mini-map. Editable.)*
* **US-014:** As a user, I want to record a voice note that is transcribed automatically so I can journal without typing. *(Criteria: Voice recording initiates immediately. On-device Whisper ASR produces transcript within 10s per minute of audio.)*

### 7.3 AI & Personalization
* **US-020:** As a user, I want to search my journal by meaning so I can find memories even if I don't remember exact words. *(Criteria: Semantic search returns results in <3s on-device. Top 5 results ranked by relevance.)*
* **US-021:** As a user, I want to receive a Memory Echo each morning so I rediscover past entries I had forgotten. *(Criteria: Push notification 8am local time (configurable). Tapping opens the referenced entry.)*
* **US-022:** As a user, I want to see my emotional year at a glance so I can reflect on patterns in my life. *(Criteria: Heatmap calendar shows mood data for all entries. Color-coded by mood state. Tapping a day opens that entry.)*

### 7.4 Subscription & Paywall
* **US-030:** As a free user, I want to understand clearly what I gain from subscribing so the upgrade feels worth it. *(Criteria: Paywall shown contextually when hitting limits. Feature-led, not threat-led. Side-by-side tier comparison.)*
* **US-031:** As a Plus subscriber, I want to unlock all themes, AI features, and media types without further friction. *(Criteria: Subscription verified on launch. All Plus features unlocked immediately. No in-app prompts to upgrade.)*
* **US-032:** As a Legacy subscriber, I want to order a printed hardcover of my year so I have a physical artifact. *(Criteria: Print order flow accessible from book cover long-press. Partner integration. Delivery tracked in-app.)*

---

## 8. UX & Design Requirements

### 8.1 Design Principles
* **Warmth over efficiency:** Every interaction should feel crafted, not automated.
* **Invisible technology:** AI features should feel like magic, not software.
* **Negative space is premium:** Use whitespace generously. Density signals low quality.
* **One decision at a time:** Reduce choice during journaling. Max one CTA per screen.
* **The book is sacred:** Never break the book metaphor for functional UI chrome.

### 8.2 Navigation Structure
| Screen | Access Method | Description |
| :--- | :--- | :--- |
| **Shelf (Home)** | Pinch out from any book | Visual bookcase. All volumes by year. Tap to open. |
| **Book (Current)** | App launch default | Open to last-read page. Swipe to turn pages. |
| **Entry Editor** | Tap '+' on any page | Full-screen. Rich media tools in bottom toolbar. |
| **Search** | Pull down gesture in book | Semantic search with filters by date, mood, media type. |
| **Settings** | Long press on shelf | Theme, AI preferences, subscription, backup, privacy. |
| **Paywall** | Contextual trigger | Shown when free tier limit reached. |

### 8.3 Design Specifications
* **Typography:** Minimum body size 16pt. Heading hierarchy uses 3 levels max per screen.
* **Color:** Single-hue palette per theme. System-defined dark mode support required.
* **Touch targets:** Minimum 44x44pt per Apple HIG and Android Material guidelines.
* **Animation:** Page-turn max 400ms. All other transitions max 250ms. Respect reduce-motion.
* **Accessibility:** Full VoiceOver / TalkBack support. Dynamic type scaling. 4.5:1 contrast minimum.
* **Empty states:** Every empty screen has a warm, illustrated empty state with a guiding prompt.

### 8.4 Onboarding Flow
1. Splash / brand moment (1.5 seconds)
2. Privacy promise screen — plain language, no jargon
3. Book cover designer — name, photo, texture
4. Notification permission request — framed as 'Memory Echoes', not generic push
5. First entry — pre-filled with a gentle AI writing prompt
6. Book reveal — animated first page-turn to the completed first entry

### 8.5 Accessibility Requirements
* **VoiceOver / TalkBack:** All interactive elements labeled. Page-turn gesture has alternative button.
* **Dynamic Type:** All text scales from minimum to accessibility sizes without layout breaks.
* **Color blindness:** Mood states distinguished by icon shape + color, never color alone.
* **Reduce Motion:** Page-turn falls back to cross-fade. All physics animations disabled.

---

## 9. Technical Requirements

### 9.1 Platform & Development Requirements
* **iOS:** iOS 17.0+ Minimum (Required for native SwiftData and modern SwiftUI APIs).
* **Architecture Rules:** The codebase must strictly utilize `async/await` for concurrency. Legacy iOS paradigms (completion handlers, delegates, UIKit) are banned unless strictly required for third-party bridging.
* **Rich Text Handling:** Utilize `RichTextKit` (or equivalent robust open-source library) to manage complex text formatting, saving weeks of solo development time.
* **AI Coding Guardrails:** A `.cursorrules` file must be maintained to force AI code generators to adhere to iOS 17+ SwiftUI/SwiftData standards.

### 9.2 Data Architecture
* **Primary datastore:** SQLite via Core Data (iOS) / Room (Android). No external database.
* **Media storage:** Compressed and stored in app-sandboxed file system. Photos max 4K, video 1080p.
* **Encryption:** AES-256 encryption at rest. Key stored in Secure Enclave (iOS) / Android Keystore.
* **Biometric guard:** FaceID / TouchID / Biometric authentication on app open (configurable).
* **Vector store:** On-device embedding index for semantic search (FAISS or custom lightweight store).
* **Backup:** Optional encrypted export to iCloud / Google Drive. Zero-knowledge — server cannot decrypt.

### 9.3 AI Engine Requirements
* **Language model:** Quantized LLM 1–3B params (e.g., Phi-3 Mini, Gemma 2B). Must run on iPhone 12 or newer. Max 2s response time.
* **Speech-to-text:** Whisper base model via CoreML. On-device only. Max 10s per minute of audio.
* **Semantic search embeddings:** MiniLM or equivalent local embedding model. Index built incrementally. Search <3s on 10,000 entries.
* **Emotion classifier:** Lightweight BERT-style classifier (<50M params). Runs on entry save. 5 mood classes minimum.
* **Image background removal:** MLKit Selfie Segmentation or CoreML equivalent. Phase 2. On-device only.

### 9.4 Performance & UI Requirements
* **Cold app launch time:** <1.5 seconds (iPhone 12, cold start, empty cache).
* **Page-turn animation:** 60 fps sustained. v1.0 will utilize high-performance native SwiftUI transitions (slide/fade). Complex 3D physics are deferred to v2.0 to guarantee stability.
* **App size (initial download):** <150 MB (Heavy AI models downloaded post-install on demand, or utilizing Apple's native ML frameworks for v1.0).

### 9.5 Security Requirements
* All journal content encrypted at rest with AES-256 before writing to disk.
* Encryption key derived from device Secure Enclave; never written to iCloud or logs.
* No analytics SDK shall have access to entry content, AI prompts, or user-authored text.
* Subscription validation performed via StoreKit 2 (iOS) / Google Play Billing v5 (Android).
* Optional app-level passcode (4-digit or biometric) as secondary lock layer.
* Backup files encrypted with user-generated key. Key not stored by Memoir or any server.
* Crash reporting (e.g., Firebase Crashlytics) captures only stack traces — zero user content.

---

## 10. Subscription & Monetization

### 10.1 Subscription Tiers
| Tier | Price | Annual Option | Key Inclusions |
| :--- | :--- | :--- | :--- |
| **Free** | $0 | — | Up to 50 entries, text + photos only, 3 themes, 1 cover style |
| **Memoir Plus** | $4.99/mo | $39.99/yr (save 33%) | Unlimited entries, all media, all themes, full AI, monthly sticker pack, PDF export, encrypted backup |
| **Memoir Legacy** | $9.99/mo | $79.99/yr (save 33%) | Everything in Plus + printed hardcover, family sharing (5), Legacy Vault, AI voice portrait, encrypted will messages |

### 10.2 In-App Purchases (One-Time)
| Product | Price | Description |
| :--- | :--- | :--- |
| **Printed Hardcover Book** | $24.99–$34.99 | Full-year print-on-demand hardcover. Partner-fulfilled. |
| **Theme Pack** | $1.99 | Individual premium theme (seasonal, artist-designed). |
| **Sticker Collection** | $0.99–$2.99 | Artist-designed sticker sets. |
| **Legacy Vault Add-On** | $49.99 (lifetime) | Legacy Vault for non-Legacy subscribers. One-time fee. |
| **Gift Subscription (1 year Plus)** | $39.99 | Redeemable App Store gift. Drives word-of-mouth. |

### 10.3 Free-to-Paid Conversion Strategy
* Paywall triggers contextually at the 45th entry (near 50-entry limit) — not on first open.
* 7-day free trial for Plus offered once, triggered at the paywall or after Day 3.
* 'What you'd unlock' feature preview shown inline before paywall CTA.
* No ads, no nag screens. Single, beautiful paywall view presented no more than once per week.

---

## 11. Scope of Work

### 11.1 In Scope — v1.0 Launch
* iOS application (iPhone + iPad) targeting iOS 16+.
* Book UI with page-turn engine, shelf view, and chapter structure.
* Entry editor supporting text, photos, voice recording + transcription, mood, and location.
* On-device AI: writing assistant, semantic search, writing prompts, Memory Echo.
* Personalization: 8 themes, 12 ink colors, 6 typography pairs, cover designer.
* Free + Plus subscription tiers via StoreKit 2.
* Encrypted local storage and optional iCloud backup.
* Warmth Streak, daily reminder, onboarding flow.
* App Store submission and launch.

### 11.2 Out of Scope — v1.0
* Android application (targeted for v2.0, Month 5–8).
* Legacy tier (Month 9+): printed books, family sharing, Legacy Vault, AI voice portrait.
* Sticker marketplace / creator program.
* Apple Watch companion app.
* Web application (indefinitely out of scope — violates local-first philosophy).
* Social sharing or community features of any kind.
* Cross-device real-time sync (encrypted backup is offered instead).

### 11.3 Team Requirements
* **iOS Engineer (Senior) x2:** SwiftUI, CoreML, AVFoundation, page-turn engine.
* **AI / ML Engineer x1:** Model selection, quantization, on-device inference optimization.
* **Product Designer (UI/UX) x1:** Book UI, theme system, design system, motion design.
* **Backend Engineer x1:** Subscription validation, print partner API, analytics (no user content).
* **QA Engineer x1:** Test suite, device matrix testing, performance benchmarking.
* **Product Owner x1:** Roadmap, stakeholder alignment, sprint planning, launch coordination.

---

## 12. Dependencies

### 12.1 External Technical Dependencies
* **Apple CoreML:** Platform SDK. On-device model inference (iOS). Low risk.
* **Whisper ASR model:** AI Model. On-device voice transcription. Low risk.
* **Phi-3 Mini or Gemma 2B:** AI Model. Writing assistant, prompts, summaries. Medium risk (license review).
* **StoreKit 2:** Platform SDK. Subscription management (iOS). Low risk.
* **Blurb or MagCloud API:** 3rd Party Service. Print-on-demand hardcover fulfillment. High risk.
* **Firebase Crashlytics:** Analytics SDK. Crash reporting only (zero content access). Low risk.
* **FAISS:** Library. Local vector search index. Low risk.

### 12.2 Legal & Compliance Dependencies
* App Store Review Guidelines compliance — specifically Section 5.1 (Privacy) and 3.1 (Payments).
* GDPR compliance for EU users: local-only processing satisfies Article 25 by design. Legal review required.
* CCPA compliance for California users: privacy policy must explicitly state no data sale.
* AI model licenses: Phi-3 Mini (MIT) and Gemma 2B (custom Google license) — review required for commercial use.
* Print partner contract: fulfillment SLA, refund policy, and user data handling agreement.
* Music and sound assets (if used in onboarding): requires full commercial licensing.

---

## 13. Timeline

### 13.1 Phased Roadmap Overview
* **Phase 1 (Months 1–4): Foundation.** iOS v1.0 Launch. Deliverables: Book UI, entry editor (text + photo), 3 themes, Free + Plus tiers, iCloud backup, App Store launch.
* **Phase 2 (Months 5–8): Intelligence.** AI Feature Release. Deliverables: On-device AI (writing assist, search, prompts, Memory Echo), audio/video, full theme library, sticker store, emotion map.
* **Phase 3 (Months 9–13): Legacy.** Legacy Tier Launch. Deliverables: Printed hardcover, Legacy Vault, family sharing, Year in Review, Time Capsule, Android beta.
* **Phase 4 (Months 14–18): Ecosystem.** Android GA + Ecosystem. Deliverables: AI Voice Portrait, Watch app, widget gallery, theme marketplace, Android full launch.

### 13.2 Phase 1 Sprint Breakdown
* **S1 (Wk 1-2): Core shell.** Project setup, CI/CD, design system, navigation skeleton.
* **S2 (Wk 3-4): Book engine.** Page-turn physics, bookshelf, chapter structure.
* **S3 (Wk 5-6): Entry editor.** Text editor, photo import, mood selector, location tag.
* **S4 (Wk 7-8): Personalization.** 3 themes, ink colors, typography pairs, cover designer.
* **S5 (Wk 9-10): Voice & AI basics.** Voice recording, Whisper ASR, writing prompts.
* **S6 (Wk 11-12): Subscription.** StoreKit 2, Free/Plus tiers, paywall, encrypted backup.
* **S7 (Wk 13-14): Polish + QA.** Performance, accessibility, edge cases, device matrix.
* **S8 (Wk 15-16): Launch.** App Store submission, ASO, press kit, launch.

---

## 14. Competitive Analysis
* **Day One:** Strengths: Polished iOS app, E2E encrypted. Weaknesses: No AI, timeline view only, no book metaphor. Memoir Advantage: Book UI + AI + Print + Legacy Vault.
* **Daylio:** Strengths: Habit-forming, quick logging. Weaknesses: No rich media, gamified, not emotional. Memoir Advantage: Full multimedia + emotional depth + privacy.
* **Journey:** Strengths: Cross-platform. Weaknesses: Cloud-dependent AI violates privacy. Memoir Advantage: On-device AI, superior design.
* **Apple Journal:** Strengths: Native, free. Weaknesses: Minimal features, no personalization. Memoir Advantage: Professional-grade, AI, Print.

---

## 15. Open Questions & Risks

### 15.1 Open Questions
* **Q-001:** Which on-device LLM achieves the best quality-latency tradeoff on iPhone 12? (Owner: ML Engineer, Target: Sprint S5)
* **Q-002:** What is the correct free-tier entry limit to maximize conversion? (Owner: Product Owner, Target: Pre-launch A/B test)
* **Q-003:** Which print-on-demand partner offers the best integration for the hardcover feature? (Owner: Backend Engineer, Target: Month 7)
* **Q-004:** Should AI Voice Portrait require opt-in consent flow? (Owner: Legal + PM, Target: Phase 3 kickoff)
* **Q-005:** Should Android offer full feature parity in Phase 2? (Owner: Product Owner + Eng Lead, Target: End of Phase 1)

### 15.2 Risk Register
* **On-device LLM quality insufficient (Med/High):** Mitigation: Conduct quality evaluation pre-launch. Offer opt-out if below bar.
* **Page-turn engine performance drops (Med/High):** Mitigation: Define device floor as iPhone 12. Benchmark continuously.
* **Apple rejects app due to AI policy (Low/High):** Mitigation: Consult App Store guidelines early. No generated images.
* **Print partner integration delayed (High/Med):** Mitigation: Begin outreach in Month 2. MVP print via PDF export.
* **Low free-to-paid conversion rate (Med/High):** Mitigation: A/B test entry limit. Validate paywall design via testing.
* **On-device AI model size too large (Med/Med):** Mitigation: Use post-install on-demand download for AI model.

---

## 16. Privacy & Compliance
* **Core Privacy Principle:** Memoir has never read your diary. Neither has anyone else. This is not a policy statement — it is an architectural guarantee.
* Journal content never leaves the device unless the user explicitly initiates an encrypted backup.
* All AI inference runs locally. No entry text, voice audio, or prompts are sent to any server.
* Analytics are limited to non-content events only (e.g., 'entry created', 'theme changed'). No content, no screenshots, no entry length.
* App Store privacy nutrition label will declare: Data Not Collected for all journal content categories.
* GDPR: Local-only processing satisfies data minimization (Article 5) and privacy by design (Article 25). No DPA required for journal content.
* COPPA: App is rated 17+ on App Store. No features designed for users under 13.
* Biometric prompt is optional but recommended during onboarding.

---

## 17. Supporting Documents
* Memoir Design System & Component Library (Status: In Progress)
* On-Device AI Model Evaluation Report (Status: Not Started)
* App Store ASO Strategy & Keyword Research (Status: Not Started)
* Print Partner Comparison & RFP (Status: Not Started)
* Privacy Policy (Status: Not Started)
* Subscription Pricing Research Report (Status: Not Started)
* Competitive Analysis Deep Dive (Status: Draft)
* User Research: Personas Validation Study (Status: Not Started)
* Phase 1 Sprint Board (Status: Not Started)

---

## 18. Glossary
* **ASR:** Automatic Speech Recognition. Technology that converts spoken audio to text.
* **CoreML:** Apple's machine learning framework for running AI models on-device on iOS/macOS.
* **LiteRT:** Google's runtime (formerly TensorFlow Lite) for running ML models on Android devices.
* **Semantic Search:** Search that understands meaning and intent, not just keyword matching.
* **Vector Store:** A database that stores mathematical representations (embeddings) of text for semantic search.
* **StoreKit 2:** Apple's framework for managing in-app purchases and subscriptions.
* **Legacy Vault:** A Memoir feature that locks selected entries and messages to be unlocked after the user's passing.
* **Memory Echo:** A daily notification showing an entry written on this day in a previous year.
* **Warmth Streak:** Memoir's habit-tracking mechanic: a candle-flame that dims (not resets) on missed days.
* **Zero-Knowledge Encryption:** Encryption where the service provider cannot decrypt the user's data, even if compelled.
