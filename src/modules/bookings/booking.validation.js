const { z } = require('zod');

const createBookingSchema = z.object({
  reservationId: z.string(),
  paymentIntentId: z.string()
});

module.exports = {
  createBookingSchema
};
