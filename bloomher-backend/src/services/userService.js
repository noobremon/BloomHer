const { User } = require('../models');

class UserService {
    static async createUser(data) {
        const user = new User(data);
        return await user.save();
    }

    static async findByEmail(email) {
        return await User.findOne({ email });
    }

    static async findById(id) {
        return await User.findById(id);
    }
}

module.exports = UserService;
