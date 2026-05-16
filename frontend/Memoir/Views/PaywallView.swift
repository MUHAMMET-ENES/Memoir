import SwiftUI

struct PaywallView: View {
    @EnvironmentObject var subscriptions: SubscriptionManager
    @Environment(\.dismiss) private var dismiss
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 20) {
                Text("Memoir Plus")
                    .font(.largeTitle)
                    .fontDesign(.serif)
                Text("Unlimited heirloom interviews, voice playback, and PDF export.")
                    .foregroundStyle(.secondary)

                Button("Annual — $49.99/yr") {
                    Task {
                        do {
                            try await subscriptions.purchasePlusAnnual()
                            dismiss()
                        } catch {
                            errorMessage = error.localizedDescription
                        }
                    }
                }
                .buttonStyle(.borderedProminent)

                Button("Restore purchases") {
                    Task {
                        try? await subscriptions.restorePurchases()
                    }
                }

                Link("Manage subscription", destination: URL(string: "https://apps.apple.com/account/subscriptions")!)
                    .font(.footnote)

                if let errorMessage {
                    Text(errorMessage).font(.caption).foregroundStyle(.red)
                }

                Spacer()
            }
            .padding()
            .navigationTitle("Upgrade")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
}
