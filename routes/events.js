const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");


router.get('/', eventsController.getAllEvents);
router.get('/:id', eventsController.getSingleEvent);
router.post('/', isAuthenticated, validation.saveEvent, eventsController.createEvent);
router.put('/:id', isAuthenticated, validation.saveEvent, eventsController.updateEvent);
router.delete('/:id', isAuthenticated, eventsController.deleteEvent);

module.exports = router;