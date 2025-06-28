'use client'

import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  Award,
  HeartHandshake,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Edit,
  X,
  CalendarX
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingData {
  id: string;
  userId: string;
  nurseId: string;
  disease: string;
  scheduledDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  nurseFeedback?: string;
  createdAt: string;
  updatedAt: string;
  nurse: {
    id: string;
    name: string;
    specialization: string;
    experienceYears: number;
    language: string;
    gender: string;
    phone: string;
    email: string;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    locationId: string;
  };
}

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<{ [key: string]: 'cancel' | 'reschedule' | null }>({});
  const [showRescheduleModal, setShowRescheduleModal] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/get-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setBookings(result.data);
      } else {
        setError(result.message || 'Failed to fetch booking history');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Timer className="w-4 h-4" />;
      case 'CONFIRMED':
        return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Timer className="w-4 h-4" />;
    }
  };

  const cancelAppointment = async (bookingId: string) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'cancel' }));

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the booking status locally
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: 'CANCELLED' as const }
              : booking
          )
        );
        console.log('Appointment cancelled successfully');
        toast.success('Appointment cancelled successfully');
      } else {
        setError(result.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError('Network error occurred while cancelling appointment');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  const rescheduleAppointment = async (bookingId: string, newScheduledDate: string) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'reschedule' }));

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/reschedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bookingId, 
          newScheduledDate 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, scheduledDate: newScheduledDate }
              : booking
          )
        );
        setShowRescheduleModal(null);
        setNewDate('');
        console.log('Appointment rescheduled successfully');
        toast.success('Appointment rescheduled successfully');
      } else {
        setError(result.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setError('Network error occurred while rescheduling appointment');
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: null }));
    }
  };

  const handleReschedule = (bookingId: string) => {
    setShowRescheduleModal(bookingId);
    setError(''); // Clear any existing errors
  };

  const handleCancelReschedule = () => {
    setShowRescheduleModal(null);
    setNewDate('');
  };

  const handleConfirmReschedule = () => {
    if (showRescheduleModal && newDate) {
      rescheduleAppointment(showRescheduleModal, newDate);
    }
  };

  const canModifyBooking = (status: string) => {
    return status === 'PENDING' || status === 'CONFIRMED';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Booking History</h1>
          <p className="text-gray-600 mt-1">Your appointment records</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-4">You haven&apos;t made any appointments yet.</p>
          <button
            onClick={fetchBookings}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh to check again
          </button>
        </div>
      )}

      {/* Booking History Grid */}
      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{booking.nurse.name}</h3>
                        <p className="text-blue-100">{booking.nurse.specialization}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">{booking.status}</span>
                    </div>
                  </div>

                  {/* Disease/Condition */}
                  <div className="mt-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <HeartHandshake className="w-4 h-4" />
                        <span className="text-sm">Condition:</span>
                        <span className="font-medium capitalize">{booking.disease}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Appointment Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">Scheduled: {formatDate(booking.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">Booked: {formatDate(booking.createdAt)}</span>
                    </div>
                  </div>

                  {/* Nurse Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-lg font-bold text-blue-800">{booking.nurse.experienceYears}y</div>
                      <div className="text-xs text-blue-600">Experience</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="text-lg font-bold text-purple-800 capitalize">{booking.nurse.gender.toLowerCase()}</div>
                      <div className="text-xs text-purple-600">Gender</div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {booking.nurse.phone}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {booking.nurse.email}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  {booking.nurseFeedback && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Nurse Feedback:</h4>
                      <p className="text-sm text-gray-600">{booking.nurseFeedback}</p>
                    </div>
                  )}

                  {/* Reason if cancelled */}
                  {booking.reason && booking.status === 'CANCELLED' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <h4 className="text-sm font-medium text-red-700 mb-2">Cancellation Reason:</h4>
                      <p className="text-sm text-red-600">{booking.reason}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    {canModifyBooking(booking.status) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReschedule(booking.id)}
                          disabled={actionLoading[booking.id] === 'reschedule'}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          {actionLoading[booking.id] === 'reschedule' ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <>
                              <Edit className="w-4 h-4" />
                              <span>Reschedule</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => cancelAppointment(booking.id)}
                          disabled={actionLoading[booking.id] === 'cancel'}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          {actionLoading[booking.id] === 'cancel' ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <>
                              <CalendarX className="w-4 h-4" />
                              <span>Cancel</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        View Details
                      </button>
                      {booking.status === 'COMPLETED' && (
                        <button className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors">
                          <Award className="w-4 h-4 inline mr-1" />
                          Rate Visit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )        )}
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reschedule Appointment</h3>
              <button
                onClick={handleCancelReschedule}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Appointment Date & Time
              </label>
              <input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelReschedule}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                disabled={!newDate || actionLoading[showRescheduleModal] === 'reschedule'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {actionLoading[showRescheduleModal] === 'reschedule' ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      )}
    </div>
  );
};

export default BookingHistory;