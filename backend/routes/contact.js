const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const info = db.prepare(`
    INSERT INTO contact_messages (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, email, phone || null, subject || null, message);

  // Optional: wire up SMTP here using the SMTP_* variables in .env to email
  // CONTACT_RECEIVING_EMAIL whenever a message comes in.

  res.status(201).json({ id: info.lastInsertRowid, message: "Message received." });
});

// NOTE: protect this route (e.g. with an admin login) before deploying publicly.
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM contact_messages ORDER BY created_at DESC").all();
  res.json(rows);
});

module.exports = router;
