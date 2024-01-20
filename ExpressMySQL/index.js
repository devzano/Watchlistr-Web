const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const session = require('express-session');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const mysql = require('mysql2/promise');
const port = process.env.PORT || 3001;
const dbPass = process.env['DATABASE_PASSWORD'];
const secretKey = crypto.randomBytes(32).toString('hex');

const sessionOptions = {
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000,
  },
};

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

const pool = mysql.createPool({
  host: 'sql.freedb.tech',
  user: 'freedb_watchlistr_dev',
  port: 3306,
  password: dbPass,
  database: 'freedb_watchlistr',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,

  },
})

const executeQuery = async (query, params) => {
  const db = await pool.getConnection();
  try {
    const [results, fields] = await db.query(query, [...params]);
    return results;
  }
  catch (error) {
    throw error;
  }
  finally {
    db.release();
  }
};

app.delete('/users/:username', async (req, res) => {
  const { username } = req.params;
  console.log(username);

  try {
    const deleteMoviesQuery = 'DELETE FROM user_watchlist_movie WHERE username = ?';
    await executeQuery(deleteMoviesQuery, [username]);
    const deleteTVShowsQuery = 'DELETE FROM user_watchlist_tv WHERE username = ?';
    await executeQuery(deleteTVShowsQuery, [username]);
    const deleteUserQuery = 'DELETE FROM users WHERE username = ?';
    await executeQuery(deleteUserQuery, [username]);
    res.send({ message: `User ${username} and associated watchlist items deleted successfully` });
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || 'An error occurred while deleting the user and watchlist items.';
    res.status(500).send({ error: errorMessage });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password)
  try {
    const resultq = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const results = await executeQuery(resultq, [username, password]);
    const user = results[0];
    res.send({
      message: `User ${username} Created Successfully`,
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error.message || 'An Error Occurred While Creating The User';
    res.status(500).send({ error: errorMessage, errorCode: 'SIGNUP_ERROR' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const resultq = 'SELECT id, username, password FROM users WHERE username = ?';
    const results = await executeQuery(resultq, [username]);
    const user = results[0];
    if (!user) {
      throw new Error('Invalid Username');
    }
    const storedPassword = user.password;
    if (storedPassword !== password) {
      throw new Error('Invalid Password');
    }
    req.session.userId = user.id;
    const token = jwt.sign({ userId: user.id }, secretKey);
    res.send({
      message: 'Login Successful',
      userId: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    console.error(error);
    const errorMessage = error.message || 'An Error Occurred While Logging In.';
    res.status(401).send({ error: errorMessage, errorCode: 'LOGIN_ERROR' });
  }
});

app.post('/watchlist/movies', async (req, res) => {
  const { username } = req.body;
  console.log(username)
  try {
    const query = `SELECT * FROM user_watchlist_movie WHERE username = ?`;
    const result = await executeQuery(query, [username]);
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error Retrieving Movies Watchlist' });
  }
});

app.post('/watchlist/tv', async (req, res) => {
  const { username } = req.body;
  console.log(username)
  try {
    const query = `SELECT * FROM user_watchlist_tv WHERE username = ?`;
    const result = await executeQuery(query, [username]);
    console.log(result)
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error Retrieving Movies Watchlist' });
  }
});

app.post('/deletemovies', async (req, res) => {
  const { username, movieid } = req.body;
  console.log(username, movieid)
  try {
    const query = `DELETE FROM user_watchlist_movie
        WHERE username = ? AND movieId = ?
        `;
    const result = await executeQuery(query, [username, movieid]);
    console.log(result)
    res.send('delete');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error Retrieving Movies Watchlist' });
  }
});

app.post('/deleteshow', async (req, res) => {
  const { username, tvShowid } = req.body;
  console.log(username, tvShowid)
  try {
    const query = `DELETE FROM user_watchlist_tv
        WHERE username = ? AND tvShowId = ?
        `;
    const result = await executeQuery(query, [username, tvShowid]);
    console.log(result)
    res.send('delete');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error Retrieving Tv show Watchlist' });
  }
});

app.post('/user-watchlist-movie', async (req, res) => {
  const { movieId, title, releaseDate, runtime, posterPath, overview, userId } = req.body;
  console.log(req.body)
  const query = `INSERT INTO user_watchlist_movie(movieId, title, releaseDate, runtime, posterPath, overview, username) VALUES(?,?,?,?,?,?,?)`;
  try {
    const result = await executeQuery(query, [movieId, title, releaseDate, runtime, posterPath, overview, userId])
    res.send('success')
  } catch (error) {
    console.error(error)
  }
})

app.post('/user-watchlist-tv', async (req, res) => {
  const { tvShowId, name, airDates, runtime, posterPath, overview, userId } = req.body;
  console.log(req.body)
  const query = `INSERT INTO user_watchlist_tv(tvShowId, name, airDates, runtime, posterPath, overview, username) VALUES(?,?,?,?,?,?,?)`;
  try {
    const result = await executeQuery(query, [tvShowId, name, airDates, runtime, posterPath, overview, userId])
    res.send('success')
  } catch (error) {
    console.error(error)
  }
})

server.listen(port, () => {
  console.log('Server is listening on port', port);
});