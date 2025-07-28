const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());  // parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // parse URL-encoded bodies
app.use(express.static('public'));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    app.post('/submit', async (req, res) => {
      try {
        const db = client.db("ai_thesis");
        const collection = db.collection("survey_responses");
        await collection.insertOne(req.body);
        res.send("Survey submitted successfully!");
      } catch (err) {
        console.error(err);
        res.status(500).send("Submission failed");
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

startServer();
