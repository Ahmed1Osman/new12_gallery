import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PaintingDetail from './pages/PaintingDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { PaymentProvider } from './context/PaymentContext';
import { AuthProvider } from './context/AuthContext';
import { PaintingProvider } from './context/PaintingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/Checkout.tsx';
import AdminDashboard from './components/AdminDashboard';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <PaymentProvider>
          <PaintingProvider>
            <Router>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    {/* Public routes accessible to all users */}
                    <Route path="/" element={<Home />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/gallery/:id" element={<PaintingDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected admin routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </PaintingProvider>
        </PaymentProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;