import { useState, useEffect } from 'react';
import { parkingService, bookingService, userService } from '../services/supabaseService';

export const useParking = () => {
  const [parking, setParking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParking = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parkingService.getAll();
      setParking(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching parking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParking();
  }, []);

  const getNearbyParking = async (lat, lng, radius = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parkingService.getNearby(lat, lng, radius);
      setParking(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching nearby parking:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const searchParking = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parkingService.search(query);
      setParking(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error searching parking:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getParkingById = async (id) => {
    try {
      const data = await parkingService.getById(id);
      return data;
    } catch (err) {
      console.error('Error fetching parking by ID:', err);
      return null;
    }
  };

  return {
    parking,
    isLoading,
    error,
    fetchParking,
    getNearbyParking,
    searchParking,
    getParkingById,
    refetch: fetchParking
  };
};

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async (userId) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await bookingService.getUserBookings(userId);
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const data = await bookingService.create(bookingData);
      
      // Refresh bookings list
      if (bookingData.user_id) {
        fetchBookings(bookingData.user_id);
      }
      
      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  const cancelBooking = async (bookingId, userId) => {
    try {
      const data = await bookingService.cancel(bookingId);
      
      // Refresh bookings list
      if (userId) {
        fetchBookings(userId);
      }
      
      return data;
    } catch (err) {
      console.error('Error cancelling booking:', err);
      throw err;
    }
  };

  const updateBookingStatus = async (bookingId, status, userId) => {
    try {
      const data = await bookingService.updateStatus(bookingId, status);
      
      // Refresh bookings list
      if (userId) {
        fetchBookings(userId);
      }
      
      return data;
    } catch (err) {
      console.error('Error updating booking status:', err);
      throw err;
    }
  };

  const getActiveBookings = async (userId) => {
    if (!userId) return [];
    
    try {
      const allBookings = await bookingService.getUserBookings(userId);
      return allBookings.filter(booking => 
        booking.status === 'active' || booking.status === 'confirmed'
      );
    } catch (err) {
      console.error('Error fetching active bookings:', err);
      return [];
    }
  };

  const getUpcomingBookings = async (userId) => {
    if (!userId) return [];
    
    try {
      const allBookings = await bookingService.getUserBookings(userId);
      const now = new Date();
      return allBookings.filter(booking => 
        new Date(booking.start_time) > now && booking.status !== 'cancelled'
      );
    } catch (err) {
      console.error('Error fetching upcoming bookings:', err);
      return [];
    }
  };

  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    updateBookingStatus,
    getActiveBookings,
    getUpcomingBookings,
    refetch: fetchBookings
  };
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await userService.getProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId, updates) => {
    try {
      const data = await userService.updateProfile(userId, updates);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const createProfile = async (userData) => {
    try {
      const data = await userService.createProfile(userData);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error creating profile:', err);
      throw err;
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    createProfile,
    refetch: fetchProfile
  };
};