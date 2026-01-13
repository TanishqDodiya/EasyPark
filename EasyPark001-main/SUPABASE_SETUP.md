# Supabase Integration Setup Guide

## 🚀 What's Been Integrated

Your EasyPark app now has full Supabase integration with:

- **Real Authentication**: Email/password, Google, Facebook OAuth
- **Database Operations**: Users, parking, bookings tables
- **Session Management**: Automatic token refresh and persistence
- **Error Handling**: Proper error messages and validation

## 📋 Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Wait for the project to be ready

### 2. Get Your Credentials

From your Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

### 3. Update Environment Variables

Open `client/.env` and replace the placeholder values:

```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor (copy and paste each section separately):

#### Step 1: Create Extension (if needed)
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### Step 2: Create User Profiles Table
```sql
-- Create user profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Step 3: Create Parking Table
```sql
-- Create parking table
CREATE TABLE public.parking (
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

-- Enable RLS on parking
ALTER TABLE public.parking ENABLE ROW LEVEL SECURITY;

-- Create policy for parking (public read access)
CREATE POLICY "Anyone can view parking" ON public.parking
  FOR SELECT USING (true);

-- Only authenticated users can modify parking (for admin features)
CREATE POLICY "Authenticated users can insert parking" ON public.parking
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update parking" ON public.parking
  FOR UPDATE TO authenticated USING (true);
```

#### Step 4: Create Bookings Table
```sql
-- Create bookings table
CREATE TABLE public.bookings (
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

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Step 5: Create Functions
```sql
-- Create function for nearby parking
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
```

#### Step 6: Insert Sample Data
```sql
-- Insert sample parking data
INSERT INTO public.parking (name, address, lat, lng, price_per_hour, total_slots, available_slots, rating) VALUES
('Sitabuldi Metro Parking', 'Zero Mile – Sitabuldi Metro Station, Nagpur', 21.1458, 79.0882, 30, 50, 24, 4.6),
('MIHAN Business Park Parking', 'MIHAN IT Park, Wardha Road, Nagpur', 21.0624, 79.0606, 25, 100, 38, 4.4),
('Airport Multi-level Parking', 'Dr. Babasaheb Ambedkar International Airport, Nagpur', 21.092, 79.0556, 40, 200, 52, 4.7),
('Civil Lines Shopping Complex', 'Civil Lines, Nagpur', 21.1525, 79.0844, 20, 75, 15, 4.2),
('Dharampeth Market Parking', 'Dharampeth, Nagpur', 21.1389, 79.0883, 25, 60, 28, 4.3);
```

#### Step 7: Create Triggers for Profile Creation
```sql
-- Function to create profile on user signup
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

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Set Up OAuth Providers (Google & Facebook)

#### Google OAuth Setup

1. **Create Google OAuth App**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy your **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Add your **Client ID** and **Client Secret**
   - Save configuration

#### Facebook OAuth Setup

1. **Create Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app → **Consumer** type
   - Add **Facebook Login** product
   - In Facebook Login settings, add Valid OAuth Redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Copy your **App ID** and **App Secret**

2. **Configure in Supabase**:
   - Go to **Authentication** → **Providers** → **Facebook**
   - Enable Facebook provider
   - Add your **App ID** and **App Secret**
   - Save configuration

#### Additional OAuth Configuration

3. **Update Site URL and Redirect URLs**:
   - Go to **Authentication** → **URL Configuration**
   - **Site URL**: `http://localhost:5173` (development) / `https://yourdomain.com` (production)
   - **Redirect URLs**: Add these URLs:
     ```
     http://localhost:5173/**
     https://yourdomain.com/**
     ```

4. **Test OAuth Providers**:
   - Go to your login page: `http://localhost:5173/login`
   - Click "Google" or "Facebook" buttons
   - Complete OAuth flow
   - You should be redirected to `/dashboard` after successful authentication

### 6. Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. **Site URL**: Set to `http://localhost:5173` (for development)
3. **Redirect URLs**: Add `http://localhost:5173/**`
4. **Email Templates**: Customize if needed
5. **Email Confirmation**: Enable/disable as needed

### 7. Test the Integration

1. Restart your development server
2. Go to `/signup` and create an account
3. Check your email for confirmation (if email confirmation is enabled)
4. Try logging in with your credentials
5. Test social login (if configured)

## 🔧 Features Available

### Authentication
- ✅ Email/password signup and login
- ✅ Social login (Google, Facebook)
- ✅ Email confirmation
- ✅ Password reset
- ✅ Session management
- ✅ Auto token refresh

### Database Operations
- ✅ User profile management
- ✅ Parking location queries
- ✅ Nearby parking search
- ✅ Booking management
- ✅ Real-time updates

### Security
- ✅ Row Level Security (RLS)
- ✅ JWT token authentication
- ✅ Secure API endpoints
- ✅ Data validation

## 🎯 Next Steps

1. **Add your Supabase credentials** to the `.env` file
2. **Run the SQL setup** in your Supabase dashboard (step by step)
3. **Configure OAuth providers** (optional)
4. **Test the authentication flow**
5. **Customize the database schema** as needed

## 🚨 Important Notes

- Run each SQL section separately in the Supabase SQL Editor
- Don't try to modify `auth.users` table directly
- Use `profiles` table for additional user data
- Test each step before proceeding to the next
- Check the logs if any errors occur

Your EasyPark app is now powered by Supabase with real authentication and database functionality!