import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.booking || {};
  const [step, setStep] = useState('payment'); // payment -> processing -> success
  const [paymentMethod, setPaymentMethod] = useState(bookingData.paymentMethod || 'upi');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (!bookingData.date || !bookingData.time) {
      // Redirect back if no booking data
      navigate(`/parking/${id}/book`);
    }
  }, [bookingData, id, navigate]);

  const calculateTotal = () => {
    const basePrice = 50; // ₹50 per hour
    return basePrice * (bookingData.hours || 2);
  };

  const handlePayment = () => {
    const idFragment = Date.now().toString().slice(-6);
    const newId = `EP-${idFragment}`;
    setBookingId(newId);
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Auto-download e-ticket
      try {
        const content = [
          '═══════════════════════════════════════',
          '         EasyPark e-Ticket',
          '═══════════════════════════════════════',
          '',
          `Booking ID: ${newId}`,
          `Parking Location: ${bookingData.parkingName || 'Sitabuldi Metro Parking'}`,
          `Parking ID: ${id}`,
          '',
          'Booking Details:',
          `  Date: ${bookingData.date || 'Today'}`,
          `  Time: ${bookingData.time || '-'}`,
          `  Duration: ${bookingData.hours || 2} hours`,
          '',
          'Vehicle Details:',
          `  Type: ${bookingData.type || 'Car'}`,
          `  Number: ${bookingData.vehicle || '-'}`,
          '',
          'Parking Slot:',
          `  Level: ${bookingData.level || 'B1'}`,
          `  Slot Number: ${bookingData.slot || '12'}`,
          '',
          'Payment:',
          `  Method: ${paymentMethod.toUpperCase()}`,
          `  Amount: ₹${calculateTotal()}`,
          `  Status: Paid`,
          '',
          '═══════════════════════════════════════',
          'Show this ticket at entry and exit gates',
          '═══════════════════════════════════════'
        ].join('\n');
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `easypark-ticket-${newId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download failed:', err);
      }
      
      setStep('success');
    }, 2000);
  };

  if (step === 'success') {
    return (
      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 rounded-3xl glass-modal border-emerald-500/40 dark:border-emerald-500/40 p-6 text-sm text-slate-900 dark:text-slate-100 shadow-2xl shadow-emerald-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Payment Successful
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-50">Booking Confirmed!</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-right">
              <p className="text-[10px] text-slate-400">Booking ID</p>
              <p className="text-sm font-mono font-semibold text-emerald-300">{bookingId}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/80 p-4">
            <p className="mb-3 text-xs font-semibold text-slate-300">Your e-Ticket</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-medium">
                  {bookingData.date || 'Today'} at {bookingData.time || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span>{bookingData.hours || 2} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle</span>
                <span>
                  {bookingData.type || 'Car'} • {bookingData.vehicle || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slot</span>
                <span className="font-semibold text-emerald-300">
                  Level {bookingData.level || 'B1'} • Slot {bookingData.slot || '12'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-semibold">₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-400/60 bg-slate-950/80 p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/80 to-accent-400/80">
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded bg-slate-900" />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-200">QR Code</p>
              <p className="mt-1 text-[10px] text-slate-400">
                Scan at entry and exit gates for automatic barrier opening
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/parking/${id}`)}
              className="flex-1 rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-xs font-medium text-slate-100 hover:bg-slate-900"
            >
              Back to Parking
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-primary-500/40"
            >
              View Dashboard
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-500">
            Your e-ticket has been downloaded automatically. Check your downloads folder.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <header>
          <h1 className="text-2xl font-semibold text-slate-50">Complete Payment</h1>
          <p className="mt-1 text-xs text-slate-400">
            Review your booking and choose a payment method
          </p>
        </header>

        {/* Booking Summary */}
        <div className="rounded-3xl glass-card p-5 text-xs">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Booking Summary
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Parking Location</span>
              <span className="font-medium">{bookingData.parkingName || 'Sitabuldi Metro Parking'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time</span>
              <span className="font-medium">
                {bookingData.date || 'Today'} • {bookingData.time || '--:--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration</span>
              <span>{bookingData.hours || 2} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Vehicle</span>
              <span>
                {bookingData.type || 'Car'} • {bookingData.vehicle || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Slot</span>
              <span className="font-semibold text-accent-300">
                Level {bookingData.level || 'B1'} • Slot {bookingData.slot || '12'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm font-semibold text-slate-200">Total Amount</span>
              <span className="text-lg font-bold text-accent-400">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-3xl glass-card p-5 text-xs">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Select Payment Method
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: 'upi',
                label: 'UPI',
                icon: '₹',
                desc: 'GPay / PhonePe',
                color: 'from-blue-500 to-blue-600'
              },
              {
                id: 'card',
                label: 'Card',
                icon: '💳',
                desc: 'Debit / Credit',
                color: 'from-purple-500 to-purple-600'
              },
              {
                id: 'qr',
                label: 'QR Code',
                icon: '▢',
                desc: 'Scan & Pay',
                color: 'from-green-500 to-green-600'
              }
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 transition-all ${
                  paymentMethod === method.id
                    ? `border-accent-400 bg-gradient-to-br ${method.color} text-white shadow-lg`
                    : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-xs font-semibold">{method.label}</span>
                <span className="text-[9px] text-slate-400">{method.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details based on method */}
        <AnimatePresence mode="wait">
          {paymentMethod === 'upi' && (
            <motion.div
              key="upi"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-3xl glass-card p-5 text-xs"
            >
              <p className="mb-3 text-xs font-semibold text-slate-300">UPI Payment</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., yourname@paytm)"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">
                  You'll be redirected to your UPI app to complete payment
                </p>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-3xl glass-card p-5 text-xs"
            >
              <p className="mb-3 text-xs font-semibold text-slate-300">Card Payment</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-accent-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Secure payment gateway. Your card details are encrypted.
                </p>
              </div>
            </motion.div>
          )}

          {paymentMethod === 'qr' && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-3xl glass-card p-5 text-xs"
            >
              <p className="mb-3 text-xs font-semibold text-slate-300">QR Code Payment</p>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 rounded ${
                          Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-center text-[10px] text-slate-500">
                  Scan this QR code with your payment app to pay ₹{calculateTotal()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/parking/${id}/book`, { state: { booking: bookingData } })}
            className="flex-1 rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-xs font-medium text-slate-100 hover:bg-slate-900"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={step === 'processing'}
            className="flex-1 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {step === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing Payment...
              </span>
            ) : (
              `Pay ₹${calculateTotal()}`
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-500">
          This is a demo. No real payment will be processed.
        </p>
      </motion.div>
    </section>
  );
}

export default Payment;

