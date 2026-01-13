import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function OAuthTest() {
  const [testResult, setTestResult] = useState('');
  const { signInWithGoogle, signInWithFacebook } = useAuth();

  const testGoogleOAuth = async () => {
    setTestResult('Testing Google OAuth...');
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setTestResult(`Google OAuth Error: ${error.message}`);
      } else {
        setTestResult('Google OAuth initiated successfully!');
      }
    } catch (err) {
      setTestResult(`Google OAuth Failed: ${err.message}`);
    }
  };

  const testFacebookOAuth = async () => {
    setTestResult('Testing Facebook OAuth...');
    try {
      const { error } = await signInWithFacebook();
      if (error) {
        setTestResult(`Facebook OAuth Error: ${error.message}`);
      } else {
        setTestResult('Facebook OAuth initiated successfully!');
      }
    } catch (err) {
      setTestResult(`Facebook OAuth Failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">OAuth Test Panel</h3>
      
      <div className="space-y-4">
        <button
          onClick={testGoogleOAuth}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Test Google OAuth
        </button>
        
        <button
          onClick={testFacebookOAuth}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Test Facebook OAuth
        </button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This component helps test OAuth configuration.</p>
        <p>Remove this component in production.</p>
      </div>
    </div>
  );
}

export default OAuthTest;