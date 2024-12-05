const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// MySQL connection
app.use(express.static(path.join(__dirname)));


const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root',       
  password: 'eliya123', 
  database: 'career', 
});


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// User Class
class User {
  constructor(userid, username, password) {
    this.userid = userid;
    this.username = username;
    this.password = password;
  }

  // Method to save user to the MySQL database
  save() {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO userdetails (userid, username, userpassword) VALUES (?, ?, ?)';
      db.query(query, [this.userid, this.username, this.password], (err, results) => {
        if (err) {
          reject('Error creating account: ' + err);
        } else {
          resolve('Account created successfully!');
        }
      });
    });
  }

  updateName(newname) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE userdetails SET username = ? WHERE userid = ?`;  // Correct table name is 'userdetails'
      db.query(query, [newname, this.userid], (err, result) => {
        if (err) {
          reject('Failed to update name.');
        } else if (result.affectedRows === 0) {
          reject('User ID not found.');
        } else {
          resolve('Name updated successfully.');
        }
      });
    });
  }


  updatePassword(newpassword) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE userdetails SET userpassword = ? WHERE userid = ?`;
      db.query(query, [newpassword, this.userid], (err, result) => {
        if (err) {
          reject('Failed to update password.');
        } else if (result.affectedRows === 0) {
          reject('User ID not found.');
        } else {
          resolve('Password updated successfully.');
        }
      });
    });
  }

}

// Route to sign-up 
app.post('/signup', (req, res) => {
  const { userid, username, password } = req.body; // Extract data 

  // Create a new User instance
  const newUser = new User(userid, username, password);

  // Call the save method to insert the user data into MySQL
  newUser
    .save()
    .then(() => {
      res.redirect('/homepage'); // Redirect to homepage 
    })
    .catch((err) => {
      res.status(500).send(err); // Send error message 
    });
});


// Route to  login 
app.post('/login', (req, res) => {
  const { userid, username, password } = req.body; // Extract data 

  // Query to check if user exists 
  const query = 'SELECT * FROM userdetails WHERE userid = ? AND username = ? AND userpassword = ?';
  db.query(query, [userid, username, password], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Internal Server Error');
    } else if (results.length > 0) {
      res.redirect('/homepage');
    } else {
      res.status(401).send('Invalid User ID, Username, or Password');
    }
  });
});

app.post('/update-name', (req, res) => {
  const { userid, newname } = req.body;    // Extract data 

  // Create a User 
  const user = new User(userid);

  // Call the updateName method to update the username
  user
    .updateName(newname)
    .then(() => {
      res.redirect('/homepage'); // Redirect to homepage 
    })
    .catch((err) => {
      res.status(500).send(err); // Send error message 
    });
});


// Route to handle updating the password (POST request)
app.post('/update-password', (req, res) => {
  const { userid, newpassword } = req.body; // Extract data from the request body

  // Create a User instance
  const user = new User(userid);

  // Call the updatePassword method 
  user
    .updatePassword(newpassword)
    .then(() => {
      res.redirect('/homepage'); // Redirect to homepage 
    })
    .catch((err) => {
      res.status(500).send(err); // Send error message 
    });
});


//add FAVOURITE COURSE
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






app.get('/homepage', (req, res) => {                     //go to homepage both login and signup
  res.sendFile(path.join(__dirname, 'homepage.html')); // Serve your homepage HTML
});


app.get('/gotologin', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));      //go to login page from main
});


app.get('/gotosignup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));      //go to signup page from main
});

app.get('/gotoeditprofile', (req, res) => {
  res.sendFile(path.join(__dirname, 'editprofile.html'));      //go to editprofile page from main
});

app.get('/gotofavourite', (req, res) => {
  res.sendFile(path.join(__dirname, 'favourite.html'));      //go to editprofile page from main
});


app.get('/gotofeedback', (req, res) => {                 //from homepage
  res.sendFile(path.join(__dirname, 'feedback.html'));      //go to feedback page from main
});

app.get('/gotoinquiry', (req, res) => {                 //from homepage
  res.sendFile(path.join(__dirname, 'inquiry.html'));      //go to inquiry page from main
});


// Handle Feedback Submission
app.post("/submit-feedback", (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required." });
  }

  const query = "INSERT INTO feedback (rating, comment, submitted_at) VALUES (?, ?, ?)";
  const values = [rating, comment || null, new Date()];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error saving feedback:", err);
      return res.status(500).json({ message: "Failed to submit feedback." });
    }

    res.status(200).json({ message: "Feedback submitted successfully!", id: result.insertId });
  });
});


