const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const validation = require('../middleware/validate');
const { isAuthenticated } = require("../middleware/authenticate");


router.get('/', eventsController.getAllEvents);
router.get('/:id', eventsController.getSingleEvent);
router.post('/', eventsController.createEvent);
router.put('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;