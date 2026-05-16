import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var auth: AuthViewModel

    var body: some View {
        List {
            Section("Legal") {
                Link("Privacy Policy", destination: URL(string: "\(Config.webBaseURL)/privacy")!)
                Link("Terms of Service", destination: URL(string: "\(Config.webBaseURL)/terms")!)
            }
            Section("Account") {
                Button("Delete account", role: .destructive) {
                    Task { await auth.deleteAccount() }
                }
            }
        }
        .navigationTitle("Settings")
    }
}
