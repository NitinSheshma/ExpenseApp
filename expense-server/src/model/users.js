const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    role: { type: String, required: true, default: 'admin' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    // Default to 1 to give free trail of creating 1 group
    credits: { type: Number, default: 1 },
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false }
});

module.exports = mongoose.model('User', userSchema);