const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
})

// userSchema.virtual('events', {
//     ref: 'Event',
//     localField: '_id',
//     foreignField: 'creator'
// })

module.exports = model('User', userSchema)
