# OAuth Setup Checklist ✅

## Quick Setup Checklist for Google & Facebook Login

### 🔵 Google OAuth Setup

- [ ] **Google Cloud Console**
  - [ ] Create/select project
  - [ ] Enable Google+ API
  - [ ] Create OAuth 2.0 Client ID
  - [ ] Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
  - [ ] Copy Client ID and Client Secret

- [ ] **Supabase Configuration**
  - [ ] Go to Authentication → Providers → Google
  - [ ] Enable Google provider
  - [ ] Add Client ID and Client Secret
  - [ ] Save configuration

### 🔵 Facebook OAuth Setup

- [ ] **Facebook Developers**
  - [ ] Create new app (Consumer type)
  - [ ] Add Facebook Login product
  - [ ] Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
  - [ ] Copy App ID and App Secret

- [ ] **Supabase Configuration**
  - [ ] Go to Authentication → Providers → Facebook
  - [ ] Enable Facebook provider
  - [ ] Add App ID and App Secret
  - [ ] Save configuration

### 🔵 Supabase URL Configuration

- [ ] **Authentication → URL Configuration**
  - [ ] Set Site URL: `http://localhost:5173` (dev) or `https://yourdomain.com` (prod)
  - [ ] Add Redirect URLs: `http://localhost:5173/**` and `https://yourdomain.com/**`
  - [ ] Save configuration

### 🔵 Testing

- [ ] **Test Google Login**
  - [ ] Go to `http://localhost:5173/login`
  - [ ] Click Google button
  - [ ] Complete OAuth flow
  - [ ] Verify redirect to `/dashboard`

- [ ] **Test Facebook Login**
  - [ ] Click Facebook button on login page
  - [ ] Complete OAuth flow
  - [ ] Verify redirect to `/dashboard`

### 🔵 Verification

- [ ] **Check User Creation**
  - [ ] Login with Google/Facebook
  - [ ] Check Supabase Authentication → Users
  - [ ] Verify user appears in list
  - [ ] Check `profiles` table has user data

- [ ] **Check Error Handling**
  - [ ] Try canceling OAuth flow
  - [ ] Verify error messages appear
  - [ ] Check console for any errors

## 🚨 Important Notes

1. **Replace Placeholder URLs**: Make sure to replace `your-project-id` with your actual Supabase project ID
2. **Development vs Production**: Update URLs when deploying to production
3. **Keep Secrets Safe**: Never commit OAuth secrets to version control
4. **Test Both Providers**: Make sure both Google and Facebook work correctly

## 🎯 Expected Behavior

After successful setup:
- ✅ Google button redirects to Google OAuth
- ✅ Facebook button redirects to Facebook OAuth
- ✅ Successful login creates user in Supabase
- ✅ User is redirected to `/dashboard`
- ✅ User profile is automatically created
- ✅ User can sign out and sign back in

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all URLs match exactly
3. Ensure OAuth apps are properly configured
4. Check Supabase logs for authentication errors

Your social login should work perfectly once all items are checked! ✨