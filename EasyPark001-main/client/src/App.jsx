import { Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import MovingColors from './components/MovingColors';
import Home from './pages/Home';
import Discover from './pages/Discover';
import ParkingDetails from './pages/ParkingDetails';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import BookSlot from './pages/BookSlot';
import SelectSlot from './pages/SelectSlot';
import Payment from './pages/Payment';
import BookingHistory from './pages/BookingHistory';
import Management from './pages/Management';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Services from './pages/Services';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-50 transition-colors duration-300 relative overflow-hidden">
              {/* Moving Colors Background */}
              <MovingColors />
              
              <Navbar />
              <main className="pt-20 pb-10 relative z-10">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/parking/:id" element={<ParkingDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Protected Routes - Require Authentication */}
                    <Route path="/parking/:id/book" element={
                      <ProtectedRoute>
                        <BookSlot />
                      </ProtectedRoute>
                    } />
                    <Route path="/parking/:id/select-slot" element={
                      <ProtectedRoute>
                        <SelectSlot />
                      </ProtectedRoute>
                    } />
                    <Route path="/parking/:id/payment" element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/booking-history" element={
                      <ProtectedRoute>
                        <BookingHistory />
                      </ProtectedRoute>
                    } />
                    
                    {/* Manager/Admin Routes */}
                    <Route path="/management" element={
                      <ProtectedRoute requireRole="manager">
                        <Management />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Only Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireRole="admin">
                        <Admin />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


