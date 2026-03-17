import styles from '@/styles/Legal.module.scss';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated: March 3, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using CELPIP AI Coach (&quot;the Service&quot;), operated at celpipaicoach.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>CELPIP AI Coach is an AI-powered preparation platform for the CELPIP (Canadian English Language Proficiency Index Program) exam. We provide practice exercises, technique guides, AI-generated feedback, mock exams, and study tools.</p>
          <p>We are <strong>not affiliated with, endorsed by, or connected to</strong> Paragon Testing Enterprises or the official CELPIP test. &quot;CELPIP&quot; is a registered trademark of Paragon Testing Enterprises.</p>
        </section>

        <section>
          <h2>3. Accounts</h2>
          <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. You must notify us immediately of any unauthorized use.</p>
        </section>

        <section>
          <h2>4. Free and Pro Plans</h2>
          <p>The Service offers a free tier with limited features and a Pro subscription with full access to AI-powered features. Pro subscriptions are billed monthly (CA$29.99) or annually (CA$149.99) through Stripe.</p>
          <ul>
            <li>Pro subscriptions are billed immediately upon signup. You can cancel anytime from your profile.</li>
            <li>You may cancel at any time through the billing portal. Cancellations take effect at the end of the current billing period.</li>
            <li>Refunds are handled on a case-by-case basis. Contact us at hello@celpipaicoach.com.</li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose</li>
            <li>Share your account credentials with others</li>
            <li>Attempt to reverse-engineer, scrape, or copy the Service&apos;s content or AI models</li>
            <li>Use automated tools to access the Service beyond normal use</li>
            <li>Redistribute or resell content from the Service</li>
          </ul>
        </section>

        <section>
          <h2>6. AI-Generated Content</h2>
          <p>Our Service uses AI (OpenAI) to generate practice exercises, feedback, and evaluations. While we strive for accuracy, AI-generated content may contain errors. It should be used as a study aid, not as a guarantee of exam results.</p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>All content, design, and code of CELPIP AI Coach is owned by us. Your practice responses and recordings remain yours, but you grant us a license to process them for providing the Service.</p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>CELPIP AI Coach is provided &quot;as is&quot; without warranties. We do not guarantee specific exam scores or outcomes. Our total liability is limited to the amount you paid for the Service in the 12 months preceding the claim.</p>
        </section>

        <section>
          <h2>9. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance. We will notify users of material changes via email.</p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>Questions about these terms? Email us at <a href="mailto:hello@celpipaicoach.com">hello@celpipaicoach.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
