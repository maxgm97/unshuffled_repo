const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
//commenting to update commit
const mongoose = require('mongoose')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const uri = process.env.MONGO_URI; // store connection string in .env
//const client = new MongoClient(uri)

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

async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect()
    db = client.db('shufflesDB');
    shufflesCollection = db.collection('shuffles');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  // .then(client => {
  }
}

// Middleware to ensure collection is ready
function requireDB(req, res, next) {
  if (!shufflesCollection) {
    return res
      .status(503)
      .json({ error: 'Database not ready, please try again in a few seconds.' });
  }
  next();
}
    
    
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`)
//     })
//   })
//   .catch(err => console.error('MongoDB connection error:', err));
// }

app.post('/api/shuffles', requireDB, async (req, res) => {
  try {
    const { shuffle, email } = req.body;

    if (!Array.isArray(shuffle) || shuffle.length !== 52) {
      return res.status(400).json({ error: 'Invalid shuffle array' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Username is required' });
    }

    await shufflesCollection.insertOne({
      shuffle,
      email,
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error saving shuffle:', err);
    res.status(500).send('Failed to save shuffle');
  }
});
    //     const { shuffle, email } = req.body;
    //     if (!email) {
    //         return res.status(400).json({ error: 'Username is required in case of duplicate shuffle'});
    //     }
    //     await shufflesCollection.insertOne({ 
    //         shuffle, 
    //         email,
    //         createdAt: new Date() 
    //     });
    //     const allShuffles = await shufflesCollection.find().toArray();
    //     res.json({ history: allShuffles.map(s => s.shuffle ) });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Failed to save shuffle')
    // }

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
app.get('/api/shuffles/count', requireDB, async (req, res) => {
    try {
      const count = await shufflesCollection.countDocuments();
      res.json({ count });
    } catch (err) {
      console.error('Error counting documents:', err);
      res.status(500).json({ error: 'Failed to count documents' });
    }
  });
  

/*
    let shuffles = loadShuffles();
    shuffles.push(newShuffle);
    saveShuffles(shuffles);
    res.json(shuffles);
*/
// });

// Connect to Mongo and then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
