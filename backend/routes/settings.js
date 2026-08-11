const express = require("express");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

const DEFAULTS = {
  hero_image_url: "https://images.unsplash.com/photo-1485579149621-3123dd979885?fm=jpg&q=85&w=2200&auto=format&fit=crop",
  about_studio_image_url: "https://images.unsplash.com/photo-1485579149621-3123dd979885?fm=jpg&q=80&w=1600&auto=format&fit=crop",
  about_hills_image_url: "https://images.unsplash.com/photo-1742106856193-5cc3424ac450?fm=jpg&q=80&w=1600&auto=format&fit=crop",
};

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT key, value FROM site_settings").all();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json({ ...DEFAULTS, ...stored });
});

router.put("/", requireAdmin, (req, res) => {
  const allowedKeys = Object.keys(DEFAULTS);
  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  const tx = db.transaction((entries) => {
    for (const [key, value] of entries) {
      if (allowedKeys.includes(key)) upsert.run(key, value);
    }
  });
  tx(Object.entries(req.body || {}));

  const rows = db.prepare("SELECT key, value FROM site_settings").all();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json({ ...DEFAULTS, ...stored });
});

module.exports = router;
