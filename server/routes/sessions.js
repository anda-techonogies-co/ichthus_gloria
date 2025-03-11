
const express = require('express');
const router = express.Router();
const ChoirSession = require('../models/ChoirSession');

router.post('/choir-sessions', async (req, res) => {
    try {
        const { sessionDescription, member, memberAttended } = req.body;

        if (!member) {
            return res.status(400).json({ message: "Member ID is required." });
        }

        const newSession = new ChoirSession({
            sessionDescription,
            member,
            memberAttended
        });

        const savedSession = await newSession.save();
        res.status(201).json(savedSession);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/api/choir-sessions', async (req, res) => {
    try {
        const choirSessions = await ChoirSession.find().populate('member');
        res.status(200).json(choirSessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
