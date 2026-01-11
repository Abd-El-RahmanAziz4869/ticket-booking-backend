const reservationService = require('./reservation.service');

const createReservation = async (req, res) => {
  const reservation = await reservationService.createReservation({
    userId: req.user.userId,
    ...req.body
  });

  res.status(201).json(reservation);
};

module.exports = { createReservation };
