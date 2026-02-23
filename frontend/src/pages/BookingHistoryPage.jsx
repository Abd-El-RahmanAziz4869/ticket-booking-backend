import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { Calendar, MapPin, Ticket, Download, XCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingsAPI.getByUser();
        const bookingsData = response.data.data || response.data;
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (err) {
        console.error('[BookingHistory] Error:', err);
        setError('Failed to load your bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
    } catch (err) {
      console.error('[BookingHistory] Cancel error:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const isCancellable = (booking) => {
    const eventDate = new Date(booking.eventId?.date);
    const now = new Date();
    const hoursDifference = (eventDate - now) / (1000 * 60 * 60);
    return booking.status === 'confirmed' && hoursDifference > 48;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <h1 className="text-3xl font-bold text-dark mb-8">My Bookings</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        {['all', 'confirmed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-white text-dark border border-gray-300 hover:border-primary'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-1">
                    {booking.eventId?.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Booking ID: {booking._id.substring(0, 8)}...
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`badge ${
                      booking.status === 'confirmed'
                        ? 'badge-success'
                        : 'badge-danger'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {formatDate(booking.eventId?.date)}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{booking.eventId?.location}</p>
                  </div>
                </div>

                {/* Seats */}
                <div className="flex items-start gap-3">
                  <Ticket className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Seats</p>
                    <p className="font-semibold text-sm">
                      {booking.seats?.slice(0, 3).join(', ')}
                      {booking.seats?.length > 3 ? ` +${booking.seats.length - 3}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center justify-between">
                <span className="font-semibold text-dark">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ${booking.totalPrice?.toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  to={`/booking-confirmation/${booking._id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                >
                  <Download size={18} />
                  View Details
                </Link>

                {isCancellable(booking) && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <XCircle size={18} />
                    Cancel Booking
                  </button>
                )}

                {booking.status === 'cancelled' && (
                  <span className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm">
                    Refund processed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">No Bookings Yet</h2>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'all'
              ? 'You haven\'t booked any tickets yet.'
              : `No ${filterStatus} bookings found.`}
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
