
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const ChoirSession = require('../models/ChoirSession');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');


router.post('/choir-sessions', authMiddleware, adminMiddleware, async (req, res) => {

    try {

        const { sessionType, members, sessionDate } = req.body.data;

        if(members?.length === 0) {
            return res.status(400).json({message: 'Members are required!'})
        }
        const newSession = new ChoirSession({
          sessionType,
          members,
          sessionDate
        });

        await newSession.save();
        res.status(201).json({message: 'Success'});
      } catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
      }

});


router.get('/choir-sessions', authMiddleware, adminMiddleware, async (req, res) => {

    try {
        const choirSessions = await ChoirSession.find()
        .populate('members.member', 'name phone')
        .sort({ sessionDate: -1 })
        .limit(1);

        res.status(200).json(choirSessions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch('/choir-sessions/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
      const { memberId, hasAttended, sessionDate, sessionType } = req.body.data;
      const sessionId = req.params.id;

      const session = await ChoirSession.findById(sessionId);
      if (!session) {
          return res.status(404).json({ message: 'Session not found' });
      }

      const memberObjectId = memberId ? mongoose.Types.ObjectId.createFromHexString(memberId) : '';

      const memberIndex = session.members.findIndex(m => m.member.toString() === memberObjectId.toString());

      if (memberIndex !== -1) {
          session.members[memberIndex].hasAttended =  hasAttended;
          await session.save();
      }else if(sessionType && sessionDate){
        session.sessionType = sessionType ? sessionType : session.sessionType;
        session.sessionDate = sessionDate ? sessionDate : session.sessionDate;
        await session.save();
      }
      return res.json({ message: 'Success' });
  } catch (error) {
      res.status(500).json({ message: 'Error updating attendance', error: error.message });
  }
});


module.exports = router;
