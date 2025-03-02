const express = require('express');
const mongoose = require('mongoose');
const Member = require('./models/member');

const app = express();

app.listen(5000, ()=> console.log('App listening on port 5000'));

app.get('/', (req, res)=> res.send('Hello World!'))
app.get('/api/members', async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members); // Send as JSON response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

mongoose.connect('mongodb+srv://rwibutsomo:s2qeSadSNLQ8Twvh@cluster0.j41ak.mongodb.net/choir_db?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> {
    console.log('DB Connected...')
})
.catch(()=> console.log('Connection failed...'))