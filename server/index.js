
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, './.env') });

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const memberRoutes = require('./routes/members');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('DB Connected...'))
.catch((err) => console.error('Connection failed...', err));

const port = process.env.PORT || 5000;


app.use('/api/v1', authRoutes);
app.use('/api/v1', memberRoutes);
app.use('/api/v1', sessionRoutes);
app.use('/api/v1', statsRoutes);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

