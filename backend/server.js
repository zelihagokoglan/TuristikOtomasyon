const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const bcrypt = require("bcrypt"); // <-- BU SATIRI EKLEYİN

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
