import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function SocialLoginButtons({ mode = 'login' }) {
  const [googleError, setGoogleError] = useState(false);
  const [facebookError, setFacebookError] = useState(false);
  const { signInWithGoogle, signInWithFacebook, isLoading } = useAuth();

  const handleGoogleClick = async () => {
    try {
      setGoogleError(false);
      const { error } = await signInWithGoogle();
      if (error && error.message.includes('provider is not enabled')) {
        setGoogleError(true);
      }
    } catch (err) {
      setGoogleError(true);
    }
  };

  const handleFacebookClick = async () => {
    try {
      setFacebookError(false);
      const { error } = await signInWithFacebook();
      if (error && error.message.includes('provider is not enabled')) {
        setFacebookError(true);
      }
    } catch (err) {
      setFacebookError(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/70 dark:bg-slate-900/70 px-4 text-slate-500 dark:text-slate-400">
            Or {mode} with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl glass-iridescent-button px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-100 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        
        <button
          type="button"
          onClick={handleFacebookClick}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl glass-iridescent-button px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-100 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative z-10"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* Error Messages */}
      {(googleError || facebookError) && (
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-xs font-medium text-amber-800 dark:text-amber-200">Social Login Not Available</p>
              <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                Social login providers are not configured yet. Please use email/password {mode} for now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialLoginButtons;