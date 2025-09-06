const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;
const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');

// Manually set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
    res.sendStatus(200);
});

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter); // This line is crucial

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});