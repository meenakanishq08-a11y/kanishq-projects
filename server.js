// server.js — Exam Escape Leaderboard Backend (SQLite version)
// Run locally: npm install && npm start  (default port 3000)

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'exam_escape.db');

app.use(cors());
app.use(express.json());

// Serve from www/ build directory if it exists, otherwise root
const staticPath = fs.existsSync(path.join(__dirname, 'www')) 
  ? path.join(__dirname, 'www') 
  : path.join(__dirname);
app.use(express.static(staticPath));

// ---- SQLite setup ----
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    platform TEXT DEFAULT 'web',
    created_at TEXT DEFAULT (datetime('now'))
  );
`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);`);

const insertScore = db.prepare('INSERT INTO scores (name, score, platform) VALUES (?, ?, ?)');
const topScores = db.prepare('SELECT name, score, platform, created_at FROM scores ORDER BY score DESC LIMIT ?');

// GET /api/leaderboard?limit=10 -> top scores
app.get('/api/leaderboard', (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  try {
    const rows = topScores.all(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db read failed' });
  }
});

// POST /api/leaderboard { name, score, platform } -> save a new score
app.post('/api/leaderboard', (req, res) => {
  const { name, score, platform } = req.body;
  if (!name || typeof score !== 'number' || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'name (string) and score (number) required' });
  }
  if (score < 0 || score > 1000000) {
    return res.status(400).json({ error: 'score out of allowed range' });
  }
  try {
    insertScore.run(String(name).slice(0, 20), Math.floor(score), String(platform || 'web').slice(0, 20));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db write failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Exam Escape backend (SQLite) running on http://localhost:${PORT}`);
});
