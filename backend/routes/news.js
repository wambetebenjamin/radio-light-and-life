const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM news ORDER BY published_at DESC").all();
  res.json(rows);
});

router.get("/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM news WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Article not found" });
  res.json(row);
});

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Admin-only writes ---

router.post("/", requireAdmin, (req, res) => {
  const { title, excerpt, body, cover_image_url } = req.body;
  if (!title || !body) return res.status(400).json({ error: "Title and body are required." });

  let slug = slugify(title);
  const exists = db.prepare("SELECT id FROM news WHERE slug = ?").get(slug);
  if (exists) slug = `${slug}-${Date.now()}`;

  const info = db.prepare(`
    INSERT INTO news (title, slug, excerpt, body, cover_image_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, slug, excerpt || null, body, cover_image_url || null);

  res.status(201).json(db.prepare("SELECT * FROM news WHERE id = ?").get(info.lastInsertRowid));
});

router.put("/id/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM news WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Article not found" });

  const { title, excerpt, body, cover_image_url } = req.body;
  db.prepare(`
    UPDATE news SET title = ?, excerpt = ?, body = ?, cover_image_url = ?
    WHERE id = ?
  `).run(
    title ?? existing.title,
    excerpt ?? existing.excerpt,
    body ?? existing.body,
    cover_image_url ?? existing.cover_image_url,
    req.params.id
  );

  res.json(db.prepare("SELECT * FROM news WHERE id = ?").get(req.params.id));
});

router.delete("/id/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM news WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Article not found" });
  res.status(204).end();
});

module.exports = router;
