const express = require('express');
const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://maxgmiller87:p7n2qVp7Ow0mlkeQ@cluster0.hl2zuwx.mongodb.net/shufflesDB?retryWrites=true&w=majority&appName=Cluster0";
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const mongoose = require('mongoose')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI; // store connection string in .env
const client = new MongoClient(uri)

/*
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
*/

let db, shufflesCollection;

/*
client.connect()
  .then(() => {
    const db = client.db('shufflesDB');
    const collection = db.collection('shuffles');
    console.log('Connected to MongoDB from backend!');
    // Start your app or define routes here
  })
  .catch(err => console.error('MongoDB connection error:', err));
*/


MongoClient.connect(uri)
  .then(client => {
    db = client.db('shufflesDB');
    shufflesCollection = db.collection('shuffles');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));


app.post('/api/shuffles', async (req, res) => {
    try {
        const newShuffle = req.body.shuffleData;
        await shufflesCollection.insertOne({ shuffle: newShuffle, createdAt: new Date() });
        const allShuffles = await shufflesCollection.find().toArray();
        res.json({ history: allShuffles.map(s => s.shuffle ) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to save shuffle')
    }

/* // getting shuffle history?
app.get('/api/shuffles', async (req, res) => {
        try {
            const allShuffles = await shufflesCollection.find().toArray();
            res.json(allShuffles.map(s => s.shuffle));
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to fetch shuffle history')
        }
            //res.json(loadShuffles());
    });
*/

// getting shuffle count
app.get('/api/shuffles/count', async (req, res) => {
    try {
      const count = await shufflesCollection.countDocuments();
      res.json({ count });
    } catch (error) {
      console.error('Error counting documents:', error);
      res.status(500).json({ error: 'Failed to count documents' });
    }
  });
  

/*
    let shuffles = loadShuffles();
    shuffles.push(newShuffle);
    saveShuffles(shuffles);
    res.json(shuffles);
*/
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
