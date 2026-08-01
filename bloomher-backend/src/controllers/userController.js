const UserService = require('../services/userService');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }
        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }
        const user = await UserService.createUser({ name, email, password });
        return res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (err) {
        console.error('registerUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }
        const user = await UserService.findByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        return res.status(200).json({ message: 'Login successful', userId: user._id, name: user.name });
    } catch (err) {
        console.error('loginUser error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserData = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'userId query parameter is required.' });
        }
        const user = await UserService.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(200).json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        console.error('getUserData error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserData
};
