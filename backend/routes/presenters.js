const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM presenters ORDER BY name ASC").all();
  res.json(rows);
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM presenters WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Presenter not found" });
  res.json(row);
});

// --- Admin-only writes ---

router.post("/", requireAdmin, (req, res) => {
  const { name, role, bio, photo_url, show_name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required." });

  const info = db.prepare(`
    INSERT INTO presenters (name, role, bio, photo_url, show_name)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, role || null, bio || null, photo_url || null, show_name || null);

  res.status(201).json(db.prepare("SELECT * FROM presenters WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM presenters WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Presenter not found" });

  const { name, role, bio, photo_url, show_name } = req.body;
  db.prepare(`
    UPDATE presenters SET name = ?, role = ?, bio = ?, photo_url = ?, show_name = ?
    WHERE id = ?
  `).run(
    name ?? existing.name,
    role ?? existing.role,
    bio ?? existing.bio,
    photo_url ?? existing.photo_url,
    show_name ?? existing.show_name,
    req.params.id
  );

  res.json(db.prepare("SELECT * FROM presenters WHERE id = ?").get(req.params.id));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM presenters WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Presenter not found" });
  res.status(204).end();
});

module.exports = router;
