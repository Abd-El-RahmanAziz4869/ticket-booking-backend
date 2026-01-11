const express = require('express');
const controller = require('./reservation.controller');
const { authenticate } = require('../auth/auth.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  controller.createReservation
);

module.exports = router;
