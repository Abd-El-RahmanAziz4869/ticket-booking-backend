const mongoose = require('mongoose');
const Seat = require('../seats/seat.model');
const Reservation = require('./reservation.model');
const { RESERVATION_TTL_MINUTES } = require('./reservation.constants');

const createReservation = async ({ userId, eventId, seatIds }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const seats = await Seat.find({
      _id: { $in: seatIds },
      eventId,
      status: 'AVAILABLE'
    }).session(session);

    if (seats.length !== seatIds.length) {
      throw new Error('One or more seats are not available');
    }

    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { status: 'RESERVED' },
      { session }
    );

    const expiresAt = new Date(
      Date.now() + RESERVATION_TTL_MINUTES * 60 * 1000
    );

    const reservation = await Reservation.create([{
      userId,
      eventId,
      seatIds,
      expiresAt
    }], { session });

    await session.commitTransaction();
    return reservation[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = { createReservation };
