const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS for all origins (adjust in production if needed)
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', routes);

// Health endpoints for smoke tests
app.get('/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'BloomHer backend running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});