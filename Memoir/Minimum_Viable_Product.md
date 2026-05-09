# Memoir: Tactical MVP Scope & Build Schedule
## 1. Problem Statement & Goal

* **Problem:** The competitor landscape (Day One, Daylio, Journey) is either too utilitarian, too social, or not private enough. Memoir solves an emotional problem, not a functional one. 
* **Goal / Value Proposition:** Memoir is a private, AI-powered life journal that feels like a premium handcrafted book—not a social app, not a cold utility. It is the most personal app on your phone. Everything lives on your device. 

## 2. Target Audience

* **The Reflective Adult (25-45):** Busy, nostalgic, wants something meaningful but is overwhelmed by generic tools. Willing to pay for beauty and quality. 
* **The Parent or Grandparent (35-70):** Wants to document family milestones, preserve stories for their children. High emotional investment, low tolerance for complexity. 
* **The Creative Journaler (18-35):** Already writes diaries or bullet journals. Looking to go digital without losing the analog warmth. Loves personalization. 

## 3. MVP Type

* **Single-Feature / High-Fidelity MVP:** The MVP focuses intensely on perfecting the core "Book Interface" and establishing the privacy architecture. The book metaphor creates an experience so unlike any other app that users feel ownership—this is their book. 

## 4. Minimum Feature Set (Scope for Phase 1)

Based on the defined Phase 1 MVP roadmap: 

* **Must-Have (MVP Scope):** * Book UI + page turn. 
  * Text + photo entry. 
  * 3 themes. 
  * Free + Plus tiers. 
  * Cloud backup. 
  * iOS launch. 

* **Out of Scope (Deferred to Phase 2+):** AI core, audio + video, on-device LLM, Emotion map, Memory Echo, and Smart prompts. 

## 5. User Personas & Journeys

**The Core MVP Journey:** 1. When the user opens Memoir, they see a physical-feeling book. 
2. Inside, each "chapter" is a month or life era (they define it). Entries are beautifully typeset, not list-view items. 
3. Users can add text via a full rich-text editor with multiple fonts. 
4. Users can add up to 20 photos per entry. 
5. Pages turn with a realistic curl animation. 

## 6. Success Metrics (KPIs)

* **Validation:** Validate the book UI prototype with 20 target users. 
* **Pre-Launch Traction:** Build an email waitlist with a beautifully designed landing page. Measure engagement with a single viral mechanic: "Show us your most memorable day this year—in one photo and one sentence." 
* **Conversion Rate:** Testing the upgrade path from the Free tier (Up to 50 entries) to the Memoir Plus tier ($4.99 per month).

**Project Philosophy:** Move fast, rely on native iOS frameworks, and let the AI tools handle the boilerplate. If a feature takes more than three days to Vibe Code, it is cut from this MVP and moved to Phase 2.

## Proposed Timeline 

## 1. Scope Adjustments (The "Reality Check" Fixes)
To guarantee we hit the June 13 deadline as a solo developer using AI, the following strict boundaries are applied to v1.0:
* **Media Limits:** Entries are capped at **10 photos maximum** (resolves storage and UI layout complexity).
* **Rich Text Editor:** We will NOT build this from scratch. We will use the open-source **`RichTextKit`** to handle custom fonts and formatting.
* **Cloud Backup:** Active cloud syncing (CloudKit) is removed from MVP. We rely entirely on Apple's **Passive iCloud Device Backup** (zero build effort).
* **Analytics:** We will implement **PostHog** (for privacy-compliant event tracking) and **Firebase Crashlytics** to ensure we aren't blind at launch.

---

## 2. Milestone Timeline (April 6 – June 13)

### Milestone 1: Foundation & Ideation
*Aligned with: "Opening Broadcast" (April 6) & "Idea Generation and Product Mindset" (April 11)*
* **In Scope:** Defining the core sandbox. Capping photos at 10. Finalizing the feature list and establishing the "Private by Design" mantra.
* **Deliverable:** A finalized 1-page design brief ready for UI generation.

### Milestone 2: The "Vibe Coding" Infrastructure
*Aligned with: "Vibe Coding and Cursor IDE" (April 18)*
* **In Scope:** * Initializing the Xcode/SwiftUI project.
  * Setting up the `.cursorrules` file to strictly enforce iOS 17+, SwiftData, and `async/await`.
  * **Dependency Injection:** Adding `RichTextKit` to the project to instantly solve the complex text editor problem.
* **Deliverable:** A compiling, blank iOS app with a structured folder system and strict AI guardrails.

### Milestone 3: Ecosystem & Capabilities
*Aligned with: "AI Ecosystem and API Usage" (April 25)*
* **In Scope:** Integrating Apple's native APIs. Native `Speech` framework for voice-to-text transcription and `NaturalLanguage` for basic sentiment/mood tracking.
* **Deliverable:** A working prototype screen for native transcription and sentiment analysis.

### Milestone 4: The Interface Build & Onboarding
*Aligned with: "Mobile Interface (UI/UX) and Development Environment" (May 2)*
* **In Scope:** * **The Shelf View & Editor:** Building the UI utilizing `RichTextKit`.
  * **Page Transitions:** Implementing SwiftUI native `.transition(.slide)` (No 3D physics).
  * **The 4-Screen Onboarding Flow:** (1) Privacy promise, (2) Book name + cover photo, (3) Notification permission ("Morning Memories"), (4) First entry prompt.
* **Deliverable:** The complete visual frontend, including a flawless 90-second onboarding loop.

### Milestone 5: Local Storage, Backend & Telemetry
*Aligned with: "Database and Backend Integration" (May 9)*
* **In Scope:** * **SwiftData:** For local entry saving. 
  * **RevenueCat:** To handle the $4.99/mo paywall after 50 entries.
  * **Telemetry:** Installing PostHog (event tracking, e.g., "paywall seen") and Firebase Crashlytics.
  * *Note: Relying strictly on passive iCloud backups; no custom sync logic.*
* **Deliverable:** A fully functioning app where entries persist locally, the paywall triggers, and crash data is securely reported.

### Milestone 6: Core Intelligence
*Aligned with: "Core Artificial Intelligence Logic" (May 16)*
* **In Scope:** * **The Morning Ritual:** Local push notifications triggering at 8:00 AM with a past memory.
  * **The Warmth Streak:** A simple integer counter linked to SwiftData.
* **Deliverable:** Retention mechanics are fully active.

### Milestone 7: Structured Testing & Polish
*Aligned with the gap leading up to: "Testing, Debugging, and Optimization" (June 6)*
* **Scope Focus:** We structure this 3-week gap strictly to avoid feature creep.
  * **Week 1 (May 16–23):** TestFlight beta distribution to 10 external testers + physical device testing.
  * **Week 2 (May 24–30):** RevenueCat end-to-end QA (testing the upgrade flow) + UI layout fixes for smaller screens (iPhone SE/13 mini).
  * **Week 3 (May 31–June 6):** Generating App Store screenshots, writing metadata, and finalizing the privacy policy.
* **Deliverable:** A heavily tested, crash-free Release Candidate (RC) binary.

### Milestone 8: App Store Launch
*Aligned with: "Store Release and Go Live" (June 13)*
* **Scope Focus:** * Submitting the first binary to Apple for review (targeting June 6 submission to account for Apple's 1-14 day review timeline). 
  * Navigating any potential App Store rejections (usually metadata or IAP configuration).
* **Deliverable:** Memoir v1.0 officially goes live on the App Store on or around June 13, depending on Apple's exact approval speed.
