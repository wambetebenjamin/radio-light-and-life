const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { requireAdmin } = require("./auth");

const router = express.Router();

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"].includes(ext) ? ext : ".pdf";
    cb(null, `application-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// This upload endpoint is intentionally PUBLIC (no requireAdmin) since applicants
// aren't logged in — it's restricted instead by file type and a smaller size cap.
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ok = ALLOWED_TYPES.includes(file.mimetype);
    cb(ok ? null : new Error("Only PDF, Word documents, JPG, or PNG files are allowed."), ok);
  },
});

// POST /api/applications/upload -> { url }
router.post("/upload", upload.single("attachment"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

// POST /api/applications -> submit an application/enquiry (public)
router.post("/", (req, res) => {
  const { type, name, email, phone, message, attachment_url } = req.body;
  const validTypes = ["internship", "advert", "partnership", "other"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "type must be one of: internship, advert, partnership, other." });
  }
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const info = db.prepare(`
    INSERT INTO applications (type, name, email, phone, message, attachment_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(type, name, email, phone || null, message, attachment_url || null);

  res.status(201).json({ id: info.lastInsertRowid, message: "Application received." });
});

// GET /api/applications -> admin only, view submissions
router.get("/", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM applications ORDER BY created_at DESC").all();
  res.json(rows);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM applications WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Application not found" });
  res.status(204).end();
});

module.exports = router;
