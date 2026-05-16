import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var session: String?

    func deleteAccount() async {
        // Invoke Supabase edge function delete-account with user JWT
        await signOut()
    }

    func signOut() async {
        session = nil
    }
}
