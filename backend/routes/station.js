const express = require("express");

const router = express.Router();

// GET /api/station -> stream + station config the frontend needs to render the player
router.get("/", (req, res) => {
  res.json({
    name: process.env.STATION_NAME || "Radio Light and Life",
    frequency: process.env.STATION_FREQUENCY || "107.3 FM",
    tagline: process.env.STATION_TAGLINE || "Changing Lives",
    city: process.env.STATION_CITY || "Kericho, Kenya",
    streamUrl: process.env.STREAM_URL || "",
    metadataUrl: process.env.STREAM_METADATA_URL || "",
  });
});

module.exports = router;
