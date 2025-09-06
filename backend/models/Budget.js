const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    month: {
        type: String, // e.g., "2025-09"
        required: true
    },
    categories: {
        type: Map, // Stores a key-value pair of category: budget amount
        of: Number,
        required: true
    }
}, {
    timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;