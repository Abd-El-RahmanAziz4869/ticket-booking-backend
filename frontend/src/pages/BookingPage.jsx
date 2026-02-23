import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, seatsAPI, bookingsAPI, paymentsAPI } from '../services/api';
import { useBookingStore } from '../store/bookingStore';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setEvent, setSelectedSeats, setCustomerInfo, currentBooking } = useBookingStore();

  const [event, setEventData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeatsState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('select-seats'); // 'select-seats' or 'payment'
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    const fetchEventAndSeats = async () => {
      try {
        setLoading(true);
        const [eventRes, seatsRes] = await Promise.all([
          eventsAPI.getById(eventId),
          seatsAPI.getAll(eventId),
        ]);

        const eventData = eventRes.data.data || eventRes.data;
        setEventData(eventData);
        setEvent(eventData);

        const seatsData = seatsRes.data.data || seatsRes.data;
        setSeats(Array.isArray(seatsData) ? seatsData : []);
      } catch (err) {
        console.error('[BookingPage] Error:', err);
        setError('Failed to load event or seats. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndSeats();
  }, [eventId, setEvent]);

  const handleSeatToggle = (seatId) => {
    setSelectedSeatsState((prev) => {
      const isSelected = prev.includes(seatId);
      if (isSelected) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    setSelectedSeats(selectedSeats);
    setCustomerInfo(user?.email || '', user?.fullName || '');
    setStep('payment');
    setError('');
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setError('');

    try {
      // Create booking
      const bookingRes = await bookingsAPI.create({
        eventId,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * event.ticketPrice,
        customerEmail: user?.email,
        customerName: user?.fullName,
      });

      const bookingId = bookingRes.data.data._id;

      // Process payment
      await paymentsAPI.initiate({
        bookingId,
        amount: selectedSeats.length * event.ticketPrice,
        paymentMethod,
      });

      // Redirect to confirmation
      navigate(`/booking-confirmation/${bookingId}`);
    } catch (err) {
      console.error('[BookingPage] Booking error:', err);
      setError(
        err.response?.data?.message || 'Failed to complete booking. Please try again.'
      );
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && step === 'select-seats') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSeatAvailable = (seat) => seat.status === 'available';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:text-blue-700 mb-8 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Event
      </button>

      <h1 className="text-3xl font-bold text-dark mb-8">Book Tickets for {event?.name}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Selection */}
        <div className="lg:col-span-2">
          {step === 'select-seats' ? (
            <div className="card">
              <h2 className="text-2xl font-bold text-dark mb-6">Select Your Seats</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Seat Legend */}
              <div className="mb-8 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-500 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                  <span>Selected</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="bg-gray-50 p-8 rounded-lg">
                {seats.length > 0 ? (
                  <div className="grid grid-cols-10 gap-2">
                    {seats.map((seat) => (
                      <button
                        key={seat._id}
                        onClick={() => {
                          if (isSeatAvailable(seat)) {
                            handleSeatToggle(seat._id);
                          }
                        }}
                        disabled={!isSeatAvailable(seat)}
                        className={`p-3 rounded text-sm font-semibold transition-all ${
                          selectedSeats.includes(seat._id)
                            ? 'bg-primary text-white'
                            : isSeatAvailable(seat)
                            ? 'bg-gray-300 hover:bg-gray-400 text-dark'
                            : 'bg-red-500 text-white cursor-not-allowed opacity-50'
                        }`}
                        title={seat.seatNumber}
                      >
                        {seat.seatNumber}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No seats available</p>
                )}
              </div>

              {/* Legend Info */}
              <p className="text-sm text-gray-600 mt-6 text-center">
                Screen at the front
              </p>
            </div>
          ) : (
            /* Payment Step */
            <div className="card">
              <h2 className="text-2xl font-bold text-dark mb-6">Complete Payment</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="font-semibold text-dark mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="ml-3 font-medium text-dark">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <span className="ml-3 font-medium text-dark">UPI</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-dark mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seats Selected</span>
                      <span className="font-medium">{selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per seat</span>
                      <span className="font-medium">${event?.ticketPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        ${(selectedSeats.length * (event?.ticketPrice || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {bookingLoading ? <Loader className="animate-spin" size={20} /> : null}
                  {bookingLoading ? 'Processing...' : 'Complete Booking'}
                </button>

                <button
                  onClick={() => {
                    setStep('select-seats');
                    setError('');
                  }}
                  disabled={bookingLoading}
                  className="w-full btn btn-outline"
                >
                  Back to Seat Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h3 className="text-xl font-bold text-dark mb-6">Booking Summary</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Event</p>
                <p className="font-semibold text-dark">{event?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Selected Seats</p>
                <p className="font-semibold text-dark">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                <p className="text-2xl font-bold text-primary">
                  ${(selectedSeats.length * (event?.ticketPrice || 0)).toFixed(2)}
                </p>
              </div>

              {step === 'select-seats' && (
                <button
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                  className="w-full btn btn-primary disabled:opacity-50"
                >
                  Proceed to Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
