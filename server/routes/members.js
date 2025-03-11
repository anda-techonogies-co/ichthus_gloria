const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');


// Create a new choir member
router.post('/members', authMiddleware, adminMiddleware,  async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Member name is required." });
        }

        const newMember = new Member({
            name,
            phone,
            email
        });

        const savedMember = await newMember.save();

        res.status(201).json(savedMember);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/members/bulk-insert', async (req, res) => {
    try {
       const members = req.body.members;
        await Member.insertMany(members);
      res.status(201).json({ message: 'Members added successfully'});
    } catch (error) {
      res.status(500).json({ message: 'Error saving members', error: error.message });
    }
});


// Get members
router.get('/members', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
