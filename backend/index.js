const express = require('express');
const sqlite3 = require (`sqlite3`).verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//connect to SQlite database
const db = new sqlite3.Database(`./database.db`);

// Create calories table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS calories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/calories', (req, res) => {
  const { food_name, calories } = req.body;

  const today = new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO calories (food_name, calories, date)
     VALUES (?, ?, ?)`,
    [food_name, calories, today],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Saved successfully' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});