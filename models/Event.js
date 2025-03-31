const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Prevents duplicate events
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
        type: { type: String, enum: ['Point'], required: true, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Ensure geospatial indexing
eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('Event', eventSchema);
