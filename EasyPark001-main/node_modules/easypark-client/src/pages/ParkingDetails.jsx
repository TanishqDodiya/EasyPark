import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// For now this reuses a small sample dataset;
// in a real app this would be fetched from the backend.
const SAMPLE = {
  '1': {
    name: 'Sitabuldi Metro Parking',
    address: 'Zero Mile – Sitabuldi Metro Station, Nagpur',
    description:
      'Multi-level covered parking at the heart of Nagpur with CCTV, metro connectivity, and EV charging bays.',
    photos: ['/img/parking-1a.jpg', '/img/parking-1b.jpg'],
    pricePerHour: 30,
    dayCap: 200,
    availableSlots: 24,
    totalSlots: 80,
    lat: 21.1458,
    lng: 79.0882,
    instructions: [
      'Enter from the Sitabuldi Metro side gate towards Zero Mile.',
      'Collect a ticket at the barrier; EasyPark will sync your booking automatically.',
      'Park in any slot with green LEDs or “EasyPark reserved” marking.'
    ]
  }
};

function ParkingDetails() {
  const { id } = useParams();
  const parking = SAMPLE[id] || SAMPLE['1'];
  const navigate = useNavigate();

  const availability = Math.round((parking.availableSlots / parking.totalSlots) * 100);

  const handleNavigate = () => {
    if (!parking.lat || !parking.lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${parking.lat},${parking.lng}&travelmode=driving`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBookNow = () => {
    navigate(`/parking/${id}/select-slot`);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-[1.4fr,1fr] md:items-start">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold text-slate-50 sm:text-3xl"
          >
            {parking.name}
          </motion.h1>
          <p className="mt-1 text-xs text-slate-400">{parking.address}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-900/80 p-3 text-xs">
              <p className="text-[10px] text-slate-400">Price breakdown</p>
              <p className="mt-1 text-base font-semibold text-slate-50">
                ₹{parking.pricePerHour}
                <span className="text-xs text-slate-400"> / hour</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Day cap: ₹{parking.dayCap}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-3 text-xs">
              <p className="text-[10px] text-slate-400">Availability</p>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-accent-400"
                  style={{ width: `${availability}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-emerald-300">
                {parking.availableSlots} of {parking.totalSlots} slots free
              </p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 p-3 text-xs">
              <p className="text-[10px] text-slate-400">Access</p>
              <p className="mt-1 text-[11px] text-slate-300">
                24x7 guarded entry, EV charging, disabled-friendly ramps
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>{parking.description}</p>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Entry / exit instructions
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                {parking.instructions.map((step) => (
                  <li key={step}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-40 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_10%_20%,#22d3ee33,transparent_60%),radial-gradient(circle_at_90%_80%,#4f46e533,transparent_55%)] shadow-xl shadow-primary-500/40" />

          <button
            type="button"
            onClick={handleBookNow}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-primary-500/40 transition hover:translate-y-0.5"
          >
            Book Now
          </button>

          <button
            type="button"
            onClick={handleNavigate}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs font-medium text-slate-100 hover:border-accent-500"
          >
            Navigate using Google Maps
          </button>
        </div>
      </div>
    </section>
  );
}

export default ParkingDetails;


