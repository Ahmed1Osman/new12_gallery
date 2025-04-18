import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Facebook, Tag, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ContactForm } from '../types';

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
    subject: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ContactForm & { subject?: string }>>({});

  // Form validation
  const validateForm = () => {
    const errors: Partial<ContactForm> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call with more realistic response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      setFormData({ name: '', email: '', message: '', subject: '' });
      setFormErrors({});
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Submission failed:', error);
      setFormErrors({ message: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Contact Us
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to bring your vision to life? Reach out and use code{' '}
            <span className="font-semibold text-indigo-600">"WEBSITE5"</span> for an exclusive 5% discount!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
              {/* Discount Banner */}
              <motion.div 
                className="mb-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <Tag className="h-8 w-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold">Special Offer</h3>
                    <p className="mt-1 text-sm">Enjoy 5% off your first order - Exclusive for website visitors!</p>
                  </div>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h2>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="h-6 w-6 text-indigo-600" />,
                    title: "Studio Location",
                    content: "157 Tanees St., Sporting, Alexandria, Egypt",
                    link: "https://maps.app.goo.gl/XYZ123"
                  },
                  {
                    icon: <Phone className="h-6 w-6 text-indigo-600" />,
                    title: "Phone",
                    content: "+20 100 273 8764",
                    link: "tel:+201002738764"
                  },
                  {
                    icon: <Mail className="h-6 w-6 text-indigo-600" />,
                    title: "Email",
                    content: "Ghadahelnagar@gmail.com",
                    link: "mailto:Ghadahelnagar@gmail.com"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="rounded-xl border p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <a
                          href={item.link}
                          className="mt-1 block text-gray-600 hover:text-indigo-600 transition-colors"
                          target={item.title === 'Studio Location' ? '_blank' : undefined}
                          rel="noopener noreferrer"
                        >
                          {item.content}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <motion.a
                    href="https://www.facebook.com/ghadaarts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Facebook className="h-6 w-6" />
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/ghadaarts" // Add your Instagram link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Instagram className="h-6 w-6" />
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Enhanced Map */}
            <motion.div 
              className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Find Us</h3>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.34567498282!2d29.9294544!3d31.2190009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDEzJzA4LjQiTiAyOcKwNTUnMzkuOCJF!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
                <motion.div 
                  className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                >
                  <a
                    href="https://maps.app.goo.gl/XYZ123"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Open in Maps
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 ${formErrors.name ? 'border-red-300' : ''}`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 ${formErrors.email ? 'border-red-300' : ''}`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 ${formErrors.subject ? 'border-red-300' : ''}`}
                  placeholder="What can we help you with?"
                  disabled={isSubmitting}
                />
                {formErrors.subject && <p className="mt-1 text-sm text-red-600">{formErrors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 ${formErrors.message ? 'border-red-300' : ''}`}
                  placeholder="Tell us about your project! Mention 'WEBSITE5' for your discount."
                  disabled={isSubmitting}
                ></textarea>
                {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-2">Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>

            {/* Success/Error Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 rounded-lg bg-green-50 p-4 text-green-700"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">Thank You!</p>
                      <p className="mt-1">Your message has been sent. Use code <span className="font-bold">WEBSITE5</span> for 5% off!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Business Hours: Monday - Saturday, 10:00 AM - 6:00 PM (EET)
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Response time: Typically within 24 hours
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;