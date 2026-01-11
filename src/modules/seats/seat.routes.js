const express = require('express');
const controller = require('./seat.controller');

const router = express.Router();

router.get('/events/:id/seats', controller.getSeatsByEvent);

module.exports = router;
