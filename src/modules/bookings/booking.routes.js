const express = require('express');
const controller = require('./booking.controller');
const { authenticate } = require('../auth/auth.middleware');
const validate = require('../../common/middleware/validate');
const {
  createBookingSchema
} = require('./booking.validation');

const router = express.Router();

router.post(
  '/',
  authenticate,
  validate(createBookingSchema),
  controller.createBooking
);

module.exports = router;

