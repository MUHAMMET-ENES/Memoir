import Foundation
import RevenueCat

/// StoreKit 2 via RevenueCat — syncs entitlements to Supabase via webhook.
@MainActor
final class SubscriptionManager: ObservableObject {
    static let shared = SubscriptionManager()

    @Published var isPlus = false
    @Published var isLegacy = false

    private init() {}

    func configure() async {
        guard let key = Config.revenueCatAPIKey, !key.isEmpty else { return }
        Purchases.logLevel = .debug
        Purchases.configure(withAPIKey: key)
        if let userId = SupabaseService.shared.currentUserId {
            try? await Purchases.shared.logIn(userId)
        }
        await refreshEntitlements()
    }

    func refreshEntitlements() async {
        do {
            let info = try await Purchases.shared.customerInfo()
            isPlus = info.entitlements["memoir_plus"]?.isActive == true
            isLegacy = info.entitlements["memoir_legacy"]?.isActive == true
        } catch {
            isPlus = false
            isLegacy = false
        }
    }

    func purchasePlusAnnual() async throws {
        let offerings = try await Purchases.shared.offerings()
        guard let package = offerings.current?.annual else {
            throw SubscriptionError.noPackage
        }
        _ = try await Purchases.shared.purchase(package: package)
        await refreshEntitlements()
    }

    func restorePurchases() async throws {
        _ = try await Purchases.shared.restorePurchases()
        await refreshEntitlements()
    }

    enum SubscriptionError: Error {
        case noPackage
    }
}
