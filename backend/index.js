require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: { encrypt: true, trustServerCertificate: false }
};

// DB connect
async function connectDB() {
  try {
    await sql.connect(dbConfig);
    console.log('✅ Connected to Azure SQL');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err);
  }
}
connectDB();


// ---------- LOGIN & SIGNUP ----------
// ---------- LOGIN & SIGNUP ----------
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await sql.query`INSERT INTO Users (name, email, password, role) VALUES (${name}, ${email}, ${password}, ${role})`;
    const user = await sql.query`SELECT id, name, email, role FROM Users WHERE email=${email}`;
    res.send({ successfull: true, user: user.recordset[0] });
  } catch (err) {
    res.status(500).send({ successfull: false, message: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql.query`SELECT id, name, email, role FROM Users WHERE email=${email} AND password=${password}`;
    if (result.recordset.length > 0)
      res.send({ successfull: true, user: result.recordset[0] });
    else
      res.send({ successfull: false, message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).send({ successfull: false, message: err.message });
  }
});



// ---------- SUBJECT MANAGEMENT ----------
app.post('/subjects', async (req, res) => {
  const { name, teacher_id } = req.body;
  try {
    await sql.query`INSERT INTO Subjects (name, teacher_id) VALUES (${name}, ${teacher_id})`;
    res.send('Subject added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/subjects/addStudent', async (req, res) => {
  const { student_id, subject_id } = req.body;
  try {
    await sql.query`INSERT INTO StudentSubjects (student_id, subject_id) VALUES (${student_id}, ${subject_id})`;
    res.send('Student added to subject');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/subjects/removeStudent', async (req, res) => {
  const { student_id, subject_id } = req.body;
  try {
    await sql.query`DELETE FROM StudentSubjects WHERE student_id=${student_id} AND subject_id=${subject_id}`;
    res.send('Student removed from subject');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// NEW: Get all subjects for a teacher (use this to populate dropdowns)
app.get('/teacher/subjects/:teacher_id', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await sql.query`SELECT id, name FROM Subjects WHERE teacher_id=${teacher_id} ORDER BY name`;
    res.send(result.recordset); // [{ id, name }, ...]
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// NEW: Get subjects for a student (with teacher info)
app.get('/student/subjects/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await sql.query(`
      SELECT S.id, S.name, S.teacher_id, U.name AS teacher_name, U.email AS teacher_email
      FROM Subjects S
      JOIN StudentSubjects SS ON SS.subject_id = S.id
      LEFT JOIN Users U ON S.teacher_id = U.id
      WHERE SS.student_id = ${student_id}
      ORDER BY S.name
    `);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ---------- ANNOUNCEMENTS ----------
app.post('/announcements', async (req, res) => {
  const { subject_id, teacher_id, title, content } = req.body;
  try {
    await sql.query`INSERT INTO Announcements (subject_id, teacher_id, title, content) 
                    VALUES (${subject_id}, ${teacher_id}, ${title}, ${content})`;
    res.send('Announcement added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/announcements/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await sql.query(`
      SELECT A.title, A.content, A.created_at, S.name AS subject_name, U.name AS teacher_name
      FROM Announcements A
      JOIN Subjects S ON A.subject_id = S.id
      JOIN Users U ON A.teacher_id = U.id
      JOIN StudentSubjects SS ON S.id = SS.subject_id
      WHERE SS.student_id = ${student_id}
    `);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// NEW: Get all announcements created by a teacher (for announcements tab)
app.get('/teacher/announcements/:teacher_id', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await sql.query`
      SELECT A.id, A.title, A.content, A.created_at, S.id AS subject_id, S.name AS subject_name
      FROM Announcements A
      JOIN Subjects S ON A.subject_id = S.id
      WHERE A.teacher_id = ${teacher_id}
      ORDER BY A.created_at DESC
    `;
    res.send(result.recordset); // [{ id, title, content, created_at, subject_id, subject_name }, ...]
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ---------- STUDENT DETAILS ----------
app.post('/student/details', async (req, res) => {
  const { student_id, attendance, marks } = req.body;
  try {
    await sql.query`INSERT INTO StudentDetails (student_id, attendance, marks) VALUES (${student_id}, ${attendance}, ${marks})`;
    res.send('Student details added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/student/details/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await sql.query(`
      -- use id (auto-increment) as fallback ordering since StudentDetails has no created_at
      SELECT TOP 1 * FROM StudentDetails
      WHERE student_id = ${student_id}
      ORDER BY id DESC
    `);
    res.json(result.recordset[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/teacher/students/:teacher_id', async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const result = await sql.query(`
      SELECT DISTINCT U.id, U.name, U.email
      FROM Users U
      JOIN StudentSubjects SS ON U.id = SS.student_id
      JOIN Subjects S ON SS.subject_id = S.id
      WHERE S.teacher_id = ${teacher_id}
    `);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// NEW: Get teachers related to a student (for messaging)
app.get('/student/teachers/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const result = await sql.query(`
      SELECT DISTINCT U.id, U.name, U.email
      FROM Users U
      JOIN Subjects S ON S.teacher_id = U.id
      JOIN StudentSubjects SS ON SS.subject_id = S.id
      WHERE SS.student_id = ${student_id}
    `);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ---------- PM MESSAGING ----------
app.post('/messages', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    await sql.query`INSERT INTO Messages (sender_id, receiver_id, message) VALUES (${sender_id}, ${receiver_id}, ${message})`;
    res.send('Message sent');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const result = await sql.query(`
      SELECT * FROM Messages 
      WHERE (sender_id=${user1} AND receiver_id=${user2}) 
      OR (sender_id=${user2} AND receiver_id=${user1})
      ORDER BY created_at ASC
    `);
    res.send(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ---------- SERVER ----------
const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
