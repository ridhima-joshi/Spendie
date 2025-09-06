const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../models/User');

// User Registration
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (user) return res.status(400).json('User already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword, onboarded: false });
        await newUser.save();
        res.status(201).json('User registered successfully');
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json('Error: ' + err);
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json('Invalid credentials');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json('Invalid credentials');

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                onboarded: user.onboarded // Return the onboarded status
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json('Error: ' + err);
    }
});

module.exports = router;