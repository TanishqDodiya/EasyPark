import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample booking history data - in real app, this would come from an API
const BOOKING_HISTORY = [
  {
    bookingId: 'EP-123456',
    parkingName: 'Sitabuldi Metro Parking',
    parkingId: '1',
    date: '2024-01-15',
    time: '14:30',
    duration: 3,
    vehicle: { type: 'Car', number: 'MH 31 AB 1234' },
    slot: { level: 'B1', number: '12' },
    amount: 150,
    paymentMethod: 'UPI',
    status: 'Completed',
    entryTime: '14:35',
    exitTime: '17:30'
  },
  {
    bookingId: 'EP-123455',
    parkingName: 'MIHAN Parking Complex',
    parkingId: '2',
    date: '2024-01-14',
    time: '10:00',
    duration: 4,
    vehicle: { type: 'SUV', number: 'MH 31 CD 5678' },
    slot: { level: 'B2', number: '45' },
    amount: 200,
    paymentMethod: 'Card',
    status: 'Completed',
    entryTime: '10:05',
    exitTime: '14:10'
  },
  {
    bookingId: 'EP-123454',
    parkingName: 'Nagpur Airport Parking',
    parkingId: '3',
    date: '2024-01-13',
    time: '08:00',
    duration: 6,
    vehicle: { type: 'Car', number: 'MH 31 EF 9012' },
    slot: { level: 'B1', number: '8' },
    amount: 300,
    paymentMethod: 'QR',
    status: 'Completed',
    entryTime: '08:05',
    exitTime: '14:15'
  },
  {
    bookingId: 'EP-123453',
    parkingName: 'Sitabuldi Metro Parking',
    parkingId: '1',
    date: '2024-01-12',
    time: '16:00',
    duration: 2,
    vehicle: { type: 'Bike', number: 'MH 31 GH 3456' },
    slot: { level: 'B3', number: '78' },
    amount: 100,
    paymentMethod: 'UPI',
    status: 'Completed',
    entryTime: '16:05',
    exitTime: '18:10'
  },
  {
    bookingId: 'EP-123452',
    parkingName: 'MIHAN Parking Complex',
    parkingId: '2',
    date: '2024-01-11',
    time: '12:00',
    duration: 5,
    vehicle: { type: 'Car', number: 'MH 31 IJ 7890' },
    slot: { level: 'B1', number: '23' },
    amount: 250,
    paymentMethod: 'Card',
    status: 'Completed',
    entryTime: '12:05',
    exitTime: '17:15'
  }
];

function BookingHistory() {
  const [filter, setFilter] = useState('all'); // all, completed, active, cancelled
  const navigate = useNavigate();

  const filteredBookings = BOOKING_HISTORY.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (parkingId) => {
    navigate(`/parking/${parkingId}`);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-50">Booking History</h1>
        <p className="mt-1 text-xs text-slate-400">
          View all your past and current parking bookings
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Bookings', count: BOOKING_HISTORY.length },
          { id: 'completed', label: 'Completed', count: BOOKING_HISTORY.filter(b => b.status === 'Completed').length },
          { id: 'active', label: 'Active', count: BOOKING_HISTORY.filter(b => b.status === 'Active').length },
          { id: 'cancelled', label: 'Cancelled', count: BOOKING_HISTORY.filter(b => b.status === 'Cancelled').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`whitespace-nowrap rounded-2xl border px-4 py-2 text-xs font-medium transition-all ${
              filter === tab.id
                ? 'border-accent-400 bg-accent-500/10 text-accent-100'
                : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
            }`}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-8 text-center text-xs text-slate-400"
          >
            <p className="text-sm">No bookings found</p>
            <p className="mt-1 text-[10px]">Your booking history will appear here</p>
          </motion.div>
        ) : (
          filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.bookingId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-xs shadow-xl shadow-black/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Left Section - Booking Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-50">{booking.parkingName}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            booking.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : booking.status === 'Active'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Booking ID: <span className="font-mono text-slate-300">{booking.bookingId}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent-400">₹{booking.amount}</p>
                      <p className="text-[10px] text-slate-400">{booking.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] text-slate-400">Date & Time</p>
                      <p className="mt-1 text-xs font-medium text-slate-200">
                        {formatDate(booking.date)} at {booking.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Duration</p>
                      <p className="mt-1 text-xs font-medium text-slate-200">{booking.duration} hours</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Vehicle</p>
                      <p className="mt-1 text-xs font-medium text-slate-200">
                        {booking.vehicle.type} • {booking.vehicle.number}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Parking Slot</p>
                      <p className="mt-1 text-xs font-medium text-emerald-300">
                        Level {booking.slot.level} • Slot {booking.slot.number}
                      </p>
                    </div>
                  </div>

                  {booking.status === 'Completed' && booking.entryTime && booking.exitTime && (
                    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-2">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <p className="text-slate-400">Entry Time</p>
                          <p className="mt-0.5 font-medium text-slate-200">{booking.entryTime}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Exit Time</p>
                          <p className="mt-0.5 font-medium text-slate-200">{booking.exitTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col gap-2 sm:w-32">
                  <button
                    onClick={() => handleViewDetails(booking.parkingId)}
                    className="rounded-2xl border border-white/15 bg-slate-950/80 px-3 py-2 text-[11px] font-medium text-slate-100 hover:bg-slate-900 transition-colors"
                  >
                    View Parking
                  </button>
                  <button
                    onClick={() => {
                      // In real app, this would download the e-ticket
                      alert(`Downloading e-ticket for ${booking.bookingId}`);
                    }}
                    className="rounded-2xl border border-accent-400/30 bg-accent-500/10 px-3 py-2 text-[11px] font-medium text-accent-300 hover:bg-accent-500/20 transition-colors"
                  >
                    Download Ticket
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-xs sm:grid-cols-3"
      >
        <div className="text-center">
          <p className="text-[10px] text-slate-400">Total Bookings</p>
          <p className="mt-1 text-lg font-bold text-slate-50">{BOOKING_HISTORY.length}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">Total Spent</p>
          <p className="mt-1 text-lg font-bold text-accent-400">
            ₹{BOOKING_HISTORY.reduce((sum, b) => sum + b.amount, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">Average Duration</p>
          <p className="mt-1 text-lg font-bold text-slate-50">
            {Math.round(BOOKING_HISTORY.reduce((sum, b) => sum + b.duration, 0) / BOOKING_HISTORY.length)} hrs
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default BookingHistory;

