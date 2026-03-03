import styles from '@/styles/Legal.module.scss';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: March 3, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>CELPIP AI Coach (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our service at celpipaicoach.com.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>Account Information</h3>
          <ul>
            <li>Email address and name (when you sign up)</li>
            <li>Google account information (if you sign in with Google)</li>
          </ul>
          <h3>Usage Data</h3>
          <ul>
            <li>Practice responses and quiz results</li>
            <li>Voice recordings (for speaking practice — processed by OpenAI Whisper, not stored permanently)</li>
            <li>Assessment scores and study progress</li>
            <li>Pages visited and features used (via Google Analytics)</li>
          </ul>
          <h3>Payment Information</h3>
          <ul>
            <li>Billing details are handled securely by Stripe. We do not store your credit card information.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve the Service</li>
            <li>To personalize your study plan and track progress</li>
            <li>To process AI-powered feedback on your practice responses</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send service-related emails (verification, password reset, important updates)</li>
            <li>To send occasional product updates (you can unsubscribe anytime)</li>
          </ul>
        </section>

        <section>
          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Supabase</strong> — Authentication and user management</li>
            <li><strong>OpenAI</strong> — AI-generated content, feedback, and speech processing</li>
            <li><strong>Stripe</strong> — Payment processing</li>
            <li><strong>Google Analytics</strong> — Anonymous usage analytics</li>
            <li><strong>Resend</strong> — Transactional emails</li>
            <li><strong>Microsoft Edge TTS</strong> — Text-to-speech for listening exercises</li>
          </ul>
          <p>Each service has its own privacy policy. Your data shared with these services is limited to what is necessary for functionality.</p>
        </section>

        <section>
          <h2>5. Data Storage and Security</h2>
          <p>Your data is stored on secure servers. We use encryption in transit (HTTPS) and follow industry best practices. However, no method of electronic storage is 100% secure.</p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>We retain your account data as long as your account is active. Practice data and progress are kept to provide continuity. You can request deletion of your account and all associated data at any time by contacting us.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt out of marketing emails</li>
          </ul>
          <p>For Canadian users: we comply with PIPEDA (Personal Information Protection and Electronic Documents Act).</p>
        </section>

        <section>
          <h2>8. Cookies</h2>
          <p>We use essential cookies for authentication and session management. Google Analytics uses cookies for anonymous usage tracking. You can disable cookies in your browser settings, but some features may not work properly.</p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify users of material changes via email. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>Questions about privacy? Email us at <a href="mailto:hello@celpipaicoach.com">hello@celpipaicoach.com</a>.</p>
          <p>CELPIP AI Coach · Vancouver, BC, Canada</p>
        </section>
      </div>
    </div>
  );
}
