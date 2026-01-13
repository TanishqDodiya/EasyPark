# 🔧 OAuth Error Fix - "Provider is not enabled"

## 🚨 Error Explanation

The error `"Unsupported provider: provider is not enabled"` occurs because:
- Google and Facebook OAuth providers are not enabled in your Supabase project
- The social login buttons are trying to authenticate but the providers aren't configured

## ⚡ Quick Fix (2 minutes)

### Option 1: Enable Providers in Supabase

1. **Go to Supabase Dashboard**:
   - Visit [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Enable Google Provider**:
   - Go to **Authentication** → **Providers**
   - Find **Google** and toggle it **ON**
   - Use temporary credentials:
     - Client ID: `dummy-google-client-id`
     - Client Secret: `dummy-google-secret`
   - Click **Save**

3. **Enable Facebook Provider**:
   - Find **Facebook** and toggle it **ON**
   - Use temporary credentials:
     - App ID: `dummy-facebook-app-id`
     - App Secret: `dummy-facebook-secret`
   - Click **Save**

### Option 2: Use Email/Password Only

The app now has better error handling. If OAuth providers aren't configured:
- Social login buttons will show a warning message
- Users can still use email/password authentication
- The app won't crash

## ✅ What I've Fixed

1. **Better Error Handling**:
   - Login/Signup pages now catch OAuth errors gracefully
   - Show user-friendly messages when providers aren't configured
   - App continues to work with email/password authentication

2. **Improved User Experience**:
   - Clear error messages explaining the issue
   - Guidance to use email/password login instead
   - No more app crashes from OAuth errors

## 🧪 Test the Fix

1. **Go to Login Page**: `http://localhost:5173/login`
2. **Try Social Login**: Click Google or Facebook button
3. **See Error Message**: Should show friendly error instead of crashing
4. **Use Email/Password**: Regular login should work fine

## 🎯 Next Steps

### For Development (Recommended)
Enable the providers in Supabase with dummy credentials (as shown above). This will:
- Stop the error from occurring
- Allow you to test the OAuth flow
- Keep the social login buttons functional

### For Production
Set up real OAuth credentials:
- Google: [console.cloud.google.com](https://console.cloud.google.com/)
- Facebook: [developers.facebook.com](https://developers.facebook.com/)
- Follow the detailed guides in `OAUTH_SETUP_GUIDE.md`

## 🔧 Current Status

✅ **Fixed**: App no longer crashes on OAuth errors
✅ **Working**: Email/password authentication
✅ **Ready**: Social login UI with proper error handling
⏳ **Pending**: OAuth provider configuration in Supabase

Your app is now stable and users can authenticate with email/password while you set up OAuth providers! 🚀