export default function PrivacyPolicy() {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0077b6 0%, #00b4d8 40%, #90e0ef 100%)",
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily: "'Fredoka One', cursive",
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src="/potli.jpg"
            alt="Potli the Octopus"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #0077b6" }}
          />
          <h1 style={{ color: "#023e8a", fontSize: "2rem", margin: "0.5rem 0 0" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#0077b6", margin: 0 }}>Potli's Ocean Adventure</p>
        </div>

        <p style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>
          <strong>Last updated: June 2025</strong>
        </p>

        <Section title="Who we are">
          Potli's Ocean Adventure is a free educational game for children. It helps kids
          aged 3–7 learn about ocean conservation through 22 fun mini-games starring
          Potli the Octopus.
        </Section>

        <Section title="We do not collect any personal data">
          This app does <strong>not</strong> collect, store, or share any personal
          information from users — including children. Specifically:
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem", lineHeight: 2 }}>
            <li>No accounts or sign-ups required</li>
            <li>No names, emails, or contact details collected</li>
            <li>No location data</li>
            <li>No device identifiers tracked</li>
            <li>No cookies used for tracking</li>
            <li>No analytics or third-party trackers</li>
          </ul>
        </Section>

        <Section title="No ads">
          The app contains <strong>no advertisements</strong> of any kind.
        </Section>

        <Section title="No in-app purchases">
          The app is completely free with <strong>no in-app purchases</strong>.
        </Section>

        <Section title="Internet usage">
          The app loads fonts (Fredoka One) from Google Fonts when online. Google Fonts
          does not collect personal data from end users. The app also works offline after
          the first load.
        </Section>

        <Section title="Children's privacy (COPPA)">
          This app is designed for children. We fully comply with the Children's Online
          Privacy Protection Act (COPPA). We do not knowingly collect personal
          information from anyone, including children under 13.
        </Section>

        <Section title="Contact us">
          If you have any questions about this privacy policy, please reach out at:{" "}
          <a href="mailto:hello@potligames.app" style={{ color: "#0077b6" }}>
            hello@potligames.app
          </a>
        </Section>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #f72585, #7209b7)",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            ← Back to Games
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ color: "#023e8a", fontSize: "1.2rem", marginBottom: "0.4rem" }}>
        {title}
      </h2>
      <div style={{ color: "#444", lineHeight: 1.7, fontSize: "0.95rem" }}>{children}</div>
    </div>
  );
}
