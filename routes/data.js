const router = require('express').Router();
let Expense = require('../models/Expense');
let Budget = require('../models/Budget');
let User = require('../models/User');
const jwt = require('jsonwebtoken');

// Auth Middleware
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.id;
        console.log('User ID from token:', req.userId);
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).json({ message: 'Authentication failed!' });
    }
};

// Log a new expense
router.post('/expenses', auth, async (req, res) => {
    try {
        console.log('Received new expense request. User ID:', req.userId);
        console.log('Request body:', req.body);
        const newExpense = new Expense({
            userId: req.userId,
            amount: req.body.amount,
            category: req.body.category,
            paymentMethod: req.body.paymentMethod
        });
        await newExpense.save();
        res.status(201).json('Expense logged!');
    } catch (err) {
        console.error('Error saving new expense:', err);
        res.status(500).json('Error: ' + err);
    }
});

// Get all expenses for a user
router.get('/expenses', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.userId });
        res.json(expenses);
    } catch (err) {
        res.status(500).json('Error: ' + err);
    }
});

// Set or update a monthly budget
router.get('/budgets', auth, async (req, res) => {
    try {
        const budget = await Budget.findOne({ userId: req.userId });
        res.json(budget);
    } catch (err) {
        res.status(500).json('Error: ' + err);
    }
});

// Update user preferences and set onboarded to true
router.post('/preferences', auth, async (req, res) => {
    try {
        const { paymentMethods, expenseCategories, budgets } = req.body;
        const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

        // 1. Update user preferences
        const user = await User.findById(req.userId);
        user.paymentMethods = paymentMethods;
        user.expenseCategories = expenseCategories;
        user.onboarded = true;
        await user.save();

        // 2. Create or update the budget
        const budget = await Budget.findOneAndUpdate(
            { userId: req.userId, month: currentMonth },
            { categories: budgets },
            { new: true, upsert: true }
        );

        res.status(200).json('Preferences and budget saved successfully!');
    } catch (err) {
        console.error('Error saving preferences and budget:', err);
        res.status(500).json('Error: ' + err);
    }
});

module.exports = router;