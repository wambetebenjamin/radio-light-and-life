require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

require("./seed"); // seeds the sqlite db on first run only

const scheduleRoutes = require("./routes/schedule");
const presenterRoutes = require("./routes/presenters");
const newsRoutes = require("./routes/news");
const contactRoutes = require("./routes/contact");
const stationRoutes = require("./routes/station");
const uploadRoutes = require("./routes/upload");
const settingsRoutes = require("./routes/settings");
const applicationRoutes = require("./routes/applications");
const encouragementRoutes = require("./routes/encouragements");
const songRequestRoutes = require("./routes/songRequests");
const { router: authRoutes } = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/presenters", presenterRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/station", stationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/encouragements", encouragementRoutes);
app.use("/api/song-requests", songRequestRoutes);

app.listen(PORT, () => {
  console.log(`Radio Light and Life API running on http://localhost:${PORT}`);
});
