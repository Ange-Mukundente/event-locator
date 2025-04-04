const Event = require("../models/Event");
const { sendEmail } = require("../services/notificationService");  // Named import
const i18n = require("i18n");


/**
 * @desc    Create a new event with real-time notification
 * @route   POST /api/events
 * @access  Private (Only logged-in users)
 */
exports.createEvent = async (req, res) => {
  const { title, description, date, location, category } = req.body;

  // Validate required fields
  if (!title || !description || !date || !location || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Ensure title is not null or empty
  if (!title.trim()) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  try {
    const existingEvent = await Event.findOne({ title, date });
    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists" });
    }

    // Create the new event with the reference to the logged-in user
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      createdBy: req.user._id, // Set the creator of the event (using createdBy)
    });

    const savedEvent = await newEvent.save();

    // Optionally populate the createdBy field to get user data in the response
    await savedEvent.populate('createdBy');  // Populate the createdBy field

    // Send email notification to the event creator (or other users)
    const userEmail = req.user.email; // Assuming you have an email in the user object
    // const emailSubject = `Event Created:${i18n.__('event_created')} ${savedEvent.title}`;
    const emailSubject = `Event Created: ${i18n.__("event_created")} ${savedEvent.title}`;

    const emailText = `Your event "${savedEvent.title}" has been successfully created. 
    Details: 
    - Date: ${savedEvent.date}
    - Location: ${savedEvent.location}
    - Category: ${savedEvent.category}
    `;
    await sendEmail(userEmail, emailSubject, emailText);  // Send email

    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event", error: error.message });
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

    if (category) query.category = category;
    if (lat && long) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(long), parseFloat(lat)] },
          $maxDistance: 50000,
        },
      };
    }

    const events = await Event.find(query);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error: error.message });
  }
};

/**
 * @desc    Update an event with real-time notification
 * @route   PUT /api/events/:eventId
 * @access  Private (Only event creator)
 */
exports.updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    const duplicateEvent = await Event.findOne({ title, date });
    if (duplicateEvent && duplicateEvent._id.toString() !== eventId) {
      return res.status(400).json({ message: "Another event with the same title and date already exists" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    const updatedEvent = await event.save();

    // Send email notification for event update
    const userEmail = req.user.email;
    const emailSubject = `Event Updated: ${updatedEvent.title}`;
    const emailText = `Your event "${updatedEvent.title}" has been updated. 
    Details: 
    - Date: ${updatedEvent.date}
    - Location: ${updatedEvent.location}
    - Category: ${updatedEvent.category}
    `;
    await sendEmail(userEmail, emailSubject, emailText);  // Send email

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

/**
 * @desc    Delete an event with real-time notification
 * @route   DELETE /api/events/:eventId
 * @access  Private (Only event creator)
 */
exports.deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();

    // Send email notification for event deletion
    const userEmail = req.user.email;
    const emailSubject = `Event Deleted: ${event.title}`;
    const emailText = `Your event "${event.title}" has been deleted. 
    We hope to see you at our future events.`;
    await sendEmail(userEmail, emailSubject, emailText);  // Send email

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};
