require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const path = require("path");

const memberRoutes = require('./routes/members');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');


const port = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB Connected...'))
.catch((err) => console.error('Connection failed...', err));


app.use('/api/v1', authRoutes);
app.use('/api/v1', memberRoutes);
app.use('/api/v1', sessionRoutes);
app.use('/api/v1', statsRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

