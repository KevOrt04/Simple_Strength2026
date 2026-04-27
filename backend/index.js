const express = require('express');
const sqlite3 = require (`sqlite3`).verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
};

//connect to SQlite database
const db = new sqlite3.Database(`./database.db`);

// Create calories and meal table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS calories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      date TEXT NOT NULL
    )
  `);
   db.run(`
    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      calories INTEGER,
     
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

// ==================
// CALORIES ROUTES
// ==================

// CREATE
app.post('/calories', (req, res) => {
  const { food_name, calories, date } = req.body;

  //BASIC VALIDATION
  if (!food_name || typeof food_name !== "string" || !/^[a-zA-Z\s]+$/.test(food_name)) {
    return res.status(400).json({ error: "Food name must contain only letters" });
  }

  if (calories === undefined || isNaN(calories) || calories <= 0 || calories > 2000) {
    return res.status(400).json({ error: "Calories must be between 1 and 2000" });
  }

  const finalDate = date && date !== ""
    ? date
    : getLocalDate();

  db.run(
    `INSERT INTO calories (food_name, calories, date)
     VALUES (?, ?, ?)`,
    [food_name, calories, finalDate],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Saved successfully" });
    }
  );
});


// READ
app.get('/calories', (req, res) => {
  db.all(
    `SELECT * FROM calories ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

app.delete('/calories/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM calories WHERE id = ?`,
    [id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Deleted successfully', id });
    }
  );
});

app.put('/calories/:id', (req, res) => {
  const { id } = req.params;
  const { food_name, calories, date } = req.body;

  // SAME VALIDATION
  if (!food_name || typeof food_name !== "string" || !/^[a-zA-Z\s]+$/.test(food_name)) {
    return res.status(400).json({ error: "Food name must contain only letters" });
  }

  if (calories === undefined || isNaN(calories) || calories <= 0 || calories > 2000) {
    return res.status(400).json({ error: "Calories must be between 1 and 2000" });
  }

  const finalDate = date && date !== ""
    ? date
    : getLocalDate();

  db.run(
    `UPDATE calories 
     SET food_name = ?, calories = ?, date = ?
     WHERE id = ?`,
    [food_name, calories, finalDate, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Updated successfully" });
    }
  );
});

// =============
// MEALS ROUTES
// =============

// CREATE
app.post('/meals', (req, res) => {
  const { meal_name, meal_type, calories, date } = req.body;

  const finalDate = date && date != ""
  ? date
  : getLocalDate();

  db.run(
    `INSERT INTO meals 
     (meal_name, meal_type, calories, date)
     VALUES (?, ?, ?, ?)`,
    [meal_name, meal_type, calories, finalDate],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Meal saved successfully', id: this.lastID });
    }
  );
});

// READ
app.get('/meals', (req, res) => {
  db.all(
    `SELECT * FROM meals ORDER BY date DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});