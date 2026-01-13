import { useState } from 'react';
import { motion } from 'framer-motion';

const insuranceProviders = [
  { id: 'icici', name: 'ICICI Lombard', logo: '🏦', rating: 4.5 },
  { id: 'hdfc', name: 'HDFC ERGO', logo: '🏛️', rating: 4.3 },
  { id: 'bajaj', name: 'Bajaj Allianz', logo: '🏢', rating: 4.4 },
  { id: 'tata', name: 'Tata AIG', logo: '🏪', rating: 4.2 },
  { id: 'reliance', name: 'Reliance General', logo: '🏭', rating: 4.1 },
  { id: 'oriental', name: 'Oriental Insurance', logo: '🏦', rating: 4.0 }
];

const vehicleTypes = [
  { id: 'hatchback', name: 'Hatchback', icon: '🚗' },
  { id: 'sedan', name: 'Sedan', icon: '🚙' },
  { id: 'suv', name: 'SUV', icon: '🚐' },
  { id: 'luxury', name: 'Luxury Car', icon: '🏎️' }
];

const planTypes = [
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    description: 'Complete protection including theft, accident, and third-party',
    price: 8500,
    features: ['Own Damage Cover', 'Third Party Cover', 'Personal Accident Cover', 'Zero Depreciation']
  },
  {
    id: 'thirdparty',
    name: 'Third Party',
    description: 'Basic legal requirement coverage',
    price: 2500,
    features: ['Third Party Liability', 'Legal Compliance', 'Basic Coverage']
  }
];

function VehicleInsurance({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    previousProvider: '',
    expiryDate: '',
    vehicleType: '',
    manufacturingYear: '',
    ownerName: '',
    mobileNumber: '',
    selectedPlan: '',
    selectedProvider: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [quotes, setQuotes] = useState([]);

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.vehicleNumber.trim()) {
        newErrors.vehicleNumber = 'Vehicle number is required';
      } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(formData.vehicleNumber.replace(/\s/g, ''))) {
        newErrors.vehicleNumber = 'Please enter a valid vehicle number';
      }

      if (!formData.previousProvider) {
        newErrors.previousProvider = 'Please select your previous insurance provider';
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Policy expiry date is required';
      }
    }

    if (currentStep === 2) {
      if (!formData.vehicleType) {
        newErrors.vehicleType = 'Please select vehicle type';
      }

      if (!formData.manufacturingYear) {
        newErrors.manufacturingYear = 'Manufacturing year is required';
      } else if (formData.manufacturingYear < 2000 || formData.manufacturingYear > new Date().getFullYear()) {
        newErrors.manufacturingYear = 'Please enter a valid year';
      }

      if (!formData.ownerName.trim()) {
        newErrors.ownerName = 'Owner name is required';
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step === 2) {
        setLoading(true);
        // Simulate quote generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const generatedQuotes = insuranceProviders.map(provider => ({
          ...provider,
          comprehensive: Math.floor(8000 + Math.random() * 3000),
          thirdparty: Math.floor(2000 + Math.random() * 1000)
        }));
        
        setQuotes(generatedQuotes);
        setLoading(false);
      }
      setStep(step + 1);
    }
  };

  const handlePlanSelect = (providerId, planType) => {
    setFormData({
      ...formData,
      selectedProvider: providerId,
      selectedPlan: planType
    });
    setStep(4);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep(5);
  };

  const formatVehicleNumber = (value) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
    return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 10);
  };

  if (step === 5) {
    const selectedProvider = insuranceProviders.find(p => p.id === formData.selectedProvider);
    const selectedQuote = quotes.find(q => q.id === formData.selectedProvider);
    const planPrice = selectedQuote?.[formData.selectedPlan] || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Insurance Renewed Successfully!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your vehicle insurance policy has been renewed
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Vehicle Number</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">{formData.vehicleNumber}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Premium Amount</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">₹{planPrice}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Insurance Provider</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">{selectedProvider?.name}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Policy Number</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">POL{Date.now()}</p>
            </div>
          </div>
        </div>

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
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= stepNum 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
            }`}>
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-12 h-1 mx-2 ${
                step > stepNum ? 'bg-purple-500' : 'bg-slate-200 dark:bg-slate-700'
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
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 ${
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
              Previous Insurance Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              {insuranceProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setFormData({ ...formData, previousProvider: provider.id })}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    formData.previousProvider === provider.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
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
            {errors.previousProvider && (
              <p className="text-red-500 text-xs mt-1">{errors.previousProvider}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Policy Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 ${
                errors.expiryDate ? 'border-red-500' : ''
              }`}
            />
            {errors.expiryDate && (
              <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform"
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {vehicleTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, vehicleType: type.id })}
                  className={`p-3 rounded-2xl border-2 transition-all ${
                    formData.vehicleType === type.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {type.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors.vehicleType && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicleType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Manufacturing Year
            </label>
            <input
              type="number"
              value={formData.manufacturingYear}
              onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
              placeholder="2020"
              min="2000"
              max={new Date().getFullYear()}
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 ${
                errors.manufacturingYear ? 'border-red-500' : ''
              }`}
            />
            {errors.manufacturingYear && (
              <p className="text-red-500 text-xs mt-1">{errors.manufacturingYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Owner Name
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 ${
                errors.ownerName ? 'border-red-500' : ''
              }`}
            />
            {errors.ownerName && (
              <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 ${
                errors.mobileNumber ? 'border-red-500' : ''
              }`}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 px-6 rounded-2xl glass-button text-slate-700 dark:text-slate-300 font-semibold hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Getting Quotes...
                </div>
              ) : (
                'Get Quotes'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
            Choose Your Insurance Plan
          </h3>
          
          {quotes.map((provider) => (
            <div key={provider.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{provider.logo}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">{provider.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{provider.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePlanSelect(provider.id, 'comprehensive')}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                >
                  <div className="text-left">
                    <h5 className="font-semibold text-slate-900 dark:text-slate-50">Comprehensive</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Complete protection</p>
                    <p className="text-lg font-bold text-purple-500">₹{provider.comprehensive}</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handlePlanSelect(provider.id, 'thirdparty')}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                >
                  <div className="text-left">
                    <h5 className="font-semibold text-slate-900 dark:text-slate-50">Third Party</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Basic coverage</p>
                    <p className="text-lg font-bold text-purple-500">₹{provider.thirdparty}</p>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
              Confirm Your Selection
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Review your insurance details before payment
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Vehicle</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">{formData.vehicleNumber}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Plan Type</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50 capitalize">{formData.selectedPlan}</p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Provider</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {insuranceProviders.find(p => p.id === formData.selectedProvider)?.name}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Premium</span>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  ₹{quotes.find(q => q.id === formData.selectedProvider)?.[formData.selectedPlan]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 px-6 rounded-2xl glass-button text-slate-700 dark:text-slate-300 font-semibold hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Confirm & Pay'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VehicleInsurance;