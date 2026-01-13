import { supabase } from '../lib/supabase';

// Parking Services
export const parkingService = {
  // Get all parking locations
  getAll: async () => {
    const { data, error } = await supabase
      .from('parking')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get parking by ID
  getById: async (id) => {
    const { data, error } = await supabase
      .from('parking')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get nearby parking
  getNearby: async (lat, lng, radius = 10) => {
    // Using PostGIS extension for geospatial queries
    const { data, error } = await supabase
      .rpc('get_nearby_parking', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radius
      });
    
    if (error) {
      // Fallback to simple query if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('parking')
        .select('*');
      
      if (fallbackError) throw fallbackError;
      
      // Calculate distance on client side
      return fallbackData.map(parking => ({
        ...parking,
        distance_km: calculateDistance(lat, lng, parking.lat, parking.lng)
      })).sort((a, b) => a.distance_km - b.distance_km);
    }
    
    return data;
  },

  // Search parking by name or address
  search: async (query) => {
    const { data, error } = await supabase
      .from('parking')
      .select('*')
      .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Create new parking location (admin only)
  create: async (parkingData) => {
    const { data, error } = await supabase
      .from('parking')
      .insert([parkingData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update parking location
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('parking')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete parking location
  delete: async (id) => {
    const { error } = await supabase
      .from('parking')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Subscribe to real-time updates
  subscribe: (callback) => {
    return supabase
      .channel('parking_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'parking' }, 
        callback
      )
      .subscribe();
  }
};

// Booking Services
export const bookingService = {
  // Get user bookings
  getUserBookings: async (userId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        parking:parking_id (
          name,
          address,
          price_per_hour
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create new booking
  create: async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        parking:parking_id (
          name,
          address,
          price_per_hour
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update booking status
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cancel booking
  cancel: async (id) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Subscribe to booking updates
  subscribe: (userId, callback) => {
    return supabase
      .channel('booking_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};

// User Services
export const userService = {
  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create user profile (called after signup)
  createProfile: async (userData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// FASTag Services
export const fastagService = {
  // Get user's FASTag accounts
  getUserFastags: async (userId) => {
    const { data, error } = await supabase
      .from('fastag_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Add FASTag account
  addAccount: async (fastagData) => {
    const { data, error } = await supabase
      .from('fastag_accounts')
      .insert([fastagData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create recharge transaction
  createRecharge: async (rechargeData) => {
    const { data, error } = await supabase
      .from('fastag_recharges')
      .insert([rechargeData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get recharge history
  getRechargeHistory: async (userId) => {
    const { data, error } = await supabase
      .from('fastag_recharges')
      .select(`
        *,
        fastag_account:fastag_account_id (
          vehicle_number,
          provider
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Challan Services
export const challanService = {
  // Search challans by vehicle number
  searchChallans: async (vehicleNumber) => {
    const { data, error } = await supabase
      .from('challans')
      .select('*')
      .eq('vehicle_number', vehicleNumber.toUpperCase())
      .eq('status', 'pending')
      .order('challan_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Pay challan
  payChallan: async (challanId, paymentData) => {
    const { data, error } = await supabase
      .from('challan_payments')
      .insert([{
        challan_id: challanId,
        ...paymentData
      }])
      .select()
      .single();
    
    if (error) throw error;

    // Update challan status
    await supabase
      .from('challans')
      .update({ status: 'paid' })
      .eq('id', challanId);
    
    return data;
  },

  // Get payment history
  getPaymentHistory: async (userId) => {
    const { data, error } = await supabase
      .from('challan_payments')
      .select(`
        *,
        challan:challan_id (
          vehicle_number,
          violation_type,
          amount,
          challan_date
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Insurance Services
export const insuranceService = {
  // Get user's insurance policies
  getUserPolicies: async (userId) => {
    const { data, error } = await supabase
      .from('insurance_policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create insurance renewal
  createRenewal: async (renewalData) => {
    const { data, error } = await supabase
      .from('insurance_renewals')
      .insert([renewalData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get renewal history
  getRenewalHistory: async (userId) => {
    const { data, error } = await supabase
      .from('insurance_renewals')
      .select(`
        *,
        policy:policy_id (
          vehicle_number,
          provider,
          policy_type
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};

// Utility function for distance calculation
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

// Real-time subscription manager
export const subscriptionManager = {
  subscriptions: new Map(),

  subscribe: (key, channel) => {
    // Unsubscribe existing if any
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key).unsubscribe();
    }
    
    this.subscriptions.set(key, channel);
    return channel;
  },

  unsubscribe: (key) => {
    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key).unsubscribe();
      this.subscriptions.delete(key);
    }
  },

  unsubscribeAll: () => {
    this.subscriptions.forEach(channel => channel.unsubscribe());
    this.subscriptions.clear();
  }
};

export default {
  parkingService,
  bookingService,
  userService,
  fastagService,
  challanService,
  insuranceService,
  subscriptionManager
};