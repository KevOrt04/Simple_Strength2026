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
  db.run(`
  CREATE TABLE IF NOT EXISTS weights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weight INTEGER NOT NULL,
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


// ==================
// MEAL PLANNER (SUGGESTIONS)
// ==================

app.post('/mealplan', (req, res) => {
  const { goal, diet } = req.body;
  
  const validGoals = ["weight_loss", "muscle_gain"];
  const validDiets = ["none", "vegetarian", "vegan"];
  if (!validGoals.includes(goal)) {
  return res.status(400).json({ error: "Invalid goal" });
}

if (!validDiets.includes(diet)) {
  return res.status(400).json({ error: "Invalid diet" });
}

  if (!goal) {
    return res.status(400).json({ error: "Goal is required" });
  }

  // 🔹 Unified meal dataset (goal + diet combined)
 const allMeals = [
  // ======================
  // WEIGHT LOSS - NONE
  // ======================
  { name: "Grilled chicken salad", goal: "weight_loss", diet: "none" },
  { name: "Salmon with broccoli", goal: "weight_loss", diet: "none" },
  { name: "Turkey lettuce wraps", goal: "weight_loss", diet: "none" },
  { name: "Grilled shrimp with quinoa", goal: "weight_loss", diet: "none" },
  { name: "Baked cod with green beans", goal: "weight_loss", diet: "none" },
  { name: "Chicken breast with roasted vegetables", goal: "weight_loss", diet: "none" },

  // ======================
  // WEIGHT LOSS - VEGETARIAN
  // ======================
  { name: "Egg white omelet", goal: "weight_loss", diet: "vegetarian" },
  { name: "Greek yogurt with berries", goal: "weight_loss", diet: "vegetarian" },
  { name: "Cottage cheese with fruit", goal: "weight_loss", diet: "vegetarian" },
  { name: "Vegetable quinoa bowl", goal: "weight_loss", diet: "vegetarian" },
  { name: "Zucchini noodles with pesto", goal: "weight_loss", diet: "vegetarian" },

  // ======================
  // WEIGHT LOSS - VEGAN
  // ======================
  { name: "Tofu stir fry", goal: "weight_loss", diet: "vegan" },
  { name: "Quinoa veggie bowl", goal: "weight_loss", diet: "vegan" },
  { name: "Lentil salad", goal: "weight_loss", diet: "vegan" },
  { name: "Chickpea salad", goal: "weight_loss", diet: "vegan" },
  { name: "Vegetable soup", goal: "weight_loss", diet: "vegan" },

  // ======================
  // MUSCLE GAIN - NONE
  // ======================
  { name: "Chicken and rice", goal: "muscle_gain", diet: "none" },
  { name: "Steak with potatoes", goal: "muscle_gain", diet: "none" },
  { name: "Salmon with rice", goal: "muscle_gain", diet: "none" },
  { name: "Ground beef pasta", goal: "muscle_gain", diet: "none" },
  { name: "Chicken burrito bowl", goal: "muscle_gain", diet: "none" },

  // ======================
  // MUSCLE GAIN - VEGETARIAN
  // ======================
  { name: "Eggs with toast", goal: "muscle_gain", diet: "vegetarian" },
  { name: "Protein yogurt bowl", goal: "muscle_gain", diet: "vegetarian" },
  { name: "Oatmeal with protein powder", goal: "muscle_gain", diet: "vegetarian" },
  { name: "Vegetarian pasta with cheese", goal: "muscle_gain", diet: "vegetarian" },
  { name: "Rice and beans with cheese", goal: "muscle_gain", diet: "vegetarian" },

  // ======================
  // MUSCLE GAIN - VEGAN
  // ======================
  { name: "Lentil curry", goal: "muscle_gain", diet: "vegan" },
  { name: "Vegan protein smoothie", goal: "muscle_gain", diet: "vegan" },
  { name: "Tofu rice bowl", goal: "muscle_gain", diet: "vegan" },
  { name: "Chickpea curry with rice", goal: "muscle_gain", diet: "vegan" },
  { name: "Peanut butter banana smoothie", goal: "muscle_gain", diet: "vegan" }
];

  // 🔹 Filter logic (goal AND diet)
  let meals = allMeals.filter(meal => {
    const goalMatch = meal.goal === goal;
    const dietMatch = diet === "none" || meal.diet === diet;
    return goalMatch && dietMatch;
  });

  // 🔹 Fallback (if no match, still return something useful)
  if (meals.length === 0) {
    meals = allMeals.filter(meal => meal.goal === goal);
  }

  // 🔹 Randomize + limit results
  const shuffled = [...meals].sort(() => 0.5 - Math.random());
  const selectedMeals = shuffled.slice(0, 5);

  // 🔹 Send only names
  res.json({ meals: selectedMeals.map(m => m.name) });
});




//CREATE
app.post('/weights', (req, res) => {
  const { weight, date } = req.body;

  if (!weight || isNaN(weight) || weight <= 0) {
    return res.status(400).json({ error: "Invalid weight value" });
  }

  const finalDate = date && date !== "" ? date : getLocalDate();

  db.run(
    `INSERT INTO weights (weight, date) VALUES (?, ?)`,
    [weight, finalDate],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ id: this.lastID, weight, date: finalDate });
    }
  );
});

//READ
app.get('/weights', (req, res) => {
  db.all(`SELECT * FROM weights ORDER BY date DESC`, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

//DELETE
app.delete('/weights/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM weights WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ message: "Deleted successfully" });
  });
});

//UPDATE (EDIT)
app.put('/weights/:id', (req, res) => {
  const { id } = req.params;
  const { weight, date } = req.body;

  if (!weight || isNaN(weight) || weight <= 0) {
    return res.status(400).json({ error: "Invalid weight value" });
  }

  db.run(
    `UPDATE weights SET weight = ?, date = ? WHERE id = ?`,
    [weight, date, id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ message: "Updated successfully" });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});