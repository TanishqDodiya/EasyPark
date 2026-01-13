import { useState } from 'react';
import { motion } from 'framer-motion';

const sampleChallans = [
  {
    id: 'CH001',
    challanNumber: 'MH12202400001',
    vehicleNumber: 'MH 12 AB 1234',
    violation: 'Over Speeding',
    amount: 1500,
    date: '2024-01-10',
    location: 'Sitabuldi Square, Nagpur',
    status: 'pending',
    dueDate: '2024-02-10'
  },
  {
    id: 'CH002',
    challanNumber: 'MH12202400002',
    vehicleNumber: 'MH 12 AB 1234',
    violation: 'Wrong Side Driving',
    amount: 2000,
    date: '2024-01-08',
    location: 'Civil Lines, Nagpur',
    status: 'pending',
    dueDate: '2024-02-08'
  },
  {
    id: 'CH003',
    challanNumber: 'MH12202400003',
    vehicleNumber: 'MH 12 AB 1234',
    violation: 'No Parking Zone',
    amount: 500,
    date: '2024-01-05',
    location: 'Dharampeth, Nagpur',
    status: 'pending',
    dueDate: '2024-02-05'
  }
];

const violationTypes = {
  'Over Speeding': { icon: '⚡', color: 'red' },
  'Wrong Side Driving': { icon: '🚫', color: 'red' },
  'No Parking Zone': { icon: '🚗', color: 'orange' },
  'Signal Jump': { icon: '🚦', color: 'red' },
  'No Helmet': { icon: '🪖', color: 'orange' },
  'Triple Riding': { icon: '👥', color: 'orange' }
};

function ChallanPayment({ onClose }) {
  const [step, setStep] = useState(1);
  const [searchType, setSearchType] = useState('vehicle');
  const [searchValue, setSearchValue] = useState('');
  const [challans, setChallans] = useState([]);
  const [selectedChallans, setSelectedChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateSearch = () => {
    const newErrors = {};

    if (!searchValue.trim()) {
      newErrors.searchValue = searchType === 'vehicle' 
        ? 'Vehicle number is required' 
        : 'Challan number is required';
    } else if (searchType === 'vehicle') {
      if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/.test(searchValue.replace(/\s/g, ''))) {
        newErrors.searchValue = 'Please enter a valid vehicle number';
      }
    } else if (searchType === 'challan') {
      if (!/^[A-Z]{2}[0-9]{12}$/.test(searchValue.replace(/\s/g, ''))) {
        newErrors.searchValue = 'Please enter a valid challan number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validateSearch()) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter sample challans based on search
    let foundChallans = [];
    if (searchType === 'vehicle') {
      foundChallans = sampleChallans.filter(challan => 
        challan.vehicleNumber.replace(/\s/g, '') === searchValue.replace(/\s/g, '')
      );
    } else {
      foundChallans = sampleChallans.filter(challan => 
        challan.challanNumber === searchValue.replace(/\s/g, '')
      );
    }
    
    setChallans(foundChallans);
    setLoading(false);
    setStep(2);
  };

  const handleChallanSelect = (challanId) => {
    setSelectedChallans(prev => {
      if (prev.includes(challanId)) {
        return prev.filter(id => id !== challanId);
      } else {
        return [...prev, challanId];
      }
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep(3);
  };

  const formatVehicleNumber = (value) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4);
    return cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 4) + ' ' + cleaned.slice(4, 6) + ' ' + cleaned.slice(6, 10);
  };

  const formatChallanNumber = (value) => {
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    return cleaned;
  };

  const getTotalAmount = () => {
    return selectedChallans.reduce((total, challanId) => {
      const challan = challans.find(c => c.id === challanId);
      return total + (challan?.amount || 0);
    }, 0);
  };

  const getSelectedChallansData = () => {
    return challans.filter(challan => selectedChallans.includes(challan.id));
  };

  if (step === 3) {
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
            Payment Successful!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your traffic challans have been paid successfully
          </p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-6 text-left">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Total Amount Paid</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">₹{getTotalAmount()}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Challans Paid</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">{selectedChallans.length}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Transaction ID</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">TXN{Date.now()}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Payment Date</span>
              <p className="font-semibold text-slate-900 dark:text-slate-50">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="border-t border-slate-300 dark:border-slate-600 pt-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Paid Challans:</h4>
            {getSelectedChallansData().map((challan) => (
              <div key={challan.id} className="flex justify-between items-center py-1">
                <span className="text-xs text-slate-600 dark:text-slate-400">{challan.challanNumber}</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-50">₹{challan.amount}</span>
              </div>
            ))}
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
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">
              Search Traffic Challans
            </h3>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSearchType('vehicle')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  searchType === 'vehicle'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                By Vehicle Number
              </button>
              <button
                onClick={() => setSearchType('challan')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  searchType === 'challan'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                By Challan Number
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {searchType === 'vehicle' ? 'Vehicle Number' : 'Challan Number'}
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(
                searchType === 'vehicle' 
                  ? formatVehicleNumber(e.target.value)
                  : formatChallanNumber(e.target.value)
              )}
              placeholder={searchType === 'vehicle' ? 'MH 12 AB 1234' : 'MH12202400001'}
              className={`w-full px-4 py-3 rounded-2xl glass-input text-slate-900 dark:text-slate-50 placeholder:text-slate-400 ${
                errors.searchValue ? 'border-red-500' : ''
              }`}
              maxLength={searchType === 'vehicle' ? 13 : 15}
            />
            {errors.searchValue && (
              <p className="text-red-500 text-xs mt-1">{errors.searchValue}</p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">Demo Mode</h4>
                <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                  Try searching with vehicle number "MH 12 AB 1234" to see sample challans
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            ) : (
              'Search Challans'
            )}
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Found Challans ({challans.length})
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
            >
              ← Back to Search
            </button>
          </div>

          {challans.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No Pending Challans
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Great! No traffic challans found for this {searchType}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {challans.map((challan) => {
                  const violation = violationTypes[challan.violation] || { icon: '⚠️', color: 'gray' };
                  const isSelected = selectedChallans.includes(challan.id);
                  const isOverdue = new Date(challan.dueDate) < new Date();
                  
                  return (
                    <motion.div
                      key={challan.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      onClick={() => handleChallanSelect(challan.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${
                            violation.color === 'red' ? 'bg-red-500/20 text-red-400' :
                            violation.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            <span className="text-lg">{violation.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 dark:text-slate-50">
                                {challan.violation}
                              </h4>
                              {isOverdue && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                              {challan.location}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                              <span>Challan: {challan.challanNumber}</span>
                              <span>Date: {new Date(challan.date).toLocaleDateString()}</span>
                              <span>Due: {new Date(challan.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                            ₹{challan.amount}
                          </p>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedChallans.length > 0 && (
                <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      Selected: {selectedChallans.length} challan(s)
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      Total: ₹{getTotalAmount()}
                    </span>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ₹${getTotalAmount()}`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ChallanPayment;