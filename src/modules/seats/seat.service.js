const Seat = require('./seat.model');

const getSeatsByEvent = async (eventId) => {
  return Seat.find({ eventId }).sort({ seatNumber: 1 });
};

module.exports = { getSeatsByEvent };
