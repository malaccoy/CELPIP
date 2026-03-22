import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete Account — CELPIP AI Coach',
  description: 'Request deletion of your CELPIP AI Coach account and data.',
};

export default function DeleteAccountPage() {
  return (
    <div style={{
      maxWidth: 800,
      margin: '0 auto',
      padding: '40px 20px',
      color: '#e0e0e0',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1.7,
    }}>
      <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: 8 }}>Delete Your Account</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>CELPIP AI Coach — Account Deletion</p>

      <p>
        We respect your right to control your personal data. You can request full deletion of your
        CELPIP AI Coach account and all associated data by following the steps below.
      </p>

      <h2 style={{ color: '#fff', fontSize: '1.3rem', marginTop: 32, marginBottom: 12 }}>How to Delete Your Account</h2>
      <ol style={{ paddingLeft: 20, color: '#ccc' }}>
        <li style={{ marginBottom: 8 }}>Send an email to <a href="mailto:noreply@celpipaicoach.com?subject=Account%20Deletion%20Request" style={{ color: '#4fc3f7' }}>noreply@celpipaicoach.com</a> with the subject line <strong>&quot;Account Deletion Request&quot;</strong></li>
        <li style={{ marginBottom: 8 }}>Include the email address associated with your account</li>
        <li style={{ marginBottom: 8 }}>We will process your request within <strong>7 business days</strong></li>
      </ol>

      <h2 style={{ color: '#fff', fontSize: '1.3rem', marginTop: 32, marginBottom: 12 }}>What Gets Deleted</h2>
      <ul style={{ paddingLeft: 20, color: '#ccc' }}>
        <li>Your account and login credentials</li>
        <li>Practice history and scores</li>
        <li>Writing and speaking submissions</li>
        <li>Progress data and leaderboard entries</li>
        <li>Daily usage records</li>
        <li>Subscription data (Stripe subscription will be cancelled)</li>
      </ul>

      <h2 style={{ color: '#fff', fontSize: '1.3rem', marginTop: 32, marginBottom: 12 }}>What We May Retain</h2>
      <ul style={{ paddingLeft: 20, color: '#ccc' }}>
        <li>Payment transaction records (required by law for up to 7 years)</li>
        <li>Anonymized, aggregated analytics data</li>
      </ul>

      <p style={{ marginTop: 32 }}>
        Questions? Visit our <a href="/support" style={{ color: '#4fc3f7' }}>Support page</a> or
        email <a href="mailto:noreply@celpipaicoach.com" style={{ color: '#4fc3f7' }}>noreply@celpipaicoach.com</a>.
      </p>
    </div>
  );
}
