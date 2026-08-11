const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

// GET /api/schedule -> full weekly schedule, grouped by day
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.day_of_week, s.start_time, s.end_time, s.show_name, s.description,
           p.id AS presenter_id, p.name AS presenter_name, p.photo_url AS presenter_photo
    FROM schedule s
    LEFT JOIN presenters p ON p.id = s.presenter_id
    ORDER BY s.day_of_week ASC, s.start_time ASC
  `).all();
  res.json(rows);
});

// GET /api/schedule/now -> what's on air right now + what's next
router.get("/now", (req, res) => {
  const now = new Date();
  const day = now.getDay();
  const hhmm = now.toTimeString().slice(0, 5);

  const current = db.prepare(`
    SELECT s.*, p.name AS presenter_name
    FROM schedule s
    LEFT JOIN presenters p ON p.id = s.presenter_id
    WHERE s.day_of_week = ? AND s.start_time <= ? AND s.end_time > ?
    ORDER BY s.start_time ASC LIMIT 1
  `).get(day, hhmm, hhmm);

  const next = db.prepare(`
    SELECT s.*, p.name AS presenter_name
    FROM schedule s
    LEFT JOIN presenters p ON p.id = s.presenter_id
    WHERE s.day_of_week = ? AND s.start_time > ?
    ORDER BY s.start_time ASC LIMIT 1
  `).get(day, hhmm);

  res.json({ current: current || null, next: next || null });
});

// --- Admin-only writes ---

router.post("/", requireAdmin, (req, res) => {
  const { day_of_week, start_time, end_time, show_name, presenter_id, description } = req.body;
  if (day_of_week === undefined || !start_time || !end_time || !show_name) {
    return res.status(400).json({ error: "day_of_week, start_time, end_time, and show_name are required." });
  }

  const info = db.prepare(`
    INSERT INTO schedule (day_of_week, start_time, end_time, show_name, presenter_id, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(day_of_week, start_time, end_time, show_name, presenter_id || null, description || null);

  res.status(201).json(db.prepare("SELECT * FROM schedule WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM schedule WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Schedule entry not found" });

  const { day_of_week, start_time, end_time, show_name, presenter_id, description } = req.body;
  db.prepare(`
    UPDATE schedule SET day_of_week = ?, start_time = ?, end_time = ?, show_name = ?, presenter_id = ?, description = ?
    WHERE id = ?
  `).run(
    day_of_week ?? existing.day_of_week,
    start_time ?? existing.start_time,
    end_time ?? existing.end_time,
    show_name ?? existing.show_name,
    presenter_id !== undefined ? presenter_id : existing.presenter_id,
    description ?? existing.description,
    req.params.id
  );

  res.json(db.prepare("SELECT * FROM schedule WHERE id = ?").get(req.params.id));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM schedule WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Schedule entry not found" });
  res.status(204).end();
});

module.exports = router;
