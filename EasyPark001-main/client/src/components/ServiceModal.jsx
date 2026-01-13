import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FastagRecharge from './services/FastagRecharge';
import VehicleInsurance from './services/VehicleInsurance';
import ChallanPayment from './services/ChallanPayment';

const serviceComponents = {
  fastag: FastagRecharge,
  insurance: VehicleInsurance,
  challan: ChallanPayment
};

const serviceDetails = {
  fastag: {
    title: 'FASTag Recharge',
    icon: '🛣️',
    color: 'blue'
  },
  insurance: {
    title: 'Vehicle Insurance',
    icon: '🛡️',
    color: 'purple'
  },
  challan: {
    title: 'Challan Payment',
    icon: '🚨',
    color: 'orange'
  }
};

function ServiceModal({ service, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const ServiceComponent = serviceComponents[service];
  const details = serviceDetails[service];

  useEffect(() => {
    setIsVisible(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl glass-modal shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  details.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  details.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  <span className="text-2xl">{details.icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {details.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quick and secure service
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 rounded-full glass-button hover:bg-white/20 dark:hover:bg-slate-800/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {ServiceComponent && <ServiceComponent onClose={handleClose} />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ServiceModal;