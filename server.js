// filepath: backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const usersRouter = require('./routes/users');
const trackerRouter = require('./routes/tracker');
const dietRouter = require('./routes/diet');
const exercisesRouter = require('./routes/exercises');
const sleepRouter = require('./routes/sleep');
const stressRouter = require('./routes/stress');
const expertRouter = require('./routes/expert');
const communityRouter = require('./routes/community');

app.use('/users', usersRouter);
app.use('/tracker', trackerRouter);
app.use('/diet', dietRouter);
app.use('/exercises', exercisesRouter);
app.use('/sleep', sleepRouter);
app.use('/stress', stressRouter);
app.use('/expert', expertRouter);
app.use('/community', communityRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// filepath: backend/routes/users.js
const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const newUser = new User({ username });

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

// filepath: backend/models/user.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;

// filepath: backend/routes/tracker.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Tracker route');
});

module.exports = router;

// filepath: backend/routes/diet.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Diet route');
});

module.exports = router;

// filepath: backend/routes/exercises.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Exercises route');
});

module.exports = router;

// filepath: backend/routes/sleep.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Sleep route');
});

module.exports = router;

// filepath: backend/routes/stress.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Stress route');
});

module.exports = router;

// filepath: backend/routes/expert.js
const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Expert route');
});

module.exports = router;

const router = require('express').Router();

router.route('/').get((req, res) => {
    res.json('Community route');
});

module.exports = router;