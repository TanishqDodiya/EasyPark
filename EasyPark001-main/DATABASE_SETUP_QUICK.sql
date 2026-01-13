-- Quick Database Setup for EasyPark
-- Run this in your Supabase SQL Editor

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create parking table
CREATE TABLE IF NOT EXISTS public.parking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  price_per_hour DECIMAL(10, 2) NOT NULL,
  total_slots INTEGER NOT NULL,
  available_slots INTEGER NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  amenities TEXT[],
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  parking_id UUID REFERENCES public.parking(id) ON DELETE CASCADE NOT NULL,
  slot_number INTEGER,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Parking policies
CREATE POLICY "Anyone can view parking" ON public.parking
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert parking" ON public.parking
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update parking" ON public.parking
  FOR UPDATE TO authenticated USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Insert sample parking data
INSERT INTO public.parking (name, address, lat, lng, price_per_hour, total_slots, available_slots, rating) VALUES
('Sitabuldi Metro Parking', 'Zero Mile – Sitabuldi Metro Station, Nagpur', 21.1458, 79.0882, 30, 50, 24, 4.6),
('MIHAN Business Park Parking', 'MIHAN IT Park, Wardha Road, Nagpur', 21.0624, 79.0606, 25, 100, 38, 4.4),
('Airport Multi-level Parking', 'Dr. Babasaheb Ambedkar International Airport, Nagpur', 21.092, 79.0556, 40, 200, 52, 4.7),
('Civil Lines Shopping Complex', 'Civil Lines, Nagpur', 21.1525, 79.0844, 20, 75, 15, 4.2),
('Dharampeth Market Parking', 'Dharampeth, Nagpur', 21.1389, 79.0883, 25, 60, 28, 4.3)
ON CONFLICT (id) DO NOTHING;

-- Step 8: Create nearby parking function
CREATE OR REPLACE FUNCTION get_nearby_parking(
  user_lat DECIMAL, 
  user_lng DECIMAL, 
  radius_km INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  lat DECIMAL,
  lng DECIMAL,
  price_per_hour DECIMAL,
  available_slots INTEGER,
  total_slots INTEGER,
  rating DECIMAL,
  is_open BOOLEAN,
  distance_km DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.address,
    p.lat,
    p.lng,
    p.price_per_hour,
    p.available_slots,
    p.total_slots,
    p.rating,
    p.is_open,
    ROUND(
      (6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(user_lng)) + 
        sin(radians(user_lat)) * sin(radians(p.lat))
      ))::DECIMAL, 2
    ) AS distance_km
  FROM public.parking p
  WHERE p.is_open = true
    AND (
      6371 * acos(
        cos(radians(user_lat)) * cos(radians(p.lat)) * 
        cos(radians(p.lng) - radians(user_lng)) + 
        sin(radians(user_lat)) * sin(radians(p.lat))
      )
    ) <= radius_km
  ORDER BY distance_km;
END;
$$;

-- Step 9: Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();