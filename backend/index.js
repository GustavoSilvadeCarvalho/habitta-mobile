require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, phone } = req.body;
  if (!name || !email || !password || !confirmPassword || !phone) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas não conferem." });
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone",
      [name, email, password_hash, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

app.get("/favorites/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.* FROM favorites f
        JOIN properties p ON f.property_id = p.id
        WHERE f.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar favoritos." });
  }
});

app.post("/favorites", async (req, res) => {
  const { userId, propertyId } = req.body;
  try {
    await pool.query(
      `INSERT INTO favorites (user_id, property_id) VALUES ($1, $2)
        ON CONFLICT (user_id, property_id) DO NOTHING`,
      [userId, propertyId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar favorito." });
  }
});

app.delete("/favorites", async (req, res) => {
  const { userId, propertyId } = req.body;
  try {
    await pool.query(
      `DELETE FROM favorites WHERE user_id = $1 AND property_id = $2`,
      [userId, propertyId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover favorito." });
  }
});

app.get("/properties", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar propriedades." });
  }
});

app.get("/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Propriedade não encontrada." });
    }
  } catch (err) {
    console.error('Erro ao buscar propriedade por ID:', err)
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      const { password_hash, ...userData } = user;
      res.json(userData);
    } else {
      res.status(401).json({ error: "Email ou senha inválidos." });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
