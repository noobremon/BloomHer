const { MenstrualCycle } = require('../models');

class CycleService {
    static async createCycle(data) {
        const cycle = new MenstrualCycle(data);
        return await cycle.save();
    }

    static async getCyclesByUser(userId) {
        return await MenstrualCycle.find({ userId }).sort({ startDate: -1 });
    }
}

module.exports = CycleService;
