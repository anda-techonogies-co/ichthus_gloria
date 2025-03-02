const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter memmber name'],
        },
        phone: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            default: null,
        },
        rehearsal_date: {
            type: Date,
            default: null,
        },
        attended: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true }
)

module.exports = mongoose.model('Member', memberSchema);
