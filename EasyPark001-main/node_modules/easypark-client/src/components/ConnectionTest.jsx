import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { testConnection } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { showSuccess, showError } = useNotification();

  const testSupabaseConnection = async () => {
    setConnectionStatus('testing');
    setError(null);

    try {
      const result = await testConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        showSuccess('Supabase connection successful');
      } else {
        setConnectionStatus('failed');
        setError(result.error?.message || 'Connection failed');
        showError('Supabase connection failed');
      }
    } catch (err) {
      setConnectionStatus('failed');
      setError(err.message);
      showError('Supabase connection error');
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    testSupabaseConnection();
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return (
          <motion.div
            className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
        );
      case 'connected':
        return (
          <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...';
      case 'connected':
        return 'Connected to Supabase';
      case 'failed':
        return 'Connection failed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'text-blue-600 dark:text-blue-400';
      case 'connected':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass-card p-4 border border-white/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              Supabase Connection
            </h3>
            <p className={`text-sm ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        {connectionStatus === 'failed' && (
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                Connection Error
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
              {retryCount > 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Retry attempts: {retryCount}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {connectionStatus === 'connected' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 border border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Successfully connected to Supabase database
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ConnectionTest;