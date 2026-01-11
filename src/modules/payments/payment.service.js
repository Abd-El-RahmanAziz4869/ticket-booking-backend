const stripe = require('../../config/stripe');

const createPaymentIntent = async ({ amount, currency, idempotencyKey }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: ['card']
      },
      {
        idempotencyKey
      }
    );

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const confirmPayment = async (paymentIntentId) => {
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

  return intent.status === 'succeeded'
    ? { success: true, paymentId: intent.id }
    : { success: false };
};

module.exports = {
  createPaymentIntent,
  confirmPayment
};
