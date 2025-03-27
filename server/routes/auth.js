const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        const existingMember = await Member.findOne({ email });
        if (existingMember) return res.status(409).json({ message: "Member already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMemeber = new Member({ name, email, password: hashedPassword, isAdmin });
        await newMemeber.save();

        res.status(201).json({ message: "Member registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Member.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        res.json({ token });
    } catch (error) {
        console.log('login error', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token'); // If using cookies
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
