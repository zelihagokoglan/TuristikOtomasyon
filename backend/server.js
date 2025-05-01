const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const bcrypt = require("bcrypt"); // <-- BU SATIRI EKLEYİN

app.use(cors());
app.use(express.json());

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

// ✅ Kayıt olma (şifre hashlenerek veritabanına eklenir)
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Giriş yapma (şifre kontrol edilir)
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user.id });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/favorites", async (req, res) => {
  const { user_id, place_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, place_id)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, place_id]
    );

    res.status(201).json({ success: true, favorite: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Favori eklenemedi" });
  }
});

app.post("/comments", async (req, res) => {
  console.log("POST /comments endpoint hit");

  const { user_id, place_id, comment } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO comments (user_id, place_id, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, place_id, comment]
    );

    res.status(201).json({ success: true, comment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Yorum eklenemedi" });
  }
});
app.get("/comments", async (req, res) => {
  const { place_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM comments WHERE place_id = $1`,
      [place_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to get comments:", err.message);
    res.status(500).send("Server Error");
  }
});
