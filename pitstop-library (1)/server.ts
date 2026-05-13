import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const db = new Database("library.db");
const JWT_SECRET = "f1-engine-secret";

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    category TEXT,
    available BOOLEAN DEFAULT 1,
    cover_url TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    demographics TEXT
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    loan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
  );

  INSERT OR REPLACE INTO books (title, author, isbn, category, cover_url) VALUES 
  ('Game Of Life How To Play It', 'Florence Scovel Shinn', '9781603861212', 'Biography', '/src/assets/images/regenerated_image_1778570176329.png'),
  ('Advanced Calculus', 'Michael Spivak', '978-0521869324', 'Mathematics', '/src/assets/images/regenerated_image_1778570466595.png'),
  ('Modern Operating Systems', 'Andrew Tanenbaum', '978-0133591620', 'Computer Science', 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&h=600&fit=crop'),
  ('Fundamentals of Physics', 'David Halliday', '978-1118230718', 'Physics', 'https://images.unsplash.com/photo-1532012197367-6849412a57ce?w=400&h=600&fit=crop'),
  ('Structural Dynamics', 'Mario Paz', '978-9401731676', 'Engineering', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=600&fit=crop'),
  ('Microeconomics', 'Robert Pindyck', '978-0134184241', 'Economics', 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=400&h=600&fit=crop');
`);

// Add a default admin if none exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'Admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password, email, role, demographics) VALUES (?, ?, ?, ?, ?)")
    .run("admin", hashedPassword, "admin@klelib.com", "Admin", JSON.stringify({ department: "System Admin", bio: "Core knowledge maintainer." }));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/register", (req, res) => {
    const { username, password, email, role, demographics } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const stmt = db.prepare("INSERT INTO users (username, password, email, role, demographics) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(username, hashedPassword, email, role || 'Student', JSON.stringify(demographics || {}));
      res.json({ id: result.lastInsertRowid, username, email, role });
    } catch (error: any) {
      res.status(400).json({ error: "Username or email already exists" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        avatar_url: user.avatar_url,
        demographics: JSON.parse(user.demographics || '{}')
      } 
    });
  });

  app.get("/api/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      demographics: JSON.parse(user.demographics || '{}')
    });
  });

  // API Routes
  app.get("/api/books", (req, res) => {
    const books = db.prepare("SELECT * FROM books ORDER BY id DESC").all();
    res.json(books);
  });

  app.post("/api/books", (req, res) => {
    const { title, author, isbn, category, cover_url } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO books (title, author, isbn, category, cover_url) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(title, author, isbn, category, cover_url);
      res.json({ id: result.lastInsertRowid, ...req.body });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const { title, author, category, available, cover_url, isbn } = req.body;
    try {
      const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(id) as any;
      const finalAvailable = available !== undefined ? (available ? 1 : 0) : existing.available;
      const stmt = db.prepare("UPDATE books SET title = ?, author = ?, category = ?, isbn = ?, available = ?, cover_url = ? WHERE id = ?");
      stmt.run(title, author, category, isbn, finalAvailable, cover_url, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM books WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.post("/api/books/:id/allocate", authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id) as any;
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.available) return res.status(400).json({ error: "Book already issued" });

    const loanStmt = db.prepare("INSERT INTO loans (user_id, book_id) VALUES (?, ?)");
    const bookStmt = db.prepare("UPDATE books SET available = 0 WHERE id = ?");

    const transaction = db.transaction(() => {
      loanStmt.run(userId, id);
      bookStmt.run(id);
    });

    transaction();
    res.json({ success: true });
  });

  app.get("/api/my-loans", authenticateToken, (req: any, res) => {
    const loans = db.prepare(`
      SELECT b.*, l.loan_date 
      FROM books b 
      JOIN loans l ON b.id = l.book_id 
      WHERE l.user_id = ?
    `).all(req.user.id);
    res.json(loans);
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
