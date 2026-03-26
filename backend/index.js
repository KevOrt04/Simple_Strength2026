require('dotenv').config();
const express = require('express');
const axios = require('axios');
const sqlite3 = require(`sqlite3`).verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.USDA_API_KEY;

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      protein INTEGER,
      carbs INTEGER,
      fats INTEGER,
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
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Saved successfully' });
    }
  );
});

app.get('/search', async (req, res) => {     //Searching Method for example, "localhost:3000/search?food=apple"
  try {                                      //Returns json file for all hits on the USDA database
    if (!req.query.food) {
      // Return here so the rest of the code doesn't run
      return res.status(400).json({ error: "Missing food parameter" });
    }
    const foodName = req.query.food;
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search`, {
      params: {
        api_key: API_KEY,
        query: foodName
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/search/:fdcid', async (req, res) => {       //Searching for individual fdcid's of foods for example, "http://localhost:3000/search/454004"
  try {
    const { fdcid } = req.params; // Grabs the ID from your URL

    if (!fdcid) {
      return res.status(400).json({ error: "Missing fdcid parameter" });
    }

    // 1. Note the singular 'food' 
    // 2. Note the ID is injected directly into the URL string
    const response = await axios.get(`https://api.nal.usda.gov/fdc/v1/food/${fdcid}`, {
      params: { api_key: API_KEY } // No 'query' here because the ID is in the Path!
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch food details' });
  }
});


app.post('/meals', (req, res) => {
  const { meal_name, meal_type, calories, protein, carbs, fats } = req.body;

  const today = new Date().toISOString().split('T')[0];

  db.run(
    `INSERT INTO meals 
     (meal_name, meal_type, calories, protein, carbs, fats, date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [meal_name, meal_type, calories, protein, carbs, fats, today],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Meal saved successfully', id: this.lastID });
    }
  );
});
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