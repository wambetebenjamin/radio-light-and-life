const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// GET /api/encouragements/today -> today's entry, or the most recent past one if none set for today
router.get("/today", (req, res) => {
  const today = todayStr();

  const exact = db.prepare(`
    SELECT e.*, p.name AS presenter_name, p.photo_url AS presenter_photo
    FROM encouragements e
    LEFT JOIN presenters p ON p.id = e.presenter_id
    WHERE e.entry_date = ?
  `).get(today);

  if (exact) return res.json(exact);

  const latest = db.prepare(`
    SELECT e.*, p.name AS presenter_name, p.photo_url AS presenter_photo
    FROM encouragements e
    LEFT JOIN presenters p ON p.id = e.presenter_id
    WHERE e.entry_date <= ?
    ORDER BY e.entry_date DESC LIMIT 1
  `).get(today);

  res.json(latest || null);
});

// GET /api/encouragements -> all entries (used by admin panel)
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT e.*, p.name AS presenter_name
    FROM encouragements e
    LEFT JOIN presenters p ON p.id = e.presenter_id
    ORDER BY e.entry_date DESC
  `).all();
  res.json(rows);
});

// --- Admin-only writes ---

router.post("/", requireAdmin, (req, res) => {
  const { message, presenter_id, entry_date } = req.body;
  if (!message || !entry_date) {
    return res.status(400).json({ error: "message and entry_date are required." });
  }

  const info = db.prepare(`
    INSERT INTO encouragements (message, presenter_id, entry_date)
    VALUES (?, ?, ?)
  `).run(message, presenter_id || null, entry_date);

  res.status(201).json(db.prepare("SELECT * FROM encouragements WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM encouragements WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Entry not found" });

  const { message, presenter_id, entry_date } = req.body;
  db.prepare(`
    UPDATE encouragements SET message = ?, presenter_id = ?, entry_date = ?
    WHERE id = ?
  `).run(
    message ?? existing.message,
    presenter_id !== undefined ? presenter_id : existing.presenter_id,
    entry_date ?? existing.entry_date,
    req.params.id
  );

  res.json(db.prepare("SELECT * FROM encouragements WHERE id = ?").get(req.params.id));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM encouragements WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Entry not found" });
  res.status(204).end();
});

module.exports = router;
