import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ServiceModal from '../components/ServiceModal';
import { useLocation } from '../contexts/LocationContext';

function Home() {
  const [locationPermission, setLocationPermission] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const navigate = useNavigate();
  const { 
    getCurrentLocation, 
    setLocationFromSearch, 
    isLoadingLocation, 
    locationError, 
    searchQuery, 
    setSearchQuery,
    selectedLocation 
  } = useLocation();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }
    
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((p) => {
        setLocationPermission(p.state);
        // Listen for permission changes
        p.onchange = () => setLocationPermission(p.state);
      })
      .catch(() => {
        // Fallback for browsers that don't support permissions API
        setLocationPermission('prompt');
      });
  }, []);

  const handleDetectLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      navigate('/discover', {
        state: {
          coords: {
            lat: location.lat,
            lng: location.lng
          }
        }
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const location = await setLocationFromSearch(searchQuery.trim());
      if (location) {
        navigate('/discover', { 
          state: { 
            query: searchQuery.trim(),
            coords: {
              lat: location.lat,
              lng: location.lng
            }
          } 
        });
      }
    }
  };

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 pt-6 md:grid-cols-[1.4fr,1fr] md:items-center">
        <div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full glass-badge bg-emerald-100/50 dark:bg-emerald-500/20 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live parking updates in Nagpur
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Find Parking Near You –{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#4f46e5] via-[#06b6d4] to-[#4f46e5] dark:from-[#818cf8] dark:via-[#22d3ee] dark:to-[#818cf8] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] font-extrabold">
                Fast &amp; Easy
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
          >
            Discover real-time parking availability, compare prices, and book in seconds. EasyPark
            syncs with live traffic and navigation so you are always on time.
          </motion.p>

          <motion.form
            onSubmit={handleSearch}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group mt-8 flex flex-col gap-3 rounded-3xl glass-card p-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Enter location or allow location access
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Sitabuldi, MIHAN, Airport, Nagpur..."
                  className="w-full rounded-2xl glass-input pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-primary-400/50 dark:focus:border-accent-500/50 focus:bg-white/70 dark:focus:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-accent-500/20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Parking
                </span>
                <span className="absolute inset-0 -z-0 bg-gradient-to-r from-accent-500 to-primary-500 opacity-0 transition-opacity group-hover/btn:opacity-100"></span>
              </button>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLoadingLocation || !navigator.geolocation}
                className="inline-flex items-center justify-center gap-2 rounded-2xl glass-button px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-100 transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoadingLocation ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></span>
                    Detecting...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Find Near Me
                  </>
                )}
              </button>
            </div>
            
            {/* Error Messages */}
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3"
              >
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-red-800 dark:text-red-200">Location Error</p>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">{locationError}</p>
                    {locationPermission === 'denied' && (
                      <button
                        onClick={() => {
                          setLocationError('');
                          setLocationPermission(null);
                        }}
                        className="text-xs text-red-700 dark:text-red-400 underline mt-1 hover:no-underline"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {locationPermission === 'denied' && !locationError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Location permission blocked. Enable it from browser settings to use "Find Near Me".
                </div>
              </motion.p>
            )}
          </motion.form>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 grid grid-cols-3 gap-4 text-xs sm:gap-4 sm:text-sm"
          >
            {[
              {
                label: 'Live Slots',
                value: '3.2k+',
                desc: 'Updating in real time',
                color: 'emerald',
                icon: '🚗'
              },
              {
                label: 'Avg. Savings',
                value: '₹120',
                desc: 'Per 2 hour session',
                color: 'accent',
                icon: '💰'
              },
              {
                label: 'On-Time Arrivals',
                value: '94%',
                desc: 'With live navigation',
                color: 'primary',
                icon: '⏱️'
              }
            ].map((stat, idx) => {
              const colorClasses = {
                emerald: 'text-emerald-400',
                accent: 'text-accent-400',
                primary: 'text-primary-400'
              };
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="group relative overflow-hidden rounded-2xl glass-card p-4 transition-all hover:shadow-xl"
              >
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    stat.color === 'emerald' ? 'from-emerald-500/10' :
                    stat.color === 'accent' ? 'from-accent-500/10' :
                    'from-primary-500/10'
                  } to-transparent opacity-0 transition-opacity group-hover:opacity-100`}></div>
                  <div className="relative">
                    <div className="mb-2 text-2xl">{stat.icon}</div>
                    <dt className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{stat.label}</dt>
                    <dd className={`mt-1 text-xl font-bold ${colorClasses[stat.color]}`}>{stat.value}</dd>
                    <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">{stat.desc}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.dl>

          {/* New Service Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Additional Services
              </h2>
              <Link
                to="/services"
                className="text-sm text-primary-500 hover:text-primary-600 dark:text-accent-400 dark:hover:text-accent-300 font-medium transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs sm:gap-4 sm:text-sm">
              {[
                {
                  id: 'fastag',
                  label: 'FASTag Recharge',
                  desc: 'Recharge your FASTag instantly',
                  color: 'blue',
                  icon: '🛣️'
                },
                {
                  id: 'insurance',
                  label: 'Vehicle Insurance',
                  desc: 'Renew or manage your car insurance',
                  color: 'purple',
                  icon: '🛡️'
                },
                {
                  id: 'challan',
                  label: 'Challan Payment',
                  desc: 'Check and pay traffic challans',
                  color: 'orange',
                  icon: '🚨'
                }
              ].map((service, idx) => {
                const colorClasses = {
                  blue: 'text-blue-400',
                  purple: 'text-purple-400',
                  orange: 'text-orange-400'
                };
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveService(service.id)}
                    className="group service-card service-card-glow relative overflow-hidden rounded-2xl glass-card p-4 transition-all hover:shadow-xl cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      service.color === 'blue' ? 'from-blue-500/10' :
                      service.color === 'purple' ? 'from-purple-500/10' :
                      'from-orange-500/10'
                    } to-transparent opacity-0 transition-opacity group-hover:opacity-100`}></div>
                    <div className="relative">
                      <div className="mb-2 text-2xl service-icon">{service.icon}</div>
                      <dt className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{service.label}</dt>
                      <dd className={`mt-1 text-sm font-bold ${colorClasses[service.color]}`}>Available</dd>
                      <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">{service.desc}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <div className="group relative flex h-80 flex-col justify-between overflow-hidden rounded-3xl glass-card p-5 transition-all hover:shadow-2xl hover:scale-[1.02] sm:h-96">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#22d3ee15,transparent_50%),radial-gradient(circle_at_80%_70%,#4f46e515,transparent_50%)]"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Live Parking Feed</p>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-50">Nagpur City Center</p>
              </div>
              <span className="rounded-full glass-badge bg-emerald-100/50 dark:bg-emerald-500/20 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-500/30">
                18 spots free
              </span>
            </div>
            <div className="relative z-10 mt-6 flex-1 rounded-2xl glass-badge p-4">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,#22d3ee20,transparent_60%),radial-gradient(circle_at_90%_80%,#4f46e520,transparent_55%)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-3">
                      <svg className="h-full w-full text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-400">Interactive Map</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-4 flex items-center justify-between rounded-xl glass-badge px-3 py-2 text-[11px]">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                ETA with traffic
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">7–10 mins</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Service Modal */}
      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </section>
  );
}

export default Home;


