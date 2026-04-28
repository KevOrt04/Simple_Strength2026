
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const sqlite3 = require(`sqlite3`).verbose();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.USDA_API_KEY;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to SQlite database
const db = new sqlite3.Database(`./database.db`);


// Routes

// Sessions (required for Google OAuth "login" persistence)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_insecure_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true behind HTTPS (production)
  },
}));

app.use(passport.initialize());
app.use(passport.session());

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value || null,
      };

      db.run(
        `INSERT OR IGNORE INTO users (id, display_name, email)
     VALUES (?, ?, ?)`,
        [user.id, user.displayName, user.email],
        (err) => {
          if (err) console.error(err);
          return done(null, user);
        });
    }
  ));
}


// Create calories and meal table if it doesn't exist
db.serialize(() => {

  db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    display_name TEXT,
    email TEXT
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS weights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    weight REAL NOT NULL,
    unit TEXT NOT NULL DEFAULT 'lbs',
    date TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS calories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    food_name TEXT NOT NULL,
    calories INTEGER NOT NULL,
    date TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
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

function todayString() {
  return new Intl.DateTimeFormat('en-CA').format(new Date()); 
  // 'en-CA' uses the YYYY-MM-DD format
}


app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


// ---- Google OAuth routes ----
app.get('/auth/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET in environment' });
  }
  return next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: true }, (err, user, info) => {
    if (err) {
      const oauthErrorDetails =
        err.oauthError?.data ||
        err.oauthError?.message ||
        err.message ||
        'Unknown OAuth error';

      console.error('Google OAuth callback error:', oauthErrorDetails);
      return res.status(500).json({
        error: 'Google token exchange failed',
        details: oauthErrorDetails,
      });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Google authentication failed',
        details: info || null,
      });
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Session login error after Google auth:', loginErr.message);
        return res.status(500).json({ error: 'Session login failed' });
      }

      // Redirect back to the frontend after successful login
      return res.redirect(`${FRONTEND_ORIGIN}/`);
    });
  })(req, res, next);
});

app.get('/auth/google/failure', (req, res) => {
  res.status(401).send('Google authentication failed');
});

app.get('/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ authenticated: false });
  return res.json({ authenticated: true, user: req.user });
});

app.post('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.json({ ok: true }));
  });
});

app.post('/weights', requireAuth, (req, res) => {
  const { weight, unit } = req.body;

  const today = todayString();
  const userId = req.user.id;

  if (weight == null) {
    return res.status(400).json({ error: 'weight is required' });
  }

  db.run(
    `INSERT INTO weights (user_id, weight, unit, date)
     VALUES (?, ?, ?, ?)`,
    [
      userId,
      weight,
      unit || 'lbs',
      today
    ],
    function (err) {

      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }



      res.json({
        message: 'Weight saved successfully',
        id: this.lastID
      });
    }
  );
});

app.get('/weights', requireAuth, (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  let sql = `SELECT * FROM weights WHERE user_id = ?`;
  const params = [userId];

  if (date) {
    sql += ` AND date = ?`;
    params.push(date);
  }

  sql += ` ORDER BY date DESC, id DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(rows);
  });
});

app.delete('/weights/:id', requireAuth, (req, res) => {
  const weightId = req.params.id;
  const userId = req.user.id;

  db.run(
    `DELETE FROM weights WHERE id = ? AND user_id = ?`,
    [weightId, userId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Weight entry not found' });
      }

      res.json({ message: 'Weight entry deleted successfully' });
    }
  );
});

app.post('/calories', requireAuth, (req, res) => {
  const { food_name, calories } = req.body;
  const today = todayString();
  const userId = req.user.id;

  db.run(
    `INSERT INTO calories (user_id, food_name, calories, date)
     VALUES (?, ?, ?, ?)`,
    [userId, food_name, calories, today],
    function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json({ message: 'Saved successfully' });
    }
  );
});



app.get('/calories', requireAuth, (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  let sql = `SELECT * FROM calories WHERE user_id = ?`;
  const params = [userId];

  if (date) {
    sql += ` AND date = ?`;
    params.push(date);
  }

  sql += ` ORDER BY date DESC, id DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.delete('/calories/:id', requireAuth, (req, res) => {
  const entryId = req.params.id;
  const userId = req.user.id;

  db.run(
    `DELETE FROM calories WHERE id = ? AND user_id = ?`,
    [entryId, userId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Calorie entry not found' });
      }

      res.json({ message: 'Calorie entry deleted successfully' });
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


app.post('/meals', requireAuth, (req, res) => {
  const { meal_name, meal_type, calories, protein, carbs, fats } = req.body;

  const today = todayString();
  const userId = req.user.id;

  if (!meal_name || !meal_type) {
    return res.status(400).json({ error: 'meal_name and meal_type are required' });
  }

  db.run(
    `INSERT INTO meals 
     (user_id, meal_name, meal_type, calories, protein, carbs, fats, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      meal_name,
      meal_type,
      calories ?? null,
      protein ?? null,
      carbs ?? null,
      fats ?? null,
      today
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        message: 'Meal saved successfully',
        id: this.lastID
      });
    }
  );
});

app.get('/meals', requireAuth, (req, res) => {
  const { date, meal_type } = req.query;
  const userId = req.user.id;

  let sql = `SELECT * FROM meals WHERE user_id = ?`;
  const params = [userId];

  if (date) {
    sql += ` AND date = ?`;
    params.push(date);
  }

  if (meal_type) {
    sql += ` AND meal_type = ?`;
    params.push(meal_type);
  }

  sql += ` ORDER BY date DESC, id DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(rows);
  });
});

app.delete('/meals/:id', requireAuth, (req, res) => {
  const mealId = req.params.id;
  const userId = req.user.id;

  db.run(
    `DELETE FROM meals WHERE id = ? AND user_id = ?`,
    [mealId, userId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Meal not found' });
      }

      res.json({ message: 'Meal deleted successfully' });
    }
  );
});

 
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});