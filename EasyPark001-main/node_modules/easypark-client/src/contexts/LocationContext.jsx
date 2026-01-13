import { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { showError, showSuccess } = useNotification();

  // Default location (Nagpur city center)
  const defaultLocation = {
    lat: 21.1458,
    lng: 79.0882,
    address: 'Nagpur, Maharashtra, India'
  };

  // Initialize with default location
  useEffect(() => {
    if (!selectedLocation) {
      setSelectedLocation(defaultLocation);
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      showError('Geolocation not supported');
      return null;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Get address using reverse geocoding
      const address = await reverseGeocode(location.lat, location.lng);
      const locationWithAddress = { ...location, address };

      setUserLocation(locationWithAddress);
      setSelectedLocation(locationWithAddress);
      showSuccess('Location detected successfully');
      
      return locationWithAddress;
    } catch (error) {
      let errorMessage = 'Failed to get location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred while retrieving location.';
          break;
      }
      
      setLocationError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      if (!window.google?.maps?.Geocoder) {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });

      return response.formatted_address;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Forward geocoding to get coordinates from address
  const geocodeAddress = async (address) => {
    try {
      if (!window.google?.maps?.Geocoder) {
        throw new Error('Google Maps not loaded');
      }

      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { address },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Address not found'));
            }
          }
        );
      });

      const location = response.geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng(),
        address: response.formatted_address
      };
    } catch (error) {
      console.warn('Geocoding failed:', error);
      throw error;
    }
  };

  // Set location from map click
  const setLocationFromMap = async (lat, lng) => {
    setIsLoadingLocation(true);
    try {
      const address = await reverseGeocode(lat, lng);
      const location = { lat, lng, address };
      setSelectedLocation(location);
      setSearchQuery(address);
      return location;
    } catch (error) {
      showError('Failed to get address for selected location');
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Set location from search
  const setLocationFromSearch = async (query) => {
    if (!query.trim()) return null;

    setIsLoadingLocation(true);
    setSearchQuery(query);
    
    try {
      const location = await geocodeAddress(query);
      setSelectedLocation(location);
      showSuccess('Location found successfully');
      return location;
    } catch (error) {
      showError('Location not found. Please try a different search.');
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const value = {
    selectedLocation,
    userLocation,
    isLoadingLocation,
    locationError,
    searchQuery,
    setSearchQuery,
    getCurrentLocation,
    setLocationFromMap,
    setLocationFromSearch,
    reverseGeocode,
    geocodeAddress,
    calculateDistance,
    defaultLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;