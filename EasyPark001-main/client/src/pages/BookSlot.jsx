import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function BookSlot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    hours: 2,
    vehicle: '',
    type: 'Car',
    level: location.state?.preselectedLevel || 'B1',
    slot: location.state?.preselectedSlot?.toString() || '12',
    paymentMethod: 'upi'
  });

  const handleChange = (field, value) => {
    setBooking((b) => ({ ...b, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to payment page with booking data
    navigate(`/parking/${id}/payment`, {
      state: {
        booking: {
          ...booking,
          parkingName: 'Sitabuldi Metro Parking' // You can pass this from parking details
        }
      }
    });
  };

  return (
    <section className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-50">Book your parking slot</h1>
        <p className="mt-1 text-xs text-slate-400">
          Select your time and vehicle details. A QR e-ticket will be generated after payment.
        </p>
      </header>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-xs shadow-xl shadow-black/40"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] text-slate-400">Date</label>
            <input
              type="date"
              required
              value={booking.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400">Arrival time</label>
            <input
              type="time"
              required
              value={booking.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] text-slate-400">Duration (hours)</label>
            <input
              type="number"
              min={1}
              max={12}
              required
              value={booking.hours}
              onChange={(e) => handleChange('hours', Number(e.target.value || 1))}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400">Vehicle number</label>
            <input
              type="text"
              required
              placeholder="MH 31 AB 1234"
              value={booking.vehicle}
              onChange={(e) => handleChange('vehicle', e.target.value.toUpperCase())}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400">Vehicle type</label>
          <select
            value={booking.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
          >
            <option>Car</option>
            <option>Bike</option>
            <option>SUV</option>
          </select>
        </div>

        <div>
          <p className="mb-1 text-[11px] text-slate-400">Payment method</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'upi', label: 'UPI', badge: '₹', desc: 'GPay / PhonePe' },
              { id: 'card', label: 'Card', badge: '💳', desc: 'Debit / Credit' },
              { id: 'qr', label: 'QR code', badge: '▢', desc: 'Scan & pay' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleChange('paymentMethod', m.id)}
                className={`flex flex-col rounded-2xl border px-2 py-1.5 text-[10px] ${
                  booking.paymentMethod === m.id
                    ? 'border-accent-400 bg-accent-500/10 text-accent-100'
                    : 'border-white/10 bg-slate-950/60 text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1 text-[11px] font-semibold">
                  <span>{m.badge}</span>
                  {m.label}
                </span>
                <span className="text-[9px] text-slate-400">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] text-slate-400">Preferred level</label>
            <select
              value={booking.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
            >
              <option value="B1">B1 (near exit)</option>
              <option value="B2">B2 (shaded)</option>
              <option value="B3">B3 (economy)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400">Preferred slot number</label>
            <input
              type="number"
              min={1}
              max={120}
              required
              value={booking.slot}
              onChange={(e) => handleChange('slot', e.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 focus:border-accent-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
          <span>Payment is simulated in this demo. No real money will be charged.</span>
          <span>Parking ID: {id}</span>
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/40"
        >
          Continue to Payment
        </button>
      </motion.form>
    </section>
  );
}

export default BookSlot;
