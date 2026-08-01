const CycleService = require('../services/cycleService');

const trackMenstrualCycle = async (req, res) => {
    try {
        const { userId, startDate, endDate, symptoms, notes } = req.body;
        if (!userId || !startDate || !endDate) {
            return res.status(400).json({ error: 'userId, startDate, and endDate are required.' });
        }
        const cycle = await CycleService.createCycle({ userId, startDate, endDate, symptoms, notes });
        return res.status(201).json({ message: 'Menstrual cycle tracked successfully', cycleId: cycle._id });
    } catch (err) {
        console.error('trackMenstrualCycle error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    trackMenstrualCycle
};
