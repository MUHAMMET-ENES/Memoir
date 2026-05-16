import SwiftUI

struct AuthView: View {
    var body: some View {
        VStack(spacing: 24) {
            Text("Memoir")
                .font(.system(size: 36, design: .serif))
            Text("Record your grandparent's life story.\nKeep it forever.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
            Text("Sign in with email or Apple ID")
                .font(.caption)
        }
        .padding()
    }
}
