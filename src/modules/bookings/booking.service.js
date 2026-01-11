const mongoose = require('mongoose');
const Seat = require('../seats/seat.model');
const Reservation = require('../reservations/reservation.model');
const Booking = require('./booking.model');
const paymentService = require('../payments/payment.service');
const AppError = require('../../common/errors/AppError');

const confirmReservation = async ({
  userId,
  reservationId,
  paymentIntentId
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservation = await Reservation
      .findById(reservationId)
      .session(session);

    if (!reservation) {
      throw new AppError('Reservation not found or expired', 404);
    }

    if (reservation.userId.toString() !== userId) {
      throw new AppError('Unauthorized reservation access', 403);
    }

    const seats = await Seat.find({
      _id: { $in: reservation.seatIds },
      status: 'RESERVED'
    }).session(session);

    if (seats.length !== reservation.seatIds.length) {
      throw new AppError(
        'One or more seats are no longer reserved',
        409
      );
    }

    const paymentResult =
      await paymentService.confirmPayment(paymentIntentId);

    if (!paymentResult.success) {
      throw new AppError('Payment failed', 402);
    }

    await Seat.updateMany(
      { _id: { $in: reservation.seatIds } },
      { status: 'BOOKED' },
      { session }
    );

    const booking = await Booking.create([{
      userId,
      eventId: reservation.eventId,
      seatIds: reservation.seatIds,
      paymentId: paymentResult.paymentId,
      status: 'CONFIRMED'
    }], { session });

    await Reservation.deleteOne(
      { _id: reservationId },
      { session }
    );

    await session.commitTransaction();
    return booking[0];

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = {
  confirmReservation
};
