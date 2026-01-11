const paymentService = require('./payment.service');

const createIntent = async (req, res) => {
  const { amount, reservationId } = req.body;

  const result = await paymentService.createPaymentIntent({
    amount,
    currency: 'usd',
    idempotencyKey: `${req.user.userId}-${reservationId}`
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
};

module.exports = { createIntent };
