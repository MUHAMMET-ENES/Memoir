# Memoir iOS

Native SwiftUI app for heirloom interviews. Shares Supabase backend with the web app.

## Setup

1. Open `Memoir.xcodeproj` in Xcode 15+ (create project from these sources or add files to a new iOS 17+ app).
2. Add Swift Package dependencies:
   - [supabase-swift](https://github.com/supabase/supabase-swift)
   - [RevenueCat/purchases-ios](https://github.com/RevenueCat/purchases-ios)
3. Copy `Config.example.plist` to `Config.plist` and set:
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
   - `REVENUECAT_API_KEY`
4. In App Store Connect, create products:
   - `memoir_plus_monthly`, `memoir_plus_annual` (subscriptions)
   - `memoir_legacy_print` (non-consumable)
5. Map entitlements in RevenueCat: `memoir_plus`, `memoir_legacy`.
6. Point RevenueCat webhook to Supabase `revenuecat-webhook` function.

## App Store compliance

- Sign in with Apple (required if offering other OAuth)
- Account deletion: Settings → Delete account
- Privacy Policy & Terms: hosted at your web `/privacy` and `/terms`
- Microphone usage: `NSMicrophoneUsageDescription` in Info.plist
- Subscription management link in paywall (Apple requirement)
