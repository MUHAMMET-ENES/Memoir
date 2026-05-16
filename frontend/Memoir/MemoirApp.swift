import SwiftUI

@main
struct MemoirApp: App {
    @StateObject private var auth = AuthViewModel()
    @StateObject private var subscriptions = SubscriptionManager.shared

    var body: some Scene {
        WindowGroup {
            Group {
                if auth.session == nil {
                    AuthView()
                } else {
                    HeirloomListView()
                }
            }
            .environmentObject(auth)
            .environmentObject(subscriptions)
            .task {
                await subscriptions.configure()
            }
        }
    }
}
