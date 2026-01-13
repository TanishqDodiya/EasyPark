import { motion } from 'framer-motion';

function Admin() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-50">Admin Panel</h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage parking locations, pricing, and live availability.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-xs shadow-xl shadow-black/40"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400">Parking name</label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
              placeholder="e.g. Skyline Mall Parking"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400">Price per hour (₹)</label>
            <input
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
              placeholder="40"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400">Total slots</label>
            <input
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
              placeholder="80"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400">Available slots</label>
            <input
              type="number"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
              placeholder="24"
            />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/40"
        >
          Save parking location
        </button>

        <p className="text-[11px] text-slate-400">
          This is a demo UI. In the full version, this will persist to MongoDB and update all users
          in real time.
        </p>
      </motion.div>
    </section>
  );
}

export default Admin;


