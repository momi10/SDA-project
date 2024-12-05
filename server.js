const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lahore789',
  database: 'newdb', // Correct database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Routes

// Home route for 2.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/2.html')); // Serves 2.html as the main HTML file
});

// Route for browsepage.html
app.get('/browsepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/browsepage.html')); // Serves browsepage.html
});


// Courses Routes
app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/2.html'));
});

app.post('/courses', (req, res) => {
  const { courseid, coursename } = req.body;

  // Validate input
  if (!courseid || !coursename) {
    return res.status(400).json({ message: 'Course ID and Course Name are required' });
  }

  const query = 'INSERT INTO courses (courseid, coursename) VALUES (?, ?)';
  db.query(query, [courseid, coursename], (err, result) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ message: 'Failed to add course. Please try again later.' });
    }
    res.send('Course added successfully!');
  });
});

// Fields Routes
app.get('/fields', (req, res) => {
  const query = 'SELECT * FROM fields ORDER BY fieldid DESC';
  db.query(query, (err, result) => {
      if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ message: 'Failed to retrieve fields. Please try again later.' });
      }
      res.json(result); // Send the data as JSON
  });
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
