require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Banco local
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new Database(dbPath);

// Criação das tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER,
    property_id INTEGER,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
  );
`);

// ---------------- ROTAS ---------------- //

// Buscar favoritos de um usuário
app.get("/favorites/:userId", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT p.* FROM favorites f
      JOIN properties p ON f.property_id = p.id
      WHERE f.user_id = ?
    `);
    const result = stmt.all(req.params.userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar favoritos." });
  }
});

// Adicionar favorito
app.post("/favorites", (req, res) => {
  const { userId, propertyId } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO favorites (user_id, property_id) VALUES (?, ?)
    `);
    stmt.run(userId, propertyId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao adicionar favorito." });
  }
});

// Remover favorito
app.delete("/favorites", (req, res) => {
  const { userId, propertyId } = req.body;
  try {
    const stmt = db.prepare(`
      DELETE FROM favorites WHERE user_id = ? AND property_id = ?
    `);
    stmt.run(userId, propertyId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover favorito." });
  }
});

// Listar propriedades
app.get("/properties", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM properties ORDER BY created_at DESC");
    const result = stmt.all();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar propriedades." });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
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

// Registrar usuário (extra!)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
    );
    const info = stmt.run(name, email, hash);
    res.json({ id: info.lastInsertRowid, name, email });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar usuário. Email pode já estar em uso." });
  }
});

// ---------------- SERVER ---------------- //
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
