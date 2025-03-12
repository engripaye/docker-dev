const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORT = 3000;
const uri = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const client = new MongoClient(uri);

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/get-profile', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('yourDatabase'); // Replace with your DB name
        const collection = db.collection('profiles'); // Replace with your collection name

        const profile = await collection.findOne({ username: req.query.username }); // Fetch profile based on query parameter

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.post('/update-profile', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('yourDatabase'); // Replace with your DB name
        const collection = db.collection('profiles'); // Replace with your collection name

        const { userId, updates } = req.body; // Expecting userId and updates object in request body

        if (!userId || !updates) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(userId) }, // Update by userId
            { $set: updates } // Apply updates
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/get-profilePicture', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('yourDatabase'); // Replace with your DB name
        const collection = db.collection('profiles'); // Replace with your collection name

        const { userId } = req.query; // Get userId from query parameters

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await collection.findOne({ _id: new ObjectId(userId) });

        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }

        res.json({ profilePicture: user.profilePicture }); // Assuming it's a URL or base64 string
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
