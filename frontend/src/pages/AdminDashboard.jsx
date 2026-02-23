import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { BarChart3, Users, Ticket, DollarSign, Plus, Edit2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, events, bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, eventsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getEvents({ limit: 10, page: 1 }),
        ]);

        setStats(statsRes.data.data || statsRes.data);
        const eventsData = eventsRes.data.data || eventsRes.data;
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        console.error('[AdminDashboard] Error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage events, bookings, and revenue</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          {['overview', 'events', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-dark'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue */}
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-dark">
                      ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <DollarSign className="text-primary" size={32} />
                </div>
              </div>

              {/* Total Events */}
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Events</p>
                    <p className="text-3xl font-bold text-dark">
                      {stats?.totalEvents || 0}
                    </p>
                  </div>
                  <BarChart3 className="text-primary" size={32} />
                </div>
              </div>

              {/* Total Bookings */}
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-dark">
                      {stats?.totalBookings || 0}
                    </p>
                  </div>
                  <Ticket className="text-primary" size={32} />
                </div>
              </div>

              {/* Active Users */}
              <div className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-dark">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                  <Users className="text-primary" size={32} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-2xl font-bold text-dark mb-6">Recent Activity</h2>
              <p className="text-gray-600">
                Total Bookings This Month: {stats?.bookingsThisMonth || 0}
              </p>
              <p className="text-gray-600">
                Total Revenue This Month: ${stats?.revenueThisMonth?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">Manage Events</h2>
              <button className="btn btn-primary flex items-center gap-2">
                <Plus size={20} />
                Create Event
              </button>
            </div>

            {events.length > 0 ? (
              <div className="grid gap-6">
                {events.map((event) => (
                  <div key={event._id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-dark mb-2">
                          {event.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {event.location} • {new Date(event.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Available Seats</p>
                            <p className="font-semibold">
                              {event.availableSeats} / {event.totalSeats}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-semibold">
                              ${event.ticketPrice.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bookings</p>
                            <p className="font-semibold">
                              {event.totalSeats - event.availableSeats}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className="btn btn-secondary flex items-center gap-2">
                        <Edit2 size={18} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No events created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Recent Bookings</h2>
            <div className="card">
              <p className="text-gray-600">
                Detailed booking management interface would be displayed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
