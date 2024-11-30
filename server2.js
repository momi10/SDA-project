const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images, HTML) from your project directory
app.use(express.static("D:/SDA project")); // Update to your project directory

// MongoDB Configuration
const uri = "mongodb+srv://mohaiman:atlas12345@cluster0.5qidl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db;
client.connect()
  .then(() => {
    db = client.db("inquery"); // Database name: "inquiryDatabase"
    console.log("Connected to MongoDB!");
  })
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Route to serve the inquiry form
app.get("/", (req, res) => {
  res.sendFile(path.join("D:/SDA project", "inquiry.html")); // Ensure this path matches your actual file location
});

// API Endpoint for Inquiry Submission
app.post("/submit-inquiry", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate the incoming data
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const collection = db.collection("inqueries"); // Collection name: "inquiries"
    const inquiry = { name, email, message, submittedAt: new Date() };

    // Insert the inquiry into the database
    const result = await collection.insertOne(inquiry);

    res.status(200).json({ message: "Inquiry submitted successfully!", id: result.insertedId });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ message: "Failed to submit inquiry." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
