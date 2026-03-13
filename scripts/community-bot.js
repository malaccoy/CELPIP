#!/usr/bin/env node
/**
 * CELPIP Community Bot — Fetches REAL news and posts with links
 * Sources: IRCC RSS, Google News, Canada.ca
 */
const fs = require('fs');

const BOT_TOKEN = '8693677278:AAEV2PkO1Q_xK9ghaw1XiV3xmbI-qEPtQFA';
const CHAT_ID = '-5107966247';
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];
const STATE_FILE = '/var/www/CELPIP/data/community-bot-state.json';

if (!fs.existsSync('/var/www/CELPIP/data')) fs.mkdirSync('/var/www/CELPIP/data', { recursive: true });

function loadState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8')); }
  catch { return { lastPost: 0, postedTopics: [], postedUrls: [] }; }
}
function saveState(state) { fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2)); }

function sanitizeHTML(text) {
  // Only allow Telegram-supported tags: b, i, u, s, a, code, pre
  const allowed = ['b', 'i', 'u', 's', 'a', 'code', 'pre'];
  // Remove unsupported tags
  text = text.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    if (allowed.includes(tag.toLowerCase())) return match;
    return '';
  });
  // Fix unclosed tags by stripping them
  for (const tag of allowed) {
    const openCount = (text.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const closeCount = (text.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (openCount > closeCount) {
      // Remove the last unclosed opening tag(s)
      for (let i = 0; i < openCount - closeCount; i++) {
        text = text.replace(new RegExp(`<${tag}\\b[^>]*>(?![\s\S]*<${tag}\\b)`, 'i'), '');
      }
    } else if (closeCount > openCount) {
      for (let i = 0; i < closeCount - openCount; i++) {
        text = text.replace(new RegExp(`</${tag}>`, 'i'), '');
      }
    }
  }
  return text;
}

async function sendMessage(text) {
  text = sanitizeHTML(text);
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: false }),
  });
  return res.json();
}

// ─── News Sources ───────────────────────────────────

async function fetchGoogleNews(query) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-CA&gl=CA&ceid=CA:en`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    const xml = await res.text();
    
    // Simple XML parse for RSS items
    const items = [];
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    for (const item of itemMatches.slice(0, 5)) {
      const title = item.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1') || '';
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const source = item.match(/<source.*?>(.*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1') || '';
      if (title && link) items.push({ title, link, pubDate, source });
    }
    return items;
  } catch (e) { console.error('Google News fetch error:', e.message); return []; }
}

async function fetchIRCCNews() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const url = 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices.atom';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: controller.signal });
    clearTimeout(timeout);
    const xml = await res.text();
    
    const items = [];
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
    for (const entry of entries.slice(0, 5)) {
      const title = entry.match(/<title.*?>(.*?)<\/title>/)?.[1] || '';
      const link = entry.match(/<link.*?href="(.*?)"/)?.[1] || '';
      const updated = entry.match(/<updated>(.*?)<\/updated>/)?.[1] || '';
      if (title && link) items.push({ title, link, pubDate: updated, source: 'IRCC' });
    }
    return items;
  } catch (e) { console.error('IRCC fetch error:', e.message); return []; }
}

// ─── Main Logic ─────────────────────────────────────

async function main() {
  const state = loadState();
  const today = new Date().toISOString().split('T')[0];
  
  console.log('Fetching news...');
  
  // Fetch from multiple sources
  const [immigrationNews, citizenshipNews, celpipNews] = await Promise.all([
    fetchGoogleNews('Canada immigration 2026'),
    fetchGoogleNews('Canadian citizenship test'),
    fetchGoogleNews('CELPIP test Canada'),
  ]);
  
  const allNews = [
    ...immigrationNews.map(n => ({ ...n, category: '🌍 Immigration News' })),
    ...citizenshipNews.map(n => ({ ...n, category: '📝 Citizenship' })),
    ...celpipNews.map(n => ({ ...n, category: '🎯 CELPIP' })),
  ];

  // Filter out already posted
  const postedUrls = state.postedUrls || [];
  const fresh = allNews.filter(n => n.link && !postedUrls.includes(n.link));
  
  if (fresh.length === 0) {
    console.log('No fresh news. Posting a tip instead...');
    // Fallback: generate a tip with AI
    const tipRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.8, max_tokens: 400,
        messages: [{ role: 'user', content: `Generate a short, helpful Telegram post for a Canadian immigration community. Pick ONE: citizenship test tip (from Discover Canada), CELPIP study tip, or settlement advice for newcomers. Include relevant emoji. End with engagement question. Under 200 words. English only.` }],
      }),
    });
    const tipData = await tipRes.json();
    const tip = tipData.choices?.[0]?.message?.content;
    if (tip) {
      const result = await sendMessage(tip + '\n\n🔗 Practice: https://celpipaicoach.com');
      console.log(result.ok ? '✅ Tip posted!' : '❌ Failed:', result.description);
    }
    return;
  }

  // Pick top 2-3 articles, prefer variety
  const categories = [...new Set(fresh.map(n => n.category))];
  const selected = [];
  for (const cat of categories) {
    const item = fresh.find(n => n.category === cat);
    if (item && selected.length < 3) selected.push(item);
  }
  if (selected.length === 0) selected.push(fresh[0]);

  // Generate summary with AI
  const newsContext = selected.map((n, i) => `${i+1}. [${n.category}] "${n.title}" — ${n.source}\n   URL: ${n.link}`).join('\n');
  
  const summaryRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini', temperature: 0.6, max_tokens: 600,
      messages: [{ role: 'user', content: `You're a Telegram bot for a Canadian immigration community. Write a news digest post based on these articles:

${newsContext}

FORMAT:
- Start with "📰 Daily Immigration Update" or similar header
- For each article: one emoji bullet + 1-2 sentence summary + link
- Keep summaries factual and helpful for immigrants/newcomers
- End with a brief engagement line ("What are your thoughts?" or "Anyone affected by this?")
- Add "🔗 Prepare for your tests: https://celpipaicoach.com" at the end
- Use HTML formatting (<b>bold</b>, no markdown)
- Under 300 words total
- English only

Return ONLY the message text.` }],
    }),
  });

  const summaryData = await summaryRes.json();
  const post = summaryData.choices?.[0]?.message?.content;
  
  if (!post) { console.error('Failed to generate summary'); return; }

  const result = await sendMessage(post);
  if (result.ok) {
    console.log('✅ News posted! Message ID:', result.result.message_id);
    // Save posted URLs
    if (!state.postedUrls) state.postedUrls = [];
    state.postedUrls.push(...selected.map(n => n.link));
    if (state.postedUrls.length > 100) state.postedUrls = state.postedUrls.slice(-50);
    state.lastPost = Date.now();
    saveState(state);
  } else {
    console.error('❌ Failed:', result.description);
  }
}

main().catch(console.error);
