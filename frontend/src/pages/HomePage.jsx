import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { Calendar, MapPin, Loader } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAll({ limit: 20, page: 1 });
        setEvents(response.data.data || response.data);
        setFilteredEvents(response.data.data || response.data);
      } catch (err) {
        console.error('[HomePage] Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

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
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
          Discover Amazing Events
        </h1>
        <p className="text-xl text-gray-600">
          Book your tickets to the best events in your city
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search events by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input w-full"
        />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="card hover:shadow-lg transition-shadow">
              {/* Event Image */}
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Event Info */}
              <h2 className="text-xl font-bold text-dark mb-2">{event.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Date and Location */}
              <div className="space-y-2 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {event.location}
                </div>
              </div>

              {/* Price and Availability */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Price per ticket</p>
                  <p className="text-2xl font-bold text-primary">
                    ${event.ticketPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Available seats</p>
                  <p className="text-2xl font-bold text-success">
                    {event.availableSeats || 'TBD'}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to={`/events/${event._id}`}
                className="w-full btn btn-primary text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No events match your search.' : 'No events available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
