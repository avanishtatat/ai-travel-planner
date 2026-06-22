const express = require("express");
const cors = require("cors"); 

require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const tripRoutes = require('./routes/tripRoutes');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json());

app.get('/', (req, res) => {
    res.send('VoyageMind API is running');
})

// app.use('/api/auth', authRoutes);
// app.use('/api/trips', tripRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false,message: 'Internal Server Error' });
});

module.exports = app;