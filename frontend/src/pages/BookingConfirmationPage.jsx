import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { CheckCircle, Calendar, MapPin, Ticket, Download } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getById(bookingId);
        setBooking(response.data.data || response.data);
      } catch (err) {
        console.error('[BookingConfirmation] Error:', err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleDownloadTicket = () => {
    // Implement ticket download logic
    console.log('Download ticket for booking:', bookingId);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Message */}
      <div className="text-center mb-12">
        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-dark mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 text-lg">
          Your tickets have been successfully booked. A confirmation email has been sent to {booking?.customerEmail}.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-2">{booking?.eventId?.name}</h2>
            <p className="text-gray-600">Booking ID: {booking?._id}</p>
          </div>
          <span className="badge badge-success">Confirmed</span>
        </div>

        <div className="space-y-4 mb-6 text-gray-700">
          {/* Date */}
          <div className="flex items-center gap-3">
            <Calendar className="text-primary" size={20} />
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold">
                {new Date(booking?.eventId?.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{booking?.eventId?.location}</p>
            </div>
          </div>

          {/* Seats */}
          <div className="flex items-start gap-3">
            <Ticket className="text-primary mt-1" size={20} />
            <div>
              <p className="text-sm text-gray-600">Seats</p>
              <p className="font-semibold">{booking?.seats?.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Total Amount Paid</span>
            <span className="text-2xl font-bold text-primary">
              ${booking?.totalPrice?.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {booking?.seats?.length} Ticket{booking?.seats?.length !== 1 ? 's' : ''} @ $
            {booking?.eventId?.ticketPrice.toFixed(2)} each
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadTicket}
            className="w-full btn btn-primary flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download E-Ticket
          </button>
          <Link
            to="/my-bookings"
            className="w-full btn btn-outline text-center"
          >
            View All Bookings
          </Link>
        </div>
      </div>

      {/* Important Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-dark mb-3">Important Information</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Save your booking confirmation for entry to the event</li>
          <li>• Please arrive 15 minutes early</li>
          <li>• You can cancel this booking up to 48 hours before the event</li>
          <li>• A refund will be processed within 5-7 business days</li>
        </ul>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link to="/" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
