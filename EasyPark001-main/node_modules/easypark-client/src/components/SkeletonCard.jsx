function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/5 bg-slate-900/80 p-4 shadow-xl shadow-black/40">
      <div className="flex justify-between">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="h-4 w-16 rounded bg-slate-800" />
      </div>
      <div className="mt-2 h-3 w-40 rounded bg-slate-800" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="h-12 rounded-2xl bg-slate-800" />
        <div className="h-12 rounded-2xl bg-slate-800" />
        <div className="h-12 rounded-2xl bg-slate-800" />
      </div>
      <div className="mt-4 h-7 w-24 rounded-full bg-slate-800" />
    </div>
  );
}

export default SkeletonCard;


