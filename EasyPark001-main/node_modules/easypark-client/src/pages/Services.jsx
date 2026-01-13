import { useState } from 'react';
import { motion } from 'framer-motion';
import ServiceModal from '../components/ServiceModal';

const services = [
  {
    id: 'fastag',
    title: 'FASTag Recharge',
    description: 'Recharge your FASTag instantly with secure payment options',
    icon: '🛣️',
    color: 'blue',
    features: ['Instant Recharge', 'All Banks Supported', 'Secure Payment', '24/7 Available'],
    stats: { users: '2.5M+', success: '99.8%' }
  },
  {
    id: 'insurance',
    title: 'Vehicle Insurance',
    description: 'Renew or manage your car insurance with best rates',
    icon: '🛡️',
    color: 'purple',
    features: ['Compare Plans', 'Best Rates', 'Quick Renewal', 'Instant Policy'],
    stats: { users: '1.8M+', success: '99.5%' }
  },
  {
    id: 'challan',
    title: 'Challan Payment',
    description: 'Check and pay traffic challans quickly and securely',
    icon: '🚨',
    color: 'orange',
    features: ['Quick Search', 'Bulk Payment', 'Instant Receipt', 'No Extra Charges'],
    stats: { users: '3.2M+', success: '99.9%' }
  }
];

function Services() {
  const [activeService, setActiveService] = useState(null);

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full glass-badge bg-primary-100/50 dark:bg-primary-500/20 px-3 py-1 text-xs text-primary-700 dark:text-primary-300 border-primary-200/50 dark:border-primary-500/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
          </span>
          All-in-one platform
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl mb-6"
        >
          Vehicle Services
          <span className="block bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent">
            Made Simple
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-600 dark:text-slate-300"
        >
          From parking to payments, insurance to challans - manage all your vehicle needs in one place with secure, fast, and reliable services.
        </motion.p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service, index) => {
          const colorClasses = {
            blue: {
              bg: 'from-blue-500/10 to-blue-600/5',
              border: 'border-blue-500/20',
              text: 'text-blue-400',
              button: 'from-blue-500 to-blue-600'
            },
            purple: {
              bg: 'from-purple-500/10 to-purple-600/5',
              border: 'border-purple-500/20',
              text: 'text-purple-400',
              button: 'from-purple-500 to-purple-600'
            },
            orange: {
              bg: 'from-orange-500/10 to-orange-600/5',
              border: 'border-orange-500/20',
              text: 'text-orange-400',
              button: 'from-orange-500 to-orange-600'
            }
          };

          const colors = colorClasses[service.color];

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative overflow-hidden rounded-3xl glass-card p-8 transition-all hover:shadow-2xl border ${colors.border}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 transition-opacity group-hover:opacity-100`}></div>
              
              <div className="relative">
                <div className="mb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} mb-4`}>
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <svg className={`w-3 h-3 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${colors.text}`}>{service.stats.users}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active Users</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${colors.text}`}>{service.stats.success}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Success Rate</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveService(service.id)}
                  className={`w-full bg-gradient-to-r ${colors.button} text-white py-3 px-6 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg`}
                >
                  Try Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-2">Secure Payments</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bank-grade security with encrypted transactions and secure payment gateways
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-2">Instant Processing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lightning-fast processing with real-time updates and instant confirmations
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-card">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-slate-900 dark:text-slate-50 mb-2">24/7 Support</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Round-the-clock customer support for all your queries and assistance
            </p>
          </div>
        </div>
      </motion.div>

      {/* Service Modal */}
      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </section>
  );
}

export default Services;