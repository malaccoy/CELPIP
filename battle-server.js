const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = 3003;
const ROUND_TIME_MS = 30000;

const BOT_MATCH_DELAY = 10000; // 10s wait before bot joins
const BOT_ACCURACY = 0.65;    // 65% chance of correct answer
const BOT_MIN_DELAY = 3000;   // min response time ms
const BOT_MAX_DELAY = 8000;   // max response time ms
const BOT_NAMES = [
  'Sarah M.', 'James L.', 'Priya K.', 'Lucas R.', 'Anna W.',
  'David C.', 'Maria S.', 'Kevin T.', 'Emma H.', 'Carlos P.',
  'Sophie B.', 'Ahmed N.', 'Jessica F.', 'Daniel G.', 'Rachel Y.',
  'Michael Z.', 'Olivia D.', 'Nathan A.', 'Isabella V.', 'Alex J.',
  'Harpreet S.', 'Wei L.', 'Fatima A.', 'Yuki T.', 'Elena R.',
  'Omar H.', 'Chloe M.', 'Raj P.', 'Liam O.', 'Aisha B.',
  'Pedro V.', 'Hana K.', 'Viktor S.', 'Mei W.', 'Tariq J.',
  'Camila F.', 'Arjun D.', 'Nadia Z.', 'Ethan C.', 'Seo-yeon P.',
  'Mohammed R.', 'Ingrid N.', 'Tomás G.', 'Anya M.', 'Jun H.',
  'Valentina L.', 'Kofi A.', 'Léa D.', 'Ravi T.', 'Zara E.'
];
const BOT_ID_PREFIX = 'bot_';

function randomBotName() { return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)]; }
function randomBotId() { return BOT_ID_PREFIX + crypto.randomBytes(4).toString('hex'); }
function isBot(uid) { return uid && uid.startsWith(BOT_ID_PREFIX); }
const SPEAK_ROUND_TIME_MS = 30000;

const pool = new Pool({
  user: 'celpip', host: 'localhost', database: 'celpip',
  password: 'celpip_secure_2024', port: 5432
});

const libPath = path.join(__dirname, 'public/data/battle/questions.json');
const library = JSON.parse(fs.readFileSync(libPath, 'utf8'));
const questionsByCategory = {};
library.questions.forEach(q => {
  if (!questionsByCategory[q.cat]) questionsByCategory[q.cat] = [];
  questionsByCategory[q.cat].push(q);
});

let matchQueue = [];
let botTimer = null;
const rooms = {};
const userRooms = {}; // userId → roomCode mapping

function genCode() { return crypto.randomBytes(3).toString('hex').toUpperCase(); }

function pickQuestions() {
  const cats = ['vocabulary', 'grammar', 'idioms', 'collocations', 'error_spotting', 'vocabulary'];
  const picked = cats.map(cat => {
    const p = questionsByCategory[cat];
    return p[Math.floor(Math.random() * p.length)];
  });
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
}

const httpServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', rooms: Object.keys(rooms).length, queue: matchQueue.length, uptime: process.uptime() }));
  }
  res.writeHead(404);
  res.end('Not found');
});

const io = new Server(httpServer, {
  cors: { origin: ['https://celpipaicoach.com', 'http://localhost:3000'], methods: ['GET', 'POST'] },
  pingInterval: 10000, pingTimeout: 5000
});

httpServer.listen(PORT, '127.0.0.1', () => console.log(`⚔️  Battle server on port ${PORT}`));

io.on('connection', (socket) => {
  let userId = null;
  let userName = null;
  let userAvatar = null;
  let currentRoom = null;

  socket.on('auth', (data) => {
    userId = data.userId;
    userName = data.userName || 'Player';
    userAvatar = data.avatar || null;
    socket.emit('auth:ok');
  });

  socket.on('queue:join', () => {
    if (!userId) return socket.emit('error', { msg: 'Not authenticated' });
    matchQueue = matchQueue.filter(p => p.userId !== userId);
    matchQueue.push({ socketId: socket.id, userId, userName, avatar: userAvatar });
    socket.emit('queue:joined', { position: matchQueue.length });
    if (matchQueue.length >= 2) {
      clearTimeout(botTimer); botTimer = null;
      const p1 = matchQueue.shift();
      const p2 = matchQueue.shift();
      createRoom(p1, p2, 'quick');
    } else {
      // Start bot timer — if no human joins in 5s, bot enters
      clearTimeout(botTimer);
      botTimer = setTimeout(() => {
        if (matchQueue.length === 1) {
          const human = matchQueue.shift();
          const botId = randomBotId();
          const botName = randomBotName();
          const bot = { socketId: null, userId: botId, userName: botName, isBot: true };
          createRoom(human, bot, 'quick');
        }
        botTimer = null;
      }, BOT_MATCH_DELAY);
    }
  });

  socket.on('queue:leave', () => {
    matchQueue = matchQueue.filter(p => p.userId !== userId);
    if (matchQueue.length === 0) { clearTimeout(botTimer); botTimer = null; }
    socket.emit('queue:left');
  });

  socket.on('room:create', async () => {
    if (!userId) return socket.emit('error', { msg: 'Not authenticated' });
    const code = genCode();
    const questions = pickQuestions();
    const res = await pool.query(
      `INSERT INTO battle_rooms (code, mode, status, player1_id, questions) VALUES ($1, 'private', 'waiting', $2, $3) RETURNING id`,
      [code, userId, JSON.stringify(questions.map(q => q.id))]
    );
    rooms[code] = {
      dbId: res.rows[0].id, code, mode: 'private', status: 'waiting', questions, currentRound: -1,
      players: { [userId]: { socketId: socket.id, name: userName, avatar: userAvatar, score: 0, answered: false } },
      roundTimer: null
    };
    socket.join(code);
    currentRoom = code;
    userRooms[userId] = code;
    socket.emit('room:created', { code, mode: 'private' });
  });

  socket.on('room:join', async (data) => {
    if (!userId) return socket.emit('error', { msg: 'Not authenticated' });
    const code = (data.code || '').toUpperCase();
    const room = rooms[code];
    if (!room) return socket.emit('error', { msg: 'Room not found' });
    if (room.status !== 'waiting') return socket.emit('error', { msg: 'Battle already started' });
    if (Object.keys(room.players).length >= 2) return socket.emit('error', { msg: 'Room is full' });
    if (room.players[userId]) return socket.emit('error', { msg: 'Already in room' });

    room.players[userId] = { socketId: socket.id, name: userName, avatar: userAvatar, score: 0, answered: false };
    socket.join(code);
    currentRoom = code;
    userRooms[userId] = code;
    await pool.query(`UPDATE battle_rooms SET player2_id=$1, status='playing' WHERE code=$2`, [userId, code]);
    room.status = 'playing';
    const playerList = Object.entries(room.players).map(([id, p]) => ({ userId: id, name: p.name, avatar: p.avatar }));
    io.to(code).emit('room:ready', { code, players: playerList });
    setTimeout(() => startRound(code), 3000);
  });

  socket.on('answer', (data) => {
    const roomCode = currentRoom || userRooms[userId];
    if (!roomCode || !userId) return;
    const room = rooms[roomCode];
    if (!room || room.status !== 'playing') return;
    const player = room.players[userId];
    if (!player || player.answered) return;
    player.answered = true;

    const q = room.questions[room.currentRound];
    if (!q) return;

    let correct = false;
    let accuracy = null;
    const timeMs = data.timeMs || ROUND_TIME_MS;

    correct = data.answer === q.ans;
    if (correct) {
      const timeBonus = timeMs <= 10000 ? 10 : 5;
      player.score += timeBonus;
      console.log(`[SCORE] ${userId} correct! answer=${data.answer} expected=${q.ans} timeMs=${timeMs} bonus=${timeBonus} total=${player.score}`);
    } else {
      console.log(`[SCORE] ${userId} wrong. answer=${data.answer} expected=${q.ans}`);
    }

    pool.query(
      `INSERT INTO battle_rounds (room_id, question_idx, player_id, answer, correct, accuracy, time_ms) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [room.dbId, room.currentRound, userId, data.answer ?? null, correct, accuracy, timeMs]
    ).catch(e => console.error('DB round:', e.message));

    if (Object.values(room.players).every(p => p.answered)) {
      clearTimeout(room.roundTimer);
      endRound(roomCode);
    }
  });

  socket.on('disconnect', () => {
    matchQueue = matchQueue.filter(p => p.socketId !== socket.id);
    if (currentRoom && rooms[currentRoom]) {
      const room = rooms[currentRoom];
      if (room.status === 'playing') {
        io.to(currentRoom).emit('battle:forfeit', { forfeitedBy: userId });
        finishBattle(currentRoom, userId);
      } else if (room.status === 'waiting') {
        delete room.players[userId];
        if (Object.keys(room.players).length === 0) { clearTimeout(room.roundTimer); delete rooms[currentRoom]; }
      }
    }
  });
});

async function createRoom(p1, p2, mode) {
  const code = genCode();
  const questions = pickQuestions();
  const res = await pool.query(
    `INSERT INTO battle_rooms (code, mode, status, player1_id, player2_id, questions) VALUES ($1,$2,'playing',$3,$4,$5) RETURNING id`,
    [code, mode, p1.userId, isBot(p2.userId) ? null : p2.userId, JSON.stringify(questions.map(q => q.id))]
  );
  rooms[code] = {
    dbId: res.rows[0].id, code, mode, status: 'playing', questions, currentRound: -1,
    players: {
      [p1.userId]: { socketId: p1.socketId, name: p1.userName, avatar: p1.avatar || null, score: 0, answered: false },
      [p2.userId]: { socketId: p2.socketId, name: p2.userName, avatar: p2.avatar || null, score: 0, answered: false }
    },
    roundTimer: null
  };
  const s1 = p1.socketId ? io.sockets.sockets.get(p1.socketId) : null;
  const s2 = p2.socketId ? io.sockets.sockets.get(p2.socketId) : null;
  if (s1) { s1.join(code); s1.data = { ...s1.data, currentRoom: code }; }
  if (s2) { s2.join(code); s2.data = { ...s2.data, currentRoom: code }; }
  userRooms[p1.userId] = code;
  userRooms[p2.userId] = code;
  const playerList = [{ userId: p1.userId, name: p1.userName, avatar: p1.avatar || null }, { userId: p2.userId, name: p2.userName, avatar: p2.avatar || null }];
  io.to(code).emit('room:ready', { code, players: playerList });
  setTimeout(() => startRound(code), 3000);
}

function startRound(code) {
  const room = rooms[code];
  if (!room || room.status !== 'playing') return;
  room.currentRound++;
  if (room.currentRound >= room.questions.length) return finishBattle(code);
  Object.values(room.players).forEach(p => { p.answered = false; });
  const q = room.questions[room.currentRound];
  const timeMs = ROUND_TIME_MS;
  io.to(code).emit('round:start', {
    id: q.id, cat: q.cat, type: q.type, q: q.q || null, prompt: q.prompt || null,
    opts: q.opts || null, audioPath: q.audioPath || null,
    round: room.currentRound + 1, total: room.questions.length, timeMs
  });
  pool.query(`UPDATE battle_rooms SET current_round=$1, round_started_at=NOW() WHERE id=$2`, [room.currentRound, room.dbId]).catch(() => {});

  // Bot auto-answer
  Object.entries(room.players).forEach(([uid, p]) => {
    if (isBot(uid)) {
      const delay = BOT_MIN_DELAY + Math.random() * (BOT_MAX_DELAY - BOT_MIN_DELAY);
      setTimeout(() => {
        if (p.answered || room.status !== 'playing') return;
        p.answered = true;
        const correct = Math.random() < BOT_ACCURACY;
        const botAnswer = correct ? q.ans : (() => {
          // Pick a random wrong answer
          const opts = q.opts ? q.opts.map((_, i) => i).filter(i => i !== q.ans) : [0,1,2,3].filter(i => i !== q.ans);
          return opts[Math.floor(Math.random() * opts.length)];
        })();
        const botTimeMs = Math.round(delay);
        if (correct) {
          const timeBonus = botTimeMs <= 10000 ? 10 : 5;
          p.score += timeBonus;
        }
        pool.query(`INSERT INTO battle_rounds (room_id, question_idx, player_id, answer, correct, time_ms) VALUES ($1,$2,$3,$4,$5,$6)`,
          [room.dbId, room.currentRound, uid, botAnswer, correct, botTimeMs]).catch(() => {});
        if (Object.values(room.players).every(pl => pl.answered)) {
          clearTimeout(room.roundTimer);
          endRound(code);
        }
      }, delay);
    }
  });

  room.roundTimer = setTimeout(() => {
    Object.entries(room.players).forEach(([uid, p]) => {
      if (!p.answered) {
        p.answered = true;
        pool.query(`INSERT INTO battle_rounds (room_id, question_idx, player_id, answer, correct, time_ms) VALUES ($1,$2,$3,NULL,false,$4)`,
          [room.dbId, room.currentRound, uid, timeMs]).catch(() => {});
      }
    });
    endRound(code);
  }, timeMs + 2000);
}

function endRound(code) {
  const room = rooms[code];
  if (!room) return;
  const q = room.questions[room.currentRound];
  const scores = {};
  Object.entries(room.players).forEach(([uid, p]) => { scores[uid] = { name: p.name, avatar: p.avatar || null, score: p.score }; });
  io.to(code).emit('round:end', { round: room.currentRound + 1, correctAnswer: q.ans, scores });
  setTimeout(() => startRound(code), 3000);
}

async function finishBattle(code, forfeitedBy) {
  const room = rooms[code];
  if (!room) return;
  room.status = 'finished';
  clearTimeout(room.roundTimer);
  const players = Object.entries(room.players);
  let winnerId = null;
  if (forfeitedBy) {
    winnerId = players.find(([uid]) => uid !== forfeitedBy)?.[0] || null;
  } else if (players.length === 2) {
    const [p1, p2] = players;
    if (p1[1].score > p2[1].score) winnerId = p1[0];
    else if (p2[1].score > p1[1].score) winnerId = p2[0];
  }
  const finalScores = {};
  players.forEach(([uid, p]) => { finalScores[uid] = { name: p.name, score: p.score, isWinner: uid === winnerId }; });
  io.to(code).emit('battle:end', { winner: winnerId, draw: !winnerId && !forfeitedBy, forfeit: !!forfeitedBy, scores: finalScores });
  await pool.query(`UPDATE battle_rooms SET status='finished', finished_at=NOW() WHERE id=$1`, [room.dbId]).catch(() => {});
  for (const [uid] of players) {
    if (isBot(uid)) continue; // Don't save bot stats
    const isWinner = uid === winnerId;
    const isDraw = !winnerId && !forfeitedBy;
    // Rating = total points accumulated from battles (never decreases)
    const pointsEarned = room.players[uid].score; // score from this battle (0-60)
    await pool.query(`
      INSERT INTO battle_stats (user_id, wins, losses, draws, battles_played, rating, updated_at)
      VALUES ($1, $2, $3, $4, 1, $5, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        wins = battle_stats.wins + $2, losses = battle_stats.losses + $3, draws = battle_stats.draws + $4,
        battles_played = battle_stats.battles_played + 1, rating = battle_stats.rating + $5, updated_at = NOW()
    `, [uid, isWinner?1:0, (!isWinner&&!isDraw)?1:0, isDraw?1:0, pointsEarned]).catch(e => console.error('Stats:', e.message));
  }
  setTimeout(() => {
    if (rooms[code]) { Object.keys(rooms[code].players).forEach(uid => delete userRooms[uid]); }
    delete rooms[code];
  }, 30000);
}
