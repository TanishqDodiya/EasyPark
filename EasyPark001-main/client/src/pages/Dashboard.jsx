import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BOOKINGS = [
  {
    id: 'b1',
    parkingName: 'Skyline Mall Parking',
    date: 'Today, 5:30 PM',
    duration: '2 hrs',
    amount: 120,
    status: 'Active'
  },
  {
    id: 'b2',
    parkingName: 'Central Business Bay',
    date: 'Yesterday, 11:00 AM',
    duration: '3 hrs',
    amount: 180,
    status: 'Completed'
  }
];

function Dashboard() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Your Dashboard</h1>
          <p className="mt-1 text-xs text-slate-400">
            View active bookings, history, and saved parking spots.
          </p>
        </div>
        <Link
          to="/booking-history"
          className="rounded-2xl border border-accent-400/30 bg-accent-500/10 px-4 py-2 text-xs font-medium text-accent-300 hover:bg-accent-500/20 transition-colors"
        >
          View History
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.3fr,1fr]">
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-200">Active bookings</h2>
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 text-xs shadow-xl shadow-black/40">
            {BOOKINGS.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-50">{b.parkingName}</p>
                  <p className="text-[11px] text-slate-400">
                    {b.date} • {b.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-50">₹{b.amount}</p>
                  <p
                    className={`text-[10px] ${
                      b.status === 'Active' ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {b.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-200">Saved parking</h2>
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-xs text-slate-400">
            Sign in to sync your favourites and view them across devices.
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;


