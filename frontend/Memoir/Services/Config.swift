import Foundation

enum Config {
    static var supabaseURL: URL? {
        guard let s = plist("SUPABASE_URL") else { return nil }
        return URL(string: s)
    }

    static var supabaseAnonKey: String? { plist("SUPABASE_ANON_KEY") }
    static var revenueCatAPIKey: String? { plist("REVENUECAT_API_KEY") }
    static var webBaseURL: String { plist("WEB_BASE_URL") ?? "https://memoir.app" }

    private static func plist(_ key: String) -> String? {
        guard let url = Bundle.main.url(forResource: "Config", withExtension: "plist"),
              let data = try? Data(contentsOf: url),
              let dict = try? PropertyListSerialization.propertyList(from: data, format: nil) as? [String: Any]
        else { return nil }
        return dict[key] as? String
    }
}
