import Foundation

/// Thin wrapper — wire supabase-swift client in Xcode.
final class SupabaseService {
    static let shared = SupabaseService()

    var currentUserId: String? {
        // Return auth.session.user.id after Supabase client init
        nil
    }

    func fetchInterviews() async throws -> [InterviewRow] {
        // supabase.from("interviews").select().order("created_at", ascending: false)
        []
    }
}

struct InterviewRow: Identifiable, Codable {
    let id: String
    let title: String
    let subject_name: String
    let status: String
    let share_slug: String
}
