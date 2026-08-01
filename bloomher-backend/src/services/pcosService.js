const { PCOSData } = require('../models');

class PCOSService {
    static async createPCOSData(data) {
        const pcos = new PCOSData(data);
        return await pcos.save();
    }

    static async getPCOSByUser(userId) {
        return await PCOSData.find({ userId });
    }
}

module.exports = PCOSService;
