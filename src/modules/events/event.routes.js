const express = require('express');
const controller = require('./event.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  controller.createEvent
);

router.get('/', controller.listEvents);

module.exports = router;
