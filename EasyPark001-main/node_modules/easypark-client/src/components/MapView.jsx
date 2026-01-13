import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useNotification } from '../contexts/NotificationContext';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries = ['places', 'geometry'];

// Fallback map component when Google Maps is not available
function FallbackMap({ center, markers = [], userLocation, onMarkerClick }) {
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Calculate relative positions for markers (simplified 2D projection)
  const getRelativePosition = (lat, lng) => {
    const centerLat = center.lat;
    const centerLng = center.lng;
    
    // Simple conversion to relative pixels (not geographically accurate but visual)
    const x = ((lng - centerLng) * 100000) + 50; // Center at 50%
    const y = ((centerLat - lat) * 100000) + 50; // Center at 50%
    
    return {
      left: Math.max(5, Math.min(95, x)) + '%',
      top: Math.max(5, Math.min(95, y)) + '%'
    };
  };

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-800 to-slate-900">
      {/* Map Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Streets/Roads */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 right-0 h-1 bg-slate-600/50" />
        <div className="absolute top-2/3 left-0 right-0 h-1 bg-slate-600/50" />
        <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-600/50" />
        <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-600/50" />
      </div>

      {/* User Location */}
      {userLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={getRelativePosition(userLocation.lat, userLocation.lng)}
        >
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <div className="absolute inset-0 h-4 w-4 rounded-full bg-blue-400 animate-ping opacity-75" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-300 font-medium whitespace-nowrap">
            Your Location
          </div>
        </motion.div>
      )}

      {/* Parking Markers */}
      {markers.map((marker, index) => {
        const position = getRelativePosition(marker.lat, marker.lng);
        const availableSlots = marker.availableSlots || marker.available_slots || 0;
        const color = availableSlots > 20 ? 'emerald' : availableSlots > 10 ? 'amber' : 'red';
        const colorClasses = {
          emerald: 'bg-emerald-500 border-emerald-300',
          amber: 'bg-amber-500 border-amber-300',
          red: 'bg-red-500 border-red-300'
        };

        return (
          <motion.div
            key={marker.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={position}
            onClick={() => {
              setSelectedMarker(selectedMarker === marker.id ? null : marker.id);
              onMarkerClick?.(marker);
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-6 w-6 rounded-full border-2 shadow-lg ${colorClasses[color]} relative`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
            
            {/* Marker Info Popup */}
            {selectedMarker === marker.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg p-2 shadow-xl min-w-32"
              >
                <div className="text-xs text-white font-medium">{marker.name}</div>
                <div className="text-xs text-slate-300">{availableSlots} slots</div>
                <div className="text-xs text-emerald-400">₹{marker.pricePerHour || marker.price_per_hour}/hr</div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-600 rotate-45" />
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-slate-800/80 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700/80 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="bg-slate-800/80 border border-slate-600 rounded-lg p-2 text-white hover:bg-slate-700/80 transition-colors">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/90 border border-slate-600 rounded-lg p-3">
        <div className="text-xs text-slate-300 font-medium mb-2">Availability</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">High (20+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-slate-400">Medium (10-20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs text-slate-400">Low (&lt;10)</span>
          </div>
        </div>
      </div>

      {/* Fallback Notice */}
      <div className="absolute top-4 left-4 bg-amber-900/80 border border-amber-600 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
          <span className="text-xs text-amber-200">Fallback Map View</span>
        </div>
      </div>
    </div>
  );
}

function MapView({ center, markers = [], userLocation, onMarkerClick, enableLocationSelection = false }) {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { setLocationFromMap, isLoadingLocation } = useLocation();
  const { showError, showSuccess } = useNotification();
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'your_google_maps_api_key_here' && apiKey.length > 10;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: hasValidApiKey ? apiKey : '',
    libraries
  });

  // Handle map click for location selection
  const handleMapClick = useCallback(async (event) => {
    if (!enableLocationSelection) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    try {
      const location = await setLocationFromMap(lat, lng);
      if (location) {
        showSuccess('Location selected successfully');
        
        // Place a marker at selected location
        if (selectedMarker) {
          selectedMarker.setMap(null);
        }
        
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: 'Selected Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });
        
        setSelectedMarker(marker);
      }
    } catch (error) {
      showError('Failed to select location');
    }
  }, [enableLocationSelection, setLocationFromMap, selectedMarker, map, showError, showSuccess]);

  // Update map center when location changes
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  // Handle Google Maps errors
  useEffect(() => {
    if (loadError) {
      console.warn('Google Maps failed to load:', loadError);
    }
  }, [loadError]);

  // Show fallback map if no valid API key, loading error, or Google Maps error
  if (!hasValidApiKey || loadError) {
    return <FallbackMap center={center} markers={markers} userLocation={userLocation} onMarkerClick={onMarkerClick} />;
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-white/5 bg-slate-900/80">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-accent-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
        <span className="ml-3 text-slate-400">Loading Google Maps...</span>
      </div>
    );
  }

  const mapOptions = {
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#1f2937' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca3af' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#1f2937' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#374151' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0f172a' }]
      }
    ],
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true,
    clickableIcons: true
  };

  return (
    <div className="h-full overflow-hidden rounded-3xl border border-white/5 bg-slate-900/80 relative">
      {isLoadingLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500/90 text-white px-4 py-2 rounded-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Getting location...
          </div>
        </div>
      )}
      
      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={center} 
        zoom={userLocation ? 15 : 14} 
        options={mapOptions}
        onLoad={setMap}
        onClick={handleMapClick}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={{ lat: userLocation.lat, lng: userLocation.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title="Your Location"
          />
        )}
        
        {/* Parking markers */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: parseFloat(m.lat), lng: parseFloat(m.lng) }}
            onClick={() => onMarkerClick?.(m)}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: (m.availableSlots || m.available_slots) > 20 ? '#10b981' : (m.availableSlots || m.available_slots) > 10 ? '#f59e0b' : '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 1,
            }}
            title={`${m.name} - ${m.availableSlots || m.available_slots} slots available`}
          />
        ))}
      </GoogleMap>
      
      {enableLocationSelection && (
        <div className="absolute bottom-4 right-4 bg-slate-800/90 border border-slate-600 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Click to select location
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;


