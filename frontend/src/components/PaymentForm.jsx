import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { Loader, AlertCircle } from 'lucide-react';

const PaymentForm = ({ bookingId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment method
      const { error: createError, paymentMethod: pm } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });

      if (createError) {
        setError(createError.message);
        setLoading(false);
        return;
      }

      // Call backend to confirm payment
      const response = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethodId: pm.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Payment failed');
        setLoading(false);
        onError?.(data.message || 'Payment failed');
        return;
      }

      // Handle 3D Secure if needed
      if (data.data.requiresAction) {
        const { error: confirmError } = await stripe.handleCardAction(
          data.data.clientSecret
        );

        if (confirmError) {
          setError(confirmError.message);
          setLoading(false);
          onError?.(confirmError.message);
          return;
        }
      }

      onSuccess?.(data.data);
    } catch (err) {
      console.error('[PaymentForm] Error:', err);
      setError('An error occurred. Please try again.');
      onError?.('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block font-semibold text-dark mb-4">Payment Method</label>
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-5 h-5"
            />
            <span className="ml-3 font-medium text-dark">Credit/Debit Card</span>
          </label>
        </div>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Card Number
            </label>
            <div className="p-4 border border-gray-300 rounded-lg">
              <CardNumberElement options={cardElementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Expiry Date
              </label>
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                CVC
              </label>
              <div className="p-4 border border-gray-300 rounded-lg">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Amount Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount to Pay</span>
          <span className="text-2xl font-bold text-primary">
            ${amount.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Your payment is secure and encrypted with SSL technology.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader className="animate-spin" size={20} /> : null}
        {loading ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By completing this purchase, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

export default PaymentForm;
