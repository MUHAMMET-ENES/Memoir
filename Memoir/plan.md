# Memoir - Engineering Implementation Plan & Scope Breakdown

## Project Architecture & AI Context
You are an expert full-stack developer assisting in building "Memoir," a premium, privacy-first, AI-powered memory journal.
- **The Privacy Mandate:** Journal content, photos, and voice notes NEVER leave the device. All AI processing runs locally. 
- **System Architecture:** To satisfy separation of concerns, the project is split into two distinct, isolated directories and services:
  1. `/frontend`: Native iOS Application (SwiftUI, SwiftData, CoreML). Target: iOS 17+.
  2. `/backend`: Node.js/Express Microservice. Strictly handles non-user-content tasks (subscriptions, remote configuration, third-party API webhooks).

---

## Milestone 1: Initial Service Separation & Setup (Current Focus)

### Step 1.1: Root Repository Configuration
- [ ] Initialize Git repository.
- [ ] Create `.cursorrules` file at the root defining strict coding standards for both environments (e.g., "Always use SwiftData for iOS", "Use ES6 syntax for Node.js").
- [ ] Create `.gitignore` to prevent committing `node_modules`, `Pods`, `.env` files, and local build artifacts.

### Step 1.2: Backend Microservice Initialization (`/backend`)
- [ ] Create `/backend` directory.
- [ ] Initialize a new Node.js project (`npm init -y`).
- [ ] Install essential dependencies: `express`, `cors`, `dotenv`, `body-parser`.
- [ ] Set up basic Express server in `server.js` or `index.js`.
- [ ] Create a `GET /health` endpoint to verify the service is running.
- [ ] Create a placeholder `POST /webhooks/revenuecat` route for future subscription handling.

### Step 1.3: Frontend iOS App Initialization (`/frontend`)
- [ ] Create `/frontend` directory.
- [ ] Initialize a new Xcode project targeting iOS 17+ using SwiftUI.
- [ ] Set up the internal directory structure following MVVM architecture (`/Models`, `/Views`, `/ViewModels`, `/Services`, `/Utils`).
- [ ] Configure the basic App entry point and initial `ContentView`.

---

## Milestone 2: Frontend Core UI & Local Storage

### Step 2.1: Local Database Schema (100% Local)
- [ ] Implement SwiftData models for `Book`, `Chapter`, `Entry`, and `MediaItem`.
- [ ] Configure SwiftData container in the main App file, ensuring AES-256 encryption at rest via the iOS File System.

### Step 2.2: The Book Metaphor Navigation
- [ ] Build the "Shelf View" (`LazyVGrid`) displaying historical volumes.
- [ ] Implement elegant page navigation using SwiftUI `.transition(.slide)` or cross-fade to mimic turning a page smoothly, avoiding complex 3D rendering for the MVP phase.

---

## Milestone 3: The Entry Editor & Media Handling

### Step 3.1: Rich Text Integration
- [ ] Integrate `RichTextKit` (or standard native equivalents) to support bold, italic, and curated editorial typography pairs.
- [ ] Build the text editor view, ensuring a distraction-free, aesthetic UI.

### Step 3.2: Multimedia Grid
- [ ] Implement the native iOS photo picker (PhotosUI).
- [ ] Build an auto-layout masonry grid capable of displaying up to 20 photos per entry inline with the text.

---

## Milestone 4: On-Device AI & Ambient Context

### Step 4.1: Native Voice Transcription
- [ ] Implement an inline voice recording UI.
- [ ] Integrate Apple's native Speech framework for on-device ASR (Automatic Speech Recognition) transcription.

### Step 4.2: Ambient Data Capture
- [ ] Request location permissions upon first entry creation.
- [ ] Auto-tag GPS location coordinates and render them as a stylized mini-map within the entry.
- [ ] Integrate Apple's `NaturalLanguage` framework to auto-detect mood/sentiment from entry text locally.

---

## Milestone 5: Monetization & Backend Integration

### Step 5.1: The Habit Loop (Frontend)
- [ ] Implement the "Warmth Streak" logic—a habit-tracking integer that controls the visual state of a flame icon.
- [ ] Schedule local notifications for the "Memory Echo" (Morning Ritual).

### Step 5.2: Paywall & Subscriptions
- [ ] Integrate the RevenueCat SDK into the iOS app.
- [ ] Build the Paywall UI restricting users after 50 free entries, promoting the $4.99/mo Plus tier.

### Step 5.3: Backend Webhook Verification (`/backend`)
- [ ] Finalize the `/webhooks/revenuecat` endpoint on the Node.js server to securely verify and log premium status changes from Apple StoreKit.
