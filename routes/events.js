const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");


router.get('/events', eventsController.getAllEvents);
router.get('/events/:id', eventsController.getSingleEvent);
router.post('/events', eventsController.createEvent);
router.put('/events/:id', eventsController.updateEvent);
router.delete('/events/:id', eventsController.deleteEvent);

module.exports = router;