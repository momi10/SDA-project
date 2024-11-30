const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static("D:/SDA project"));


const uri = "mongodb+srv://mohaiman:atlas12345@cluster0.5qidl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let db;
client.connect()
  .then(() => {
    db = client.db("feedback"); 
    console.log("Connected to MongoDB!");
  })
  .catch(err => console.error("Error connecting to MongoDB:", err));


app.get("/", (req, res) => {
  res.sendFile(path.join("D:/SDA project", "feedback.html"));
});


app.post("/submit-feedback", async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required." });
  }

  try {
    const collection = db.collection("mohaiman"); 
    const feedback = { rating, comment, submittedAt: new Date() };

    
    const result = await collection.insertOne(feedback);

    res.status(200).json({ message: "Feedback submitted successfully!", id: result.insertedId });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
