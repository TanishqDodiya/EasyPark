import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { fastagService } from '../../services/supabaseService';

const fastagProviders = [
  { id: 'paytm', name: 'Paytm Payments Bank', logo: '💳' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏛️' },
  { id: 'axis', name: 'Axis Bank', logo: '🏢' },
  { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏪' }
];

const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

function FastagRecharge({ onClose }) {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    provider: '',
    mobileNumber: '',
    amount: '',
    customAmount: '',
    paymentMethod: 'upi'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rechargeResult, setRechargeResult] = useState(null);

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Vehicle number is required';
      } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formData.vehicleNumber.replace(/\s/g, ''))) {
        newErrors.vehicleNumber = 'Please enter a valid vehicle number (e.g., MH12AB1234)';
      }

      if (!formData.provider) {
        newErrors.provider = 'Please select your FASTag provider';
      }
    }

    if (currentStep === 2) {
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      }

      if (!formData.amount && !formData.customAmount) {
        newErrors.amount = 'Please select or enter recharge amount';
      } else if (formData.amount === 'custom' && (!formData.customAmount || formData.customAmount < 100)) {
        newErrors.customAmount = 'Minimum recharge amount is ₹100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const getRechargeAmount = () => {
    return formData.amount === 'custom' ? formData.customAmount : formData.amount;
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    if (!user) {
      showError('Please login to continue');
      return;
    }

    setLoading(true);
    
    try {
      const rechargeAmount = getRechargeAmount();
      
      // Create recharge transaction in Supabase
      const rechargeData = {
        user_id: user.id,
        vehicle_number: formData.vehicleNumber.replace(/\s/g, '').toUpperCase(),
        provider: formData.provider,
        mobile_number: formData.mobileNumber,
        amount: parseInt(rechargeAmount),
        payment_method: formData.paymentMethod,
        status: 'processing',
        transaction_id: `FT${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      };

      const result = await fastagService.createRecharge(rechargeData);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, payment gateway would update the status
      // For demo, we'll simulate success
      setRechargeResult({
        ...result,
        status: 'completed',
        completed_at: new Date().toISOString()
      });
      
      setLoading(false);
      setStep(3);
      showSuccess(`FASTag recharged successfully with ₹${rechargeAmount}!`);
      
    } catch (error) {
      console.error('Recharge failed:', error);
      setLoading(false);
      setRechargeResult({
        status: 'failed',
        error: error.message
      });
      setStep(3);
      showError('Recharge failed. Please try again.');
    }
  };

  const formatVehicleNumber = (value) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
    return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 10);
  };

  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            rechargeResult?.status === 'completed' 
              ? 'bg-green-500/20' 
              : 'bg-red-500/20'
          }`}>
            {rechargeResult?.status === 'completed' ? (
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {rechargeResult?.status === 'completed' ? 'Recharge Successful!' : 'Recharge Failed'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {rechargeResult?.status === 'completed' 
              ? 'Your FASTag has been recharged successfully'
              : rechargeResult?.error || 'Something went wrong. Please try again.'
            }
          </p>
        </div>

        {rechargeResult?.status === 'completed' && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Vehicle Number</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">{formData.vehicleNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Amount</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">₹{getRechargeAmount()}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Provider</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {fastagProviders.find(p => p.id === formData.provider)?.name}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {rechargeResult?.transaction_id || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform"
        >
          Done
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= stepNum 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            }`}>
              {stepNum}
            </div>
            {stepNum < 2 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNum ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Vehicle Number
            </label>
            <input
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({
                ...formData,
                vehicleNumber: formatVehicleNumber(e.target.value)
              })}
              placeholder="MH 12 AB 1234"
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 placeholder:text-slate-400 ${
                errors.vehicleNumber ? 'border-red-500' : ''
              }`}
              maxLength={13}
            />
            {errors.vehicleNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              FASTag Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              {fastagProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setFormData({ ...formData, provider: provider.id })}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    formData.provider === provider.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{provider.logo}</span>
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-50">
                      {provider.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors.provider && (
              <p className="text-red-500 text-xs mt-1">{errors.provider}</p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform"
          >
            Continue
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({
                ...formData,
                mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
              })}
              placeholder="9876543210"
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 placeholder:text-slate-400 ${
                errors.mobileNumber ? 'border-red-500' : ''
              }`}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Recharge Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {rechargeAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setFormData({ ...formData, amount: amount.toString(), customAmount: '' })}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    formData.amount === amount.toString()
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="font-semibold text-slate-900 dark:text-slate-50">₹{amount}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFormData({ ...formData, amount: 'custom' })}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  formData.amount === 'custom'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">Custom</span>
              </button>
              {formData.amount === 'custom' && (
                <input
                  type="number"
                  value={formData.customAmount}
                  onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                  placeholder="Enter amount"
                  min="100"
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-slate-50"
                />
              )}
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
            {errors.customAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.customAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              {[
                { id: 'upi', name: 'UPI', icon: '📱' },
                { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                { id: 'wallet', name: 'Digital Wallet', icon: '👛' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                  className={`w-full p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    formData.paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg">{method.icon}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-50">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 px-6 rounded-2xl glass-button text-slate-700 dark:text-slate-300 font-semibold hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Pay ₹${getRechargeAmount()}`
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default FastagRecharge;