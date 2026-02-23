import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Loader } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getById(id);
        setEvent(response.data.data || response.data);
      } catch (err) {
        console.error('[EventDetailsPage] Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn btn-primary"
        >
          Back to Events
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">Event not found</p>
      </div>
    );
  }

  const isEventAvailable = event.availableSeats > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-primary hover:text-blue-700 mb-8 font-semibold"
      >
        <ArrowLeft size={20} />
        Back to Events
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Event Image and Details */}
        <div className="md:col-span-2">
          {/* Event Image */}
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Event Title */}
          <h1 className="text-4xl font-bold text-dark mb-4">{event.name}</h1>

          {/* Event Meta */}
          <div className="space-y-3 mb-8 text-gray-700">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary" size={24} />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold">{formatDate(event.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-primary" size={24} />
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-semibold">{event.totalSeats} seats</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ticket className="text-primary" size={24} />
              <div>
                <p className="text-sm text-gray-600">Price per Ticket</p>
                <p className="font-semibold text-2xl text-primary">
                  ${event.ticketPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-2xl font-bold text-dark mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="md:col-span-1">
          <div className="card sticky top-20">
            {/* Availability */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Available Seats</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-dark">
                  {event.availableSeats}
                </span>
                <span className="text-gray-600">of {event.totalSeats}</span>
              </div>

              {/* Availability Bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isEventAvailable ? 'bg-success' : 'bg-danger'
                  }`}
                  style={{
                    width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-b py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per ticket</span>
                <span className="font-semibold">${event.ticketPrice.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 italic">
                Final total will be calculated based on selected seats
              </p>
            </div>

            {/* CTA Button */}
            {isEventAvailable ? (
              isAuthenticated ? (
                <Link
                  to={`/booking/${event._id}`}
                  className="w-full btn btn-primary text-center text-lg"
                >
                  Book Now
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full btn btn-primary text-center text-lg"
                >
                  Login to Book
                </Link>
              )
            ) : (
              <button
                disabled
                className="w-full btn btn-secondary opacity-50 cursor-not-allowed"
              >
                Sold Out
              </button>
            )}

            {/* Cancellation Policy */}
            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
              Bookings can be cancelled up to 48 hours before the event for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
