import { withTransaction } from "../utils/withTransaction.js";
import { holdSeats } from "../services/seat.service.js";
import { createPendingBooking } from "../services/booking.service.js";

export async function reserveSeats(req, res) {
  const { eventId, seatIds } = req.body;
  const userId = req.user.id;

  try {
    const booking = await withTransaction(async (session) => {
      await holdSeats({
        eventId,
        seatIds,
        userId,
        session
      });

      const [booking] = await createPendingBooking({
        userId,
        eventId,
        seatIds,
        totalPrice: seatIds.length * 100,
        session
      });

      return booking;
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}
