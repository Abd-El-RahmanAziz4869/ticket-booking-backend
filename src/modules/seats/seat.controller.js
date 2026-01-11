const seatService = require('./seat.service');

const getSeatsByEvent = async (req, res) => {
  const seats = await seatService.getSeatsByEvent(req.params.id);
  res.json(seats);
};

module.exports = { getSeatsByEvent };
