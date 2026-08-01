const PCOSService = require('../services/pcosService');

const managePCOS = async (req, res) => {
    try {
        const { userId, diagnosisDate, symptoms, treatment } = req.body;
        if (!userId || !diagnosisDate) {
            return res.status(400).json({ error: 'userId and diagnosisDate are required.' });
        }
        const pcos = await PCOSService.createPCOSData({ userId, diagnosisDate, symptoms, treatment });
        return res.status(201).json({ message: 'PCOS data logged successfully', pcosId: pcos._id });
    } catch (err) {
        console.error('managePCOS error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    managePCOS
};
