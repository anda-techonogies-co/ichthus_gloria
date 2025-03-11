const mongoose = require('mongoose');

const choirSession = mongoose.Schema(
    {

        sessionDescription: {
            type: String,
            default: null
        },
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true, 
        },
        memberAttended: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true }
)

module.exports = mongoose.model('ChoirSession', choirSession);
