// Send push notifications via Firebase Cloud Messaging (FCM v1 API)
// Usage: node scripts/send-push.js --title "Title" --body "Body" --url "/dashboard" [--userId <id>]

const { google } = require('googleapis');

async function getAccessToken() {
  const serviceAccount = require('../google-services-server.json'); // Server key, not client
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });
  const token = await auth.getAccessToken();
  return token;
}

async function sendToToken(fcmToken, title, body, data = {}) {
  const serviceAccount = require('../google-services-server.json');
  const projectId = serviceAccount.project_id;
  const accessToken = await getAccessToken();

  const message = {
    message: {
      token: fcmToken,
      notification: { title, body },
      data: data,
      android: {
        notification: {
          icon: 'ic_launcher',
          color: '#ff3b3b',
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          channel_id: 'celpip_default',
        },
        priority: 'high',
      },
    },
  };

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(message),
    }
  );

  const result = await res.json();
  return result;
}

async function sendToAll(title, body, data = {}) {
  const { Client } = require('pg');
  const client = new Client({
    host: 'localhost', database: 'celpip', user: 'celpip', password: 'celpip_secure_2024',
  });
  await client.connect();
  
  const { rows } = await client.query('SELECT token FROM push_tokens');
  await client.end();

  console.log(`Sending to ${rows.length} devices...`);
  let sent = 0, failed = 0;

  for (const row of rows) {
    try {
      await sendToToken(row.token, title, body, data);
      sent++;
    } catch (e) {
      console.error(`Failed for token ${row.token.slice(0, 20)}...:`, e.message);
      failed++;
    }
  }

  console.log(`Done: ${sent} sent, ${failed} failed`);
}

// CLI
const args = process.argv.slice(2);
const getArg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

const title = getArg('--title') || 'CELPIP AI Coach';
const body = getArg('--body') || 'New content available!';
const url = getArg('--url') || '/dashboard';
const userId = getArg('--userId');

if (userId) {
  // Send to specific user
  const { Client } = require('pg');
  (async () => {
    const client = new Client({
      host: 'localhost', database: 'celpip', user: 'celpip', password: 'celpip_secure_2024',
    });
    await client.connect();
    const { rows } = await client.query('SELECT token FROM push_tokens WHERE "userId" = $1', [userId]);
    await client.end();
    
    if (rows.length === 0) { console.log('No token found for user'); process.exit(1); }
    
    const result = await sendToToken(rows[0].token, title, body, { url });
    console.log('Result:', JSON.stringify(result, null, 2));
  })();
} else {
  sendToAll(title, body, { url });
}
