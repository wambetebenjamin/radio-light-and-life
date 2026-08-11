const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

function getSecret() {
  return process.env.JWT_SECRET || "dev-only-insecure-secret";
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUsername = process.env.ADMIN_USERNAME || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "changeme123";

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ error: "Incorrect username or password." });
  }

  const token = jwt.sign({ role: "admin", username }, getSecret(), { expiresIn: "12h" });
  res.json({ token });
});

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Not logged in." });

  try {
    req.admin = jwt.verify(token, getSecret());
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired, please log in again." });
  }
}

module.exports = { router, requireAdmin };
