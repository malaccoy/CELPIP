import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — CELPIP AI Coach',
  description: 'Privacy Policy for CELPIP AI Coach application and website.',
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px 20px',
      color: '#e0e0e0',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1.7,
    }}>
      <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Last updated: March 17, 2026</p>

      <p>
        CELPIP AI Coach (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{' '}
        <a href="https://celpipaicoach.com" style={{ color: '#4fc3f7' }}>celpipaicoach.com</a> and
        the CELPIP AI Coach mobile application (collectively, the &quot;Service&quot;). This Privacy
        Policy explains how we collect, use, and protect your information.
      </p>

      <Section title="1. Information We Collect">
        <p><strong>Account Information:</strong> When you create an account, we collect your email address and display name through our authentication provider (Supabase Auth / Google Sign-In).</p>
        <p><strong>Usage Data:</strong> We collect information about how you use the Service, including exercises completed, scores, practice history, and progress data.</p>
        <p><strong>Audio Recordings:</strong> For Speaking practice, we temporarily process audio recordings to provide AI feedback. Recordings are not stored permanently and are deleted after analysis.</p>
        <p><strong>Payment Information:</strong> Payment processing is handled by Stripe. We do not store your credit card details. Stripe&apos;s privacy policy applies to payment data.</p>
        <p><strong>Device Information:</strong> We may collect basic device and browser information (device type, OS, browser version) for analytics and compatibility purposes.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul style={{ paddingLeft: 20 }}>
          <li>Provide and improve our CELPIP preparation services</li>
          <li>Track your learning progress and generate personalized feedback</li>
          <li>Process subscriptions and payments</li>
          <li>Send important account-related notifications</li>
          <li>Analyze usage patterns to improve the Service</li>
          <li>Maintain leaderboards and rankings (display name only)</li>
        </ul>
      </Section>

      <Section title="3. AI-Powered Features">
        <p>
          We use artificial intelligence (OpenAI GPT models) to evaluate your speaking and writing
          responses. Your submitted text and audio transcriptions are sent to OpenAI for analysis.
          We do not use your data to train AI models. OpenAI&apos;s data processing is governed by
          their API data usage policies.
        </p>
      </Section>

      <Section title="4. Data Sharing">
        <p>We do not sell your personal information. We share data only with:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li><strong>Supabase:</strong> Authentication and user management</li>
          <li><strong>Stripe:</strong> Payment processing</li>
          <li><strong>OpenAI:</strong> AI-powered feedback generation</li>
          <li><strong>Google Analytics:</strong> Anonymous usage statistics</li>
        </ul>
      </Section>

      <Section title="5. Data Storage & Security">
        <p>
          Your data is stored on secure servers. We use encryption in transit (HTTPS/TLS) and
          follow industry-standard security practices to protect your information. However, no
          method of transmission over the Internet is 100% secure.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Export your practice history</li>
          <li>Opt out of non-essential communications</li>
        </ul>
        <p>To exercise these rights, contact us at the email below.</p>
      </Section>

      <Section title="7. Cookies & Local Storage">
        <p>
          We use cookies and local storage for authentication sessions, user preferences, and
          analytics. Essential cookies are required for the Service to function. You can control
          cookie settings in your browser.
        </p>
      </Section>

      <Section title="8. Children&apos;s Privacy">
        <p>
          Our Service is intended for users aged 18 and older. We do not knowingly collect
          information from children under 13. If you believe a child has provided us with personal
          data, please contact us for removal.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify users of significant
          changes via the Service or email. Continued use after changes constitutes acceptance.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy or your data, contact us at:<br />
          📧 <a href="mailto:noreply@celpipaicoach.com" style={{ color: '#4fc3f7' }}>noreply@celpipaicoach.com</a><br />
          🌐 <a href="https://celpipaicoach.com/support" style={{ color: '#4fc3f7' }}>celpipaicoach.com/support</a>
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: 12 }}>{title}</h2>
      <div style={{ color: '#ccc' }}>{children}</div>
    </section>
  );
}
