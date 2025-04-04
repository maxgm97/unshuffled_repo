const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const mongoose = require('mongoose')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI; // store connection string in .env

/*
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));
*/

let db, shufflesCollection;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(client => {
    db = client.db('shufflesDB');
    shufflesCollection = db.collection('shuffles');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));


app.get('/api/shuffles', async (req, res) => {
    try {
        const allShuffles = await shufflesCollection.find().toArray();
        res.json(allShuffles.map(entry => entry.shuffle));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shuffle history' })
    }
        //res.json(loadShuffles());
});

app.post('/api/shuffles', async (req, res) => {
    const newShuffle = req.body.shuffleData;
    try {
        await shufflesCollection.insertOne({ shuffleData: newShuffle, timestamp: new Date() });
        const allShuffles = await shufflesCollection.find().toArray();
        res.json({ history: allShuffles.map(entry => entry.shuffleData ) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save shuffle' })
    }
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
