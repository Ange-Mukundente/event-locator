// controllers/eventController.js
const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  try {
    // Check if an event with the same title and date already exists
    const existingEvent = await Event.findOne({ title, date });

    if (existingEvent) {
      return res.status(400).json({ message: 'Event already exists' });
    }

    // Create a new event
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      user: req.user._id,  // Associate the event with the logged-in user
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

// Update an event
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

    // Update the event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

// Delete an event
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
    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
