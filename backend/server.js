const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const sweetsRouter = require('./routes/sweets');
const authRouter = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sweets', sweetsRouter);
app.use('/api/auth', authRouter);

// Database Connection
// Check if we are in "Test Mode" to avoid conflicts
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.error(err));
        
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
    // In test mode, we might connect to a specific test DB here
    mongoose.connect(process.env.MONGO_URI);
}

module.exports = app; // CRITICAL FOR TDD