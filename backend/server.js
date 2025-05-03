const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const bcrypt = require("bcrypt");

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

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    const userId = result.rows[0].id;

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

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
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ success: false, error: "Bu yer zaten favorilerde" });
    }

    console.error("Favori ekleme hatası:", err);
    res.status(500).json({ success: false, error: "Favori eklenemedi" });
  }
});
app.get("/favorites", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM favorites");
    res.json(result.rows);
  } catch (err) {
    console.error("Favorileri getirme hatası:", err.message);
    res.status(500).json({ success: false, error: "Favoriler alınamadı" });
  }
});
app.get("/places-with-favorites", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        COUNT(f.id) AS favorite_count
      FROM 
        places p
      LEFT JOIN 
        favorites f ON p.id = f.place_id
      GROUP BY 
        p.id, p.name
      ORDER BY 
        favorite_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/favorites/count/:placeId", async (req, res) => {
  const { placeId } = req.params;

  try {
    const result = await pool.query(
      `SELECT COUNT(*) AS count FROM favorites WHERE place_id = $1`,
      [placeId]
    );
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error("Favori sayısı alınamadı:", err.message);
    res.status(500).json({ error: "Sunucu hatası" });
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
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

app.post("/admin/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: "Bu admin zaten kayıtlı" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id",
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "Admin başarıyla kaydedildi",
      adminId: result.rows[0].id,
    });
  } catch (err) {
    console.error("Admin kayıt hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.post("/admin/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Geçersiz e-posta veya şifre" });
    }

    const token = jwt.sign({ adminId: admin.id, role: "admin" }, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.status(200).json({ message: "Giriş başarılı", token });
  } catch (err) {
    console.error("Admin giriş hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

function verifyAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, admin) => {
    if (err) return res.sendStatus(403);
    req.admin = admin;
    next();
  });
}

app.get("/admin/dashboard", verifyAdminToken, (req, res) => {
  res.json({ message: `Hoş geldin admin ${req.admin.adminId}` });
});

app.get("/user-favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT f.*, p.name AS place_name
       FROM favorites f
       JOIN places p ON f.place_id = p.id
       WHERE f.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Kullanıcı favorileri alınamadı:", err.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

app.get("/user-comments/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.id, c.comment, c.created_at, p.name AS place_name
       FROM comments c
       JOIN places p ON c.place_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Kullanıcı yorumları alınamadı:", err.message);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});
// Add a DELETE route to handle comment deletion in your backend
app.delete("/user-comments/:userId/:commentId", async (req, res) => {
  const { userId, commentId } = req.params;

  try {
    // Check if the user is allowed to delete the comment
    const result = await pool.query(
      "DELETE FROM comments WHERE user_id = $1 AND id = $2 RETURNING *",
      [userId, commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/user-favorites/:userId/:placeId", async (req, res) => {
  const { userId, placeId } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND place_id = $2 RETURNING *",
      [userId, placeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Favori bulunamadı" });
    }

    res.status(200).json({ message: "Favori başarıyla silindi" });
  } catch (err) {
    console.error("Favori silme hatası:", err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
