import SwiftUI

struct HeirloomListView: View {
    @EnvironmentObject var subscriptions: SubscriptionManager
    @State private var interviews: [InterviewRow] = []
    @State private var showPaywall = false

    var body: some View {
        NavigationStack {
            List(interviews) { iv in
                NavigationLink {
                    Text(iv.title)
                } label: {
                    VStack(alignment: .leading) {
                        Text(iv.title).font(.custom("Georgia", size: 17))
                        Text(iv.status.uppercased())
                            .font(.caption2)
                            .tracking(2)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Interviews")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("New") {
                        if !subscriptions.isPlus && !subscriptions.isLegacy && interviews.count >= 1 {
                            showPaywall = true
                        }
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    NavigationLink("Settings") { SettingsView() }
                }
            }
            .sheet(isPresented: $showPaywall) {
                PaywallView()
            }
        }
        .task {
            interviews = (try? await SupabaseService.shared.fetchInterviews()) ?? []
        }
    }
}
