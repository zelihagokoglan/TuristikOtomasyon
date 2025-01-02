const express = require("express");
const pool = require("../../backend/database/db");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  const { lat, lon, radius } = req.query;

  if (!lat || !lon || !radius) {
    return res
      .status(400)
      .json({ error: "lat, lon ve radius parametreleri zorunludur." });
  }

  try {
    const query = `
            SELECT * FROM get_nearby_places($1, $2, $3);
        `;
    const { rows } = await pool.query(query, [lat, lon, radius]);
    res.json(rows);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
