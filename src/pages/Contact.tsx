import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Facebook, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ContactForm } from '../types';

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowSuccess(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', message: '' });
    
    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 md:text-xl">
            Let's create something amazing together. Mention <span className="font-semibold text-indigo-600">"WEBSITE5"</span> for your exclusive 5% discount!
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              {/* Discount Banner */}
              <div className="mb-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <Tag className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">Exclusive Website Offer</h3>
                    <p className="mt-1">Get 5% off your first purchase when ordering through our website!</p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900">Contact Info</h2>
              
              <div className="mt-8 space-y-6">
                {[
                  {
                    icon: <MapPin className="h-6 w-6 text-indigo-600" />,
                    title: "Our Studio",
                    content: "157 Tanees St., Sporting, Alexandria, Egypt",
                    link: "https://maps.app.goo.gl/XYZ123" // Add actual Google Maps short URL
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
                  <div 
                    key={index}
                    className="rounded-xl border p-4 transition-all hover:border-indigo-200 hover:bg-gray-50"
                  >
                    <div className="flex items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.title}
                        </h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="mt-1 block text-gray-600 hover:text-indigo-600"
                            target={item.title === 'Our Studio' ? '_blank' : undefined}
                            rel="noopener noreferrer"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="mt-1 text-gray-600">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Facebook Link */}
              <div className="mt-8 border-t pt-8">
                <h3 className="text-lg font-medium text-gray-900">
                  Connect With Us
                </h3>
                <div className="mt-4">
                  <a
                    href="https://www.facebook.com/ghadaarts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-indigo-100 px-6 py-3 text-indigo-600 transition-all hover:bg-indigo-200"
                  >
                    <Facebook className="mr-2 h-6 w-6" />
                    <span>Follow on Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <h3 className="text-lg font-medium text-gray-900">Our Location</h3>
              <div className="mt-4 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.34567498282!2d29.9294544!3d31.2190009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDEzJzA4LjQiTiAyOcKwNTUnMzkuOCJF!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
                  width="100%"
                  height="100%"
                  className="border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Message
                </label>
                <div className="mt-1">
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="How can we help you? Don't forget to mention 'WEBSITE5' for your discount!"
                    disabled={isSubmitting}
                  ></textarea>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-all hover:bg-indigo-700 disabled:opacity-70"
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
                </button>
              </div>
            </form>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold">Message sent successfully!</p>
                    <p className="mt-1">We'll respond within 24 hours. Your 5% discount code: <span className="font-bold">WEBSITE5</span></p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;