import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // Add this import
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import { PaintingProvider } from './context/PaintingContext';
import SupabaseFix from './components/SupabaseFix'; // Import the fix component

// Import components with correct paths
// Adjust these paths if needed to match your actual file structure
const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const PaintingDetail = lazy(() => import('./pages/PaintingDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Checkout = lazy(() => import('./components/Checkout'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Artists = lazy(() => import('./pages/Artists'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'));
const ArtistPaintingDetail = lazy(() => import('./pages/ArtistPaintingDetail'));

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51YOUR_TEST_KEY_HERE',
  {
    locale: 'en',
    apiVersion: '2023-10-16',
  }
).catch((error) => {
  console.error('Stripe initialization failed:', error);
  return null;
});

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Elements stripe={stripePromise}>
        <Router>
          {/* Add ScrollToTop component here - inside Router but outside everything else */}
          <ScrollToTop />
          
          <AuthProvider>
            <PaymentProvider>
              <PaintingProvider>
                <motion.div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-100">
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <motion.main
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex-grow"
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/gallery/:id" element={<PaintingDetail />} />
                        <Route path="/artists" element={<Artists />} />
                        <Route path="/artists/:artistSlug" element={<ArtistDetail />} />
                        <Route path="/artists/:artistSlug/paintings/:paintingId" element={<ArtistPaintingDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                          path="/admin"
                          element={
                            <ProtectedRoute>
                              <AdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                        {/* Add the fix route */}
                        <Route
                          path="/fix-gallery"
                          element={
                            <ProtectedRoute>
                              <SupabaseFix />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </motion.main>
                  </Suspense>
                  <Footer />
                </motion.div>
              </PaintingProvider>
            </PaymentProvider>
          </AuthProvider>
        </Router>
      </Elements>
    </ErrorBoundary>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="rounded-full h-16 w-16 border-t-4 border-indigo-600 shadow-md"
    />
  </div>
);

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => (
  <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 p-4">
    <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center space-y-6 border border-red-100">
      <motion.h2 className="text-3xl font-extrabold text-red-600">
        Oops! Something Went Wrong
      </motion.h2>
      <p className="text-gray-600">{error.message}</p>
      <motion.button
        onClick={resetErrorBoundary}
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Try Again
      </motion.button>
    </div>
  </motion.div>
);

export default App;