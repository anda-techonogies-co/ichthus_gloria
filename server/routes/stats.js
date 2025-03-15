const express = require('express');
const router = express.Router();
const ChoirSession = require('../models/ChoirSession');
const Member = require('../models/Member');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {

        let { startDate, endDate, sessionType } = req.query;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const formatLocalDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        // Format dates using local timezone
        if (!startDate) startDate = formatLocalDate(firstDay);
        if (!endDate) endDate = formatLocalDate(lastDay);
        if (!sessionType) sessionType = 'rehearsal';


        const allMembers = {
            totalMembers: await Member.countDocuments({ isAdmin: false }),
            activeMembers: await Member.countDocuments({ active: true, isAdmin: false }),
            inactiveMembers: await Member.countDocuments({ active: false, isAdmin: false })
        };

        const sessions = await ChoirSession.find({
            sessionDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            sessionType: sessionType
          });

        if (!sessions.length) {
            return res.status(404).json({ message: "No data found for the given criteria" });
        }

        let totalAttended = 0;
        let totalAbsent = 0;

        sessions.forEach(session => {
            session.members.forEach(member => {
            if (member.hasAttended) {
                totalAttended++;
            } else {
                totalAbsent++;
            }
            });
        });

        const attendanceStats = [
            { name: "Attended", value: totalAttended },
            { name: "Absent", value: totalAbsent }
        ];

        res.json({ attendanceStats, allMembers });

    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;