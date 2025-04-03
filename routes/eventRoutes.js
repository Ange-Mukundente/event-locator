// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Create event (only accessible to logged-in users)
 router.post('/', authMiddleware.authenticate, eventController.createEvent);
 router.get('/', authMiddleware.authenticate, eventController.getEvents);

// Update event (only accessible to logged-in users and the event creator)
router.put('/:eventId', authMiddleware.authenticate, eventController.updateEvent);

// Delete event (only accessible to logged-in users and the event creator)
router.delete('/:eventId', authMiddleware.authenticate, eventController.deleteEvent);

module.exports = router;
