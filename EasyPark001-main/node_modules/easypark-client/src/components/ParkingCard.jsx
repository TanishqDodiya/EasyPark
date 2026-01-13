import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function ParkingCard({ parking, highlighted }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-card p-5 transition-all ${
        highlighted ? 'ring-2 ring-primary-500/30 dark:ring-accent-500/70 shadow-xl shadow-primary-500/20 dark:shadow-accent-500/30 border-primary-300/50 dark:border-accent-500/70' : 'hover:shadow-xl hover:scale-[1.02]'
      }`}
    >
      {highlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent pointer-events-none"></div>
      )}
      <header className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 group-hover:text-primary-600 dark:group-hover:text-accent-300 transition-colors">{parking.name}</h3>
            {highlighted && (
              <span className="rounded-full bg-primary-100 dark:bg-accent-500/20 px-2 py-0.5 text-[9px] font-semibold text-primary-700 dark:text-accent-300 ring-1 ring-primary-300 dark:ring-accent-500/30">
                RECOMMENDED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {parking.address}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold glass-badge ${
            parking.isOpen 
              ? 'bg-emerald-100/50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30' 
              : 'bg-red-100/50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-500/30'
          }`}>
            {parking.isOpen ? '● OPEN' : '● CLOSED'}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {parking.distance} km
          </span>
        </div>
      </header>

      <dl className="relative z-10 mt-5 grid grid-cols-3 gap-3 text-xs">
        {[
          { label: 'Available', value: parking.availableSlots, color: 'text-emerald-400', icon: '🚗' },
          { label: 'Price / hr', value: `₹${parking.pricePerHour}`, color: 'text-slate-50', icon: '💰' },
          { label: 'Rating', value: `★ ${parking.rating.toFixed(1)}`, color: 'text-amber-400', icon: '⭐' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05, y: -2 }}
            className="rounded-2xl glass-badge p-3 transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-105"
          >
            <dt className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">{stat.label}</dt>
            <dd className={`text-sm font-bold ${stat.color} flex items-center gap-1`}>
              <span className="text-xs">{stat.icon}</span>
              {stat.value}
            </dd>
          </motion.div>
        ))}
      </dl>

      <footer className="relative z-10 mt-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {parking.isCheapest && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center gap-1 rounded-full glass-badge bg-emerald-100/50 dark:bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30"
            >
              💰 Cheapest
            </motion.span>
          )}
          {parking.isEasiest && (
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center gap-1 rounded-full glass-badge bg-primary-100/50 dark:bg-accent-500/20 px-2.5 py-1 text-[10px] font-semibold text-primary-700 dark:text-accent-300 border-primary-200/50 dark:border-accent-500/30"
            >
              ⚡ Easiest access
            </motion.span>
          )}
        </div>
        <Link
          to={`/parking/${parking.id}`}
          className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary-500/40 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 active:scale-95"
        >
          <span className="relative z-10">View details</span>
          <svg className="relative z-10 h-3 w-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="absolute inset-0 -z-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 transition-opacity group-hover/btn:opacity-100"></span>
        </Link>
      </footer>
    </motion.article>
  );
}

export default ParkingCard;


