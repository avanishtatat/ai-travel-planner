const User = require('../models/User');
const generateToken = require('../utils/generateToken.js');

const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = generateToken(newUser._id);
        return res.status(201).json({ success: true, token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        return res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser };