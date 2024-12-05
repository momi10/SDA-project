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




