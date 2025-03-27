const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] },
    date: Date,
    category: String
});

module.exports = mongoose.model('Event', EventSchema);
