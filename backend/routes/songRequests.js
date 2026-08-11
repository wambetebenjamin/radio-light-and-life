const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

// POST /api/song-requests -> public submission
router.post("/", (req, res) => {
  const { requester_name, song_title, artist, note } = req.body;
  if (!song_title) return res.status(400).json({ error: "song_title is required." });

  const info = db.prepare(`
    INSERT INTO song_requests (requester_name, song_title, artist, note)
    VALUES (?, ?, ?, ?)
  `).run(requester_name || null, song_title, artist || null, note || null);

  res.status(201).json({ id: info.lastInsertRowid, message: "Request received." });
});

// GET /api/song-requests -> admin only
router.get("/", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM song_requests ORDER BY created_at DESC").all();
  res.json(rows);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM song_requests WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Request not found" });
  res.status(204).end();
});

module.exports = router;
