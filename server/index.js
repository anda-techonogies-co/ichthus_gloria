require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const memberRoutes = require('./routes/members');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const authRoutes = require('./routes/auth');
const cors = require('cors');



const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.listen(5000, ()=> console.log('App listening on port 5000'));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB Connected...'))
.catch((err) => console.error('Connection failed...', err));


app.get('/', (req, res)=> res.send('Hello World!'))

app.use('/api', authRoutes);
app.use('/api', memberRoutes);
app.use('/api', sessionRoutes);
app.use('/api', statsRoutes);

