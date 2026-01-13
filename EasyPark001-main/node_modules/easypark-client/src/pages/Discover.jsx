import { useEffect, useMemo, useState } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParkingCard from '../components/ParkingCard';
import SkeletonCard from '../components/SkeletonCard';
import MapView from '../components/MapView';
import { useParking } from '../hooks/useParking';
import { useLocation } from '../contexts/LocationContext';

// Fallback data when database is not set up
const FALLBACK_PARKING = [
  {
    id: '1',
    name: 'Sitabuldi Metro Parking',
    address: 'Zero Mile – Sitabuldi Metro Station, Nagpur',
    lat: 21.1458,
    lng: 79.0882,
    price_per_hour: 30,
    total_slots: 50,
    available_slots: 24,
    rating: 4.6,
    is_open: true
  },
  {
    id: '2',
    name: 'MIHAN Business Park Parking',
    address: 'MIHAN IT Park, Wardha Road, Nagpur',
    lat: 21.0624,
    lng: 79.0606,
    price_per_hour: 25,
    total_slots: 100,
    available_slots: 38,
    rating: 4.4,
    is_open: true
  },
  {
    id: '3',
    name: 'Airport Multi-level Parking',
    address: 'Dr. Babasaheb Ambedkar International Airport, Nagpur',
    lat: 21.092,
    lng: 79.0556,
    price_per_hour: 40,
    total_slots: 200,
    available_slots: 52,
    rating: 4.7,
    is_open: true
  }
];

const SORT_OPTIONS = [
  { id: 'nearest', label: 'Nearest first' },
  { id: 'cheapest', label: 'Cheapest first' },
  { id: 'slots', label: 'Most available slots' },
  { id: 'rating', label: 'Highest rated' }
];

function Discover() {
  const routerLocation = useRouterLocation();
  const [sort, setSort] = useState('nearest');
  const [usingFallback, setUsingFallback] = useState(false);
  const { parking, isLoading, error, getNearbyParking, searchParking, fetchParking } = useParking();
  const { selectedLocation, userLocation, calculateDistance, searchQuery: contextSearchQuery, setSearchQuery: setContextSearchQuery } = useLocation();

  const [center, setCenter] = useState(() => {
    if (routerLocation.state?.coords) {
      return { lat: routerLocation.state.coords.lat, lng: routerLocation.state.coords.lng };
    }
    // Use selected location from context or fallback to Nagpur city center
    return selectedLocation || { lat: 21.1458, lng: 79.0882 };
  });

  const [searchQuery] = useState(() => {
    return routerLocation.state?.query || contextSearchQuery || '';
  });

  const [routerUserLocation] = useState(() => {
    return routerLocation.state?.coords || null;
  });

  // Use user location from context or router state
  const effectiveUserLocation = userLocation || routerUserLocation;

  // Update center when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      setCenter(selectedLocation);
    }
  }, [selectedLocation]);

  // Sync search query with context
  useEffect(() => {
    if (searchQuery && searchQuery !== contextSearchQuery) {
      setContextSearchQuery(searchQuery);
    }
  }, [searchQuery, contextSearchQuery, setContextSearchQuery]);

  useEffect(() => {
    const loadParkingData = async () => {
      try {
        if (effectiveUserLocation) {
          // Get nearby parking based on user location
          await getNearbyParking(effectiveUserLocation.lat, effectiveUserLocation.lng, 10);
        } else if (searchQuery) {
          // Search for parking based on query
          await searchParking(searchQuery);
        } else {
          // Get all parking locations
          await fetchParking();
        }
      } catch (err) {
        console.error('Failed to load parking data:', err);
        setUsingFallback(true);
      }
    };

    loadParkingData();
  }, [effectiveUserLocation, searchQuery]);

  // Use fallback data if database is not set up or there's an error
  const displayParking = useMemo(() => {
    if (error && error.includes('table') && error.includes('schema cache')) {
      setUsingFallback(true);
      return FALLBACK_PARKING;
    }
    
    if (parking && parking.length > 0) {
      return parking;
    }
    
    if (usingFallback) {
      return FALLBACK_PARKING;
    }
    
    return [];
  }, [parking, error, usingFallback]);

  // Function to calculate distance between two coordinates
  const calculateDistanceLocal = (lat1, lng1, lat2, lng2) => {
    return calculateDistance(lat1, lng1, lat2, lng2);
  };

  const sortedParking = useMemo(() => {
    if (!displayParking || displayParking.length === 0) return [];
    
    let items = [...displayParking];
    
    // Add distance calculation if user location is available and not already provided
    if (effectiveUserLocation && !items[0]?.distance_km) {
      items = items.map(parkingItem => ({
        ...parkingItem,
        distance: calculateDistanceLocal(
          effectiveUserLocation.lat, 
          effectiveUserLocation.lng, 
          parseFloat(parkingItem.lat), 
          parseFloat(parkingItem.lng)
        )
      }));
    }
    
    // Sort based on selected option
    switch (sort) {
      case 'cheapest':
        items.sort((a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour));
        break;
      case 'slots':
        items.sort((a, b) => b.available_slots - a.available_slots);
        break;
      case 'rating':
        items.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
        break;
      case 'nearest':
      default:
        if (effectiveUserLocation) {
          items.sort((a, b) => (a.distance_km || a.distance || 0) - (b.distance_km || b.distance || 0));
        }
        break;
    }
    
    return items;
  }, [displayParking, sort, effectiveUserLocation]);

  // Show database setup error with instructions
  if (error && error.includes('table') && error.includes('schema cache')) {
    return (
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
            <svg className="h-full w-full text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
            Database Setup Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
            The parking table hasn't been created in your Supabase database yet. Please run the database setup to continue.
          </p>
          
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Quick Setup:</h3>
            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>1. Go to your Supabase dashboard</li>
              <li>2. Open the SQL Editor</li>
              <li>3. Copy and run the SQL from <code>DATABASE_SETUP_QUICK.sql</code></li>
              <li>4. Refresh this page</li>
            </ol>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/40 transition-all hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry
            </button>
            
            <button
              onClick={() => setUsingFallback(true)}
              className="inline-flex items-center gap-2 rounded-2xl glass-button px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-100 transition-all hover:bg-white/80 dark:hover:bg-slate-800/80 hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Demo Data
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-50 sm:text-3xl"
          >
            {effectiveUserLocation ? 'Nearby parking spaces' : searchQuery ? `Parking near "${searchQuery}"` : 'Parking spaces in Nagpur'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm text-slate-400 sm:text-base"
          >
            {effectiveUserLocation 
              ? 'Showing smart recommendations using your current location, live distance, pricing, and availability.'
              : searchQuery 
                ? `Showing parking options for your search query with live pricing and availability.`
                : 'Showing smart recommendations using live distance, pricing, and availability in Nagpur.'
            }
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <span className="text-xs font-medium text-slate-400">Sort by</span>
          <div className="flex gap-1 rounded-full glass-card p-1 text-xs">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSort(opt.id)}
                className={`rounded-full px-4 py-1.5 font-medium transition-all ${
                  sort === opt.id
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/40'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.2fr,1fr] lg:gap-6">
        <div className="space-y-3">
          {isLoading && !usingFallback
            ? Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)
            : sortedParking.length > 0 
              ? sortedParking.map((p, index) => (
                  <ParkingCard
                    key={p.id}
                    parking={{
                      ...p,
                      distance: p.distance_km || p.distance || 0,
                      pricePerHour: p.price_per_hour,
                      availableSlots: p.available_slots,
                      totalSlots: p.total_slots
                    }}
                    highlighted={index === 0}
                  />
                ))
              : (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                    <svg className="h-full w-full text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    No parking spaces found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchQuery 
                      ? `No parking spaces found for "${searchQuery}". Try a different search term.`
                      : 'No parking spaces available in this area.'
                    }
                  </p>
                </div>
              )
          }
        </div>

        <div className="h-72 md:h-full">
          <MapView
            center={center}
            markers={sortedParking.map(p => ({
              ...p,
              availableSlots: p.available_slots,
              pricePerHour: p.price_per_hour
            }))}
            userLocation={effectiveUserLocation}
            enableLocationSelection={true}
            onMarkerClick={(marker) => {
              const el = document.getElementById(`parking-${marker.id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl glass-badge bg-gradient-to-r from-emerald-100/50 to-primary-100/50 dark:from-emerald-500/10 dark:to-accent-500/10 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-200 border-emerald-200/50 dark:border-emerald-500/20"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>
            {effectiveUserLocation 
              ? 'Real-time slot updates and traffic-aware ETAs from your location'
              : 'Real-time slot updates and traffic-aware ETAs'
            }
          </span>
        </div>
        <div className="flex items-center gap-3">
          {effectiveUserLocation && (
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-[10px] font-medium ring-1 ring-blue-500/30 text-blue-300">
              📍 Location detected
            </span>
          )}
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-medium ring-1 ring-emerald-500/30">
            {usingFallback ? 'Demo Data' : 'Powered by Supabase'}
          </span>
        </div>
      </motion.div>
    </section>
  );
}

export default Discover;


