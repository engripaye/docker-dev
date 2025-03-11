const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle user profile data (optional API endpoint)
app.post('/update-profile', (req, res) => {
    const { name, email, bio } = req.body;
    console.log('User Profile Updated:', { name, email, bio });
    res.json({ message: 'Profile updated successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
