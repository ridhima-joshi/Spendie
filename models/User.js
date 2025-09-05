const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { /* ... */ },
    password: { /* ... */ },
    paymentMethods: [String],
    expenseCategories: [String],
    onboarded: {
        type: Boolean,
        default: false // New users are not onboarded by default
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;