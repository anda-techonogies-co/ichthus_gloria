const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter member's name"],
        },
        phone: {
            type: String,
            required: [true, "Please enter member's phone"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: false,
            default: null,
            unique: true,
            lowercase: true,
            sparse: true,
            trim: true
        },
        password: {
            type: String,
            default: null,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('Member', memberSchema);
