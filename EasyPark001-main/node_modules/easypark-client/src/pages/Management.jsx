import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { parkingService } from '../services/supabaseService';
import ConnectionTest from '../components/ConnectionTest';

function Management() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch parking locations
      const parkingData = await parkingService.getAll();
      
      // For demo purposes, create mock analytics data
      const mockStats = {
        overview: {
          totalBookings: 156,
          completedBookings: 142,
          totalRevenue: 45600,
          averageBookingAmount: 292,
          activeBookings: 14,
          totalParkingLocations: parkingData?.length || 3
        },
        revenueByPaymentMethod: [
          { _id: 'UPI', total: 28500, count: 95 },
          { _id: 'Card', total: 12400, count: 42 },
          { _id: 'Cash', total: 4700, count: 19 }
        ],
        bookingsByStatus: [
          { _id: 'completed', count: 142 },
          { _id: 'active', count: 14 },
          { _id: 'cancelled', count: 8 }
        ],
        bookingsByParking: parkingData?.map((parking) => ({
          parkingName: parking.name,
          parkingAddress: parking.address,
          bookingCount: Math.floor(Math.random() * 50) + 10,
          totalRevenue: Math.floor(Math.random() * 15000) + 5000
        })) || [],
        recentBookings: [
          {
            _id: '1',
            bookingId: 'EP001234',
            parkingId: { name: parkingData?.[0]?.name || 'Sitabuldi Metro Parking' },
            vehicle: { type: 'Car', number: 'MH12AB1234' },
            date: new Date().toISOString(),
            time: '14:30',
            duration: 2,
            amount: 60
          }
        ]
      };

      setStats(mockStats);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <motion.div
              className="inline-block h-8 w-8 rounded-full border-4 border-primary-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Connection Error
            </h3>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { overview, revenueByPaymentMethod, bookingsByParking, recentBookings, bookingsByStatus } = stats;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Management Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Track bookings, revenue, and parking performance
        </p>
      </motion.div>

      {/* Connection Test */}
      <div className="mb-8">
        <ConnectionTest />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Bookings</h3>
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-3xl font-bold">{overview.totalBookings}</p>
          <p className="text-sm opacity-75 mt-1">
            {overview.completedBookings} completed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(overview.totalRevenue)}</p>
          <p className="text-sm opacity-75 mt-1">
            Avg: {formatCurrency(overview.averageBookingAmount)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Active Bookings</h3>
            <span className="text-2xl">🚗</span>
          </div>
          <p className="text-3xl font-bold">{overview.activeBookings}</p>
          <p className="text-sm opacity-75 mt-1">Currently parked</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Parking Locations</h3>
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-3xl font-bold">{overview.totalParkingLocations}</p>
          <p className="text-sm opacity-75 mt-1">Total locations</p>
        </motion.div>
      </div>

      {/* Revenue by Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg mb-8"
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Revenue by Payment Method
        </h2>
        <div className="space-y-4">
          {revenueByPaymentMethod.length > 0 ? (
            revenueByPaymentMethod.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                    {item._id === 'UPI' ? '💳' : item._id === 'Card' ? '💳' : '📱'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {item._id}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.count} bookings
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {formatCurrency(item.total)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              No payment data available
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Management;