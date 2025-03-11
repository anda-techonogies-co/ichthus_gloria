const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter member name'],
        },
        phone: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
            unique: true
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
