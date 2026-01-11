const bookingService = require('./booking.service');
const catchAsync = require('../../common/utils/catchAsync');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.confirmReservation({
    userId: req.user.userId,
    reservationId: req.body.reservationId,
    paymentIntentId: req.body.paymentIntentId
  });

  res.status(201).json({
    bookingId: booking._id,
    status: booking.status
  });
});

module.exports = {
  createBooking
};
