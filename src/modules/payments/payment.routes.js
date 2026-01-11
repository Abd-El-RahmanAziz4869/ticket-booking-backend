const express = require('express');
const controller = require('./payment.controller');
const { authenticate } = require('../auth/auth.middleware');

const router = express.Router();

router.post(
  '/intent',
  authenticate,
  controller.createIntent
);

module.exports = router;
