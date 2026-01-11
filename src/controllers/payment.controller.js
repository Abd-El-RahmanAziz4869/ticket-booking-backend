import { withTransaction } from "../utils/withTransaction.js";
import { confirmBooking } from "../services/booking-confirmation.service.js";

export async function payBooking(req, res) {
  const { bookingId, paymentToken } = req.body;

  try {
    const booking = await withTransaction(async (session) => {
      return confirmBooking({
        bookingId,
        paymentToken,
        session
      });
    });

    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
