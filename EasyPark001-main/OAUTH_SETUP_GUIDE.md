# OAuth Setup Guide - Google & Facebook Login

## 🚀 Overview

Your EasyPark app already has Google and Facebook login buttons implemented. You just need to configure the OAuth providers in their respective platforms and connect them to Supabase.

## 📋 Google OAuth Setup

### Step 1: Create Google OAuth Application

1. **Go to Google Cloud Console**:
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select Project**:
   - Click on the project dropdown at the top
   - Create a new project or select an existing one
   - Name it something like "EasyPark App"

3. **Enable APIs**:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" if available

4. **Create OAuth Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
   - If prompted, configure the OAuth consent screen first:
     - Choose **External** user type
     - Fill in app name: "EasyPark"
     - Add your email as developer contact
     - Save and continue through the steps

5. **Configure OAuth Client**:
   - Application type: **Web application**
   - Name: "EasyPark Web Client"
   - **Authorized redirect URIs**: Add this URL (replace with your Supabase project URL):
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Click **CREATE**

6. **Copy Credentials**:
   - Copy the **Client ID** and **Client Secret**
   - Keep these safe - you'll need them for Supabase

### Step 2: Configure Google in Supabase

1. **Open Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Providers**

2. **Enable Google Provider**:
   - Find **Google** in the list and click to expand
   - Toggle **Enable sign in with Google** to ON
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - Click **Save**

## 📘 Facebook OAuth Setup

### Step 1: Create Facebook Application

1. **Go to Facebook Developers**:
   - Visit [Facebook for Developers](https://developers.facebook.com/)
   - Sign in with your Facebook account

2. **Create New App**:
   - Click **Create App**
   - Choose **Consumer** as the app type
   - Fill in details:
     - App name: "EasyPark"
     - App contact email: your email
   - Click **Create App**

3. **Add Facebook Login Product**:
   - In your app dashboard, click **Add Product**
   - Find **Facebook Login** and click **Set Up**
   - Choose **Web** platform

4. **Configure Facebook Login**:
   - Go to **Facebook Login** → **Settings**
   - In **Valid OAuth Redirect URIs**, add:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     ```
   - Save changes

5. **Get App Credentials**:
   - Go to **Settings** → **Basic**
   - Copy your **App ID** and **App Secret**
   - Keep these safe for Supabase configuration

### Step 2: Configure Facebook in Supabase

1. **Open Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to **Authentication** → **Providers**

2. **Enable Facebook Provider**:
   - Find **Facebook** in the list and click to expand
   - Toggle **Enable sign in with Facebook** to ON
   - Paste your **App ID** from Facebook
   - Paste your **App Secret** from Facebook
   - Click **Save**

## ⚙️ Supabase URL Configuration

### Configure Redirect URLs

1. **Go to Authentication Settings**:
   - In Supabase dashboard: **Authentication** → **URL Configuration**

2. **Set Site URL**:
   - **Development**: `http://localhost:5173`
   - **Production**: `https://yourdomain.com`

3. **Add Redirect URLs**:
   ```
   http://localhost:5173/**
   https://yourdomain.com/**
   ```

4. **Save Configuration**

## 🧪 Testing OAuth Integration

### Test Google Login

1. **Start Your App**:
   ```bash
   npm run dev
   ```

2. **Go to Login Page**:
   - Navigate to `http://localhost:5173/login`

3. **Click Google Button**:
   - Click the "Google" button
   - You should be redirected to Google's OAuth page
   - Sign in with your Google account
   - You should be redirected back to your app at `/dashboard`

### Test Facebook Login

1. **Click Facebook Button**:
   - On the login page, click the "Facebook" button
   - You should be redirected to Facebook's OAuth page
   - Sign in with your Facebook account
   - You should be redirected back to your app at `/dashboard`

## 🔧 Troubleshooting

### Common Issues

1. **"Redirect URI Mismatch"**:
   - Make sure the redirect URI in Google/Facebook matches exactly:
   - `https://your-project-id.supabase.co/auth/v1/callback`

2. **"App Not Approved" (Facebook)**:
   - For development, add your Facebook account as a test user
   - Go to **Roles** → **Test Users** in Facebook app dashboard

3. **"OAuth Error"**:
   - Check that your Client ID/App ID and Secret are correct
   - Ensure the provider is enabled in Supabase
   - Verify redirect URLs are configured properly

4. **"CORS Error"**:
   - Make sure your site URL is configured in Supabase
   - Check that redirect URLs include your domain

### Development vs Production

**Development**:
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

**Production**:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/**`
- Update OAuth apps with production URLs

## 🎯 What Happens After Setup

Once configured, your users can:

1. **Click Social Login Buttons**: Google or Facebook buttons on login/signup pages
2. **OAuth Flow**: Redirected to provider for authentication
3. **Account Creation**: Automatic account creation in Supabase
4. **Profile Creation**: Automatic profile creation in your `profiles` table
5. **Dashboard Redirect**: Redirected to `/dashboard` after successful login

## 📱 Mobile App Considerations

If you plan to create a mobile app later:

1. **Google**: Add your mobile app's package name and SHA-1 fingerprint
2. **Facebook**: Configure mobile app settings in Facebook dashboard
3. **Supabase**: Add mobile redirect schemes

## 🔒 Security Best Practices

1. **Keep Secrets Safe**: Never commit OAuth secrets to version control
2. **Use Environment Variables**: Store secrets in environment variables
3. **Restrict Domains**: Only allow your domains in OAuth configurations
4. **Regular Rotation**: Rotate OAuth secrets periodically
5. **Monitor Usage**: Check OAuth usage in provider dashboards

Your social login is now ready to use! Users can sign in with Google or Facebook with just one click.