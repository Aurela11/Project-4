const express = require('express');
const router = express.Router();
const eventController = require('../controllers/events');

router.post('/reserve', eventController.reserve);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventDetails);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
