require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
// Multer for file uploads (stores in memory)
const upload = multer({ storage: multer.memoryStorage() });

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_SERVER);
console.log(process.env.DB_DATABASE);
console.log(process.env.DB_PORT);

// ==========================
// 🔧 Database Config
// ==========================
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};



// Connect to DB once
sql.connect(dbConfig)
  .then(() => {
    console.log('✅ Connected to SQL Database!');
    app.listen(5000, () => {
      console.log('✅ Server running at http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err);
  });

// ==========================
// 🔐 LOGIN
// ==========================
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT Username, Email, PasswordHash, IsTeacher FROM dbo.Users WHERE Email = @email');

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid password' });

    res.json({ message: 'Login successful', username: user.Username, email: user.Email, isTeacher: Boolean(user.IsTeacher) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==========================
// 📝 SIGNUP
// ==========================
app.post('/signup', async (req, res) => {
  const { username, email, password, isTeacher } = req.body;

  if (!username || !email || !password || typeof isTeacher !== 'boolean')
    return res.status(400).json({ message: 'All fields are required, including isTeacher' });

  try {
    const pool = await sql.connect(dbConfig);

    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.Users WHERE Email = @email');

    if (checkUser.recordset.length > 0)
      return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('passwordHash', sql.VarChar, hashedPassword)
      .input('isTeacher', sql.Bit, isTeacher)
      .query(`
        INSERT INTO dbo.Users (Username, Email, PasswordHash, IsTeacher)
        VALUES (@username, @email, @passwordHash, @isTeacher)
      `);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error during signup' });
  }
});

// ==========================
// 🚀 Server
// ==========================
console.log('Starting server...');
