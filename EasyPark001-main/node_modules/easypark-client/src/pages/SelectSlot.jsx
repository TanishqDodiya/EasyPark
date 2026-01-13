import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const TOTAL_SLOTS = 60;
const OCCUPIED_EXAMPLE = [3, 4, 10, 18, 21, 25, 34, 35, 41, 55];

function SelectSlot() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState('B1');
  const [selected, setSelected] = useState(null);

  const slots = useMemo(
    () =>
      Array.from({ length: TOTAL_SLOTS }).map((_, idx) => {
        const number = idx + 1;
        const occupied = OCCUPIED_EXAMPLE.includes(number);
        const reserved = number % 11 === 0;
        return { number, occupied, reserved };
      }),
    []
  );

  const handleConfirm = () => {
    if (!selected) return;
    navigate(`/parking/${id}/book`, {
      state: {
        preselectedLevel: level,
        preselectedSlot: selected
      }
    });
  };

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Choose your parking slot</h1>
          <p className="mt-1 text-xs text-slate-400">
            Tap on an available slot, just like selecting seats while booking movie tickets.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="h-3 w-3 rounded-sm bg-slate-700" /> Available
          <span className="h-3 w-3 rounded-sm bg-emerald-400" /> Selected
          <span className="h-3 w-3 rounded-sm bg-slate-500" /> Occupied
          <span className="h-3 w-3 rounded-sm bg-primary-500" /> Reserved
        </div>
      </header>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-xs shadow-xl shadow-black/40">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] text-slate-400">Level</p>
            <div className="inline-flex gap-1 rounded-full bg-slate-950/80 p-1">
              {['B1', 'B2', 'B3'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    level === lvl
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Parking ID: <span className="font-mono text-slate-200">{id}</span>
          </p>
        </div>

        <div className="mt-2 overflow-x-auto rounded-2xl bg-slate-950/70 p-3">
          <p className="mb-2 text-[11px] text-center text-slate-400">Entry Gate</p>
          <div className="mx-auto grid max-w-2xl grid-cols-10 gap-1">
            {slots.map((slot) => {
              const isSelected = selected === slot.number;
              const baseClasses = 'flex h-7 items-center justify-center rounded-[6px] text-[10px]';
              let colorClasses = 'bg-slate-700 text-slate-200';

              if (slot.occupied) {
                colorClasses = 'bg-slate-500 text-slate-200 cursor-not-allowed';
              } else if (slot.reserved) {
                colorClasses = 'bg-primary-500/80 text-white';
              }
              if (isSelected) {
                colorClasses = 'bg-emerald-400 text-slate-950';
              }

              return (
                <button
                  key={slot.number}
                  type="button"
                  disabled={slot.occupied}
                  onClick={() => setSelected(slot.number)}
                  className={`${baseClasses} ${colorClasses}`}
                >
                  {slot.number}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-center text-slate-400">Exit Gate</p>
        </div>

        <div className="flex flex-col items-start justify-between gap-2 pt-1 sm:flex-row sm:items-center">
          <p className="text-[11px] text-slate-400">
            Selected slot:{' '}
            {selected ? (
              <span className="font-medium text-emerald-300">
                Level {level} • Slot {selected}
              </span>
            ) : (
              <span className="text-slate-500">None</span>
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-white/15 bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-slate-100"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={handleConfirm}
              className="rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-primary-500/40 disabled:opacity-50"
            >
              Continue to details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectSlot;


