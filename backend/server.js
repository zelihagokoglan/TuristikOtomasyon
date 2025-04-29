const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dbtasarim",
  password: "138553",
  port: 5432,
});

app.get("/nearby-places", async (req, res) => {
  const { latitude, longitude, radius } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, name, type, address, latitude, longitude, description, image_url
      FROM places
      WHERE ST_DWithin(
        geography(ST_MakePoint(longitude, latitude)),
        geography(ST_MakePoint($1, $2)),
        $3
      );
`,
      [longitude, latitude, radius]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).send("Server Error");
  }
});

app.use(express.json());

app.post("/add-place", async (req, res) => {
  const { name, type, address, latitude, longitude, description, image_url } =
    req.body;

  try {
    await pool.query(
      `INSERT INTO places (name, type, address, latitude, longitude, description, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, type, address, latitude, longitude, description, image_url]
    );

    res.status(201).send("Place added successfully");
  } catch (err) {
    console.error("Failed to insert place:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
