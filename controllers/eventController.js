const Event = require('../models/Event');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Only logged-in users)
 */
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    // Check if an event with the same title and date already exists
    const existingEvent = await Event.findOne({ title, date });

    if (existingEvent) {
      return res.status(400).json({ message: 'Event already exists' });
    }

    // Create a new event and associate it with the logged-in user
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      user: req.user._id, // Ensures only logged-in users can create events
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

/**
 * @desc    Get all events (Supports filtering by category and location)
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res) => {
  try {
    const { category, lat, long } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by location if latitude and longitude are provided
    if (lat && long) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(long), parseFloat(lat)] },
          $maxDistance: 50000, // Search within 50km radius
        },
      };
    }

    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving events', error: error.message });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:eventId
 * @access  Private (Only event creator)
 */
exports.updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const eventId = req.params.eventId;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure that the logged-in user is the creator of the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Prevent duplicate event updates
    const duplicateEvent = await Event.findOne({ title, date });
    if (duplicateEvent && duplicateEvent._id.toString() !== eventId) {
      return res.status(400).json({ message: 'Another event with the same title and date already exists' });
    }

    // Update the event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:eventId
 * @access  Private (Only event creator)
 */
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    // Find the event by ID
    const event = await Event.findById(eventId);

    // Check if the event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure that the logged-in user is the creator of the event
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete the event
    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};
