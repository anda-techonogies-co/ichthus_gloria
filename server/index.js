
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const path = require("path");

const memberRoutes = require('./routes/members');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');

require('dotenv').config({ path: path.join(__dirname, '../.env') });


const port = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: 'https://choir-attendance-tracker.onrender.com',
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


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

