const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  seatIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat'
  }],
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
