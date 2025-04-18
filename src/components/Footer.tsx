import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  const footerLinks = {
    explore: [
      { label: 'Home', path: '/' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
    social: [
      { icon: Facebook, href: 'https://www.facebook.com/ghadaarts?mibextid=ZbWKwL', label: 'Facebook' },
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
      { icon: Instagram, href: 'https://www.instagram.com/p/DEb8FVso43I/?igsh=MWpwNWlxYTZwcDZudQ==', label: 'Instagram' },
    ],
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Brand & Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Elnagar Art Studio
            </h3>
            <div className="space-y-4 text-gray-300">
              {[
                {
                  icon: <MapPin className="h-5 w-5" />,
                  text: '157 Tanees St., Sporting, Alexandria, Egypt',
                  href: 'https://maps.app.goo.gl/XYZ123',
                },
                {
                  icon: <Phone className="h-5 w-5" />,
                  text: '+20 100 273 8764',
                  href: 'tel:+201002738764',
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  text: 'Ghadahelnagar@gmail.com',
                  href: 'mailto:Ghadahelnagar@gmail.com',
                },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center hover:text-indigo-400 transition-colors"
                  whileHover={{ x: 5 }}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {item.icon}
                  <span className="ml-3">{item.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <motion.li key={link.path} whileHover={{ x: 5 }}>
                  <Link
                    to={link.path}
                    className="flex items-center text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Connect With Us</h3>
            <div className="flex space-x-6">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-indigo-400 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Follow us for updates and exclusive offers
            </p>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex rounded-md shadow-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-l-md text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                  disabled={subscribeStatus !== 'idle'}
                  required
                />
                <motion.button
                  type="submit"
                  className="inline-flex items-center px-4 py-3 bg-indigo-600 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={subscribeStatus !== 'idle'}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
              {subscribeStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-400"
                >
                  Successfully subscribed!
                </motion.p>
              )}
              {subscribeStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-400"
                >
                  Subscription failed. Try again.
                </motion.p>
              )}
            </form>
            <p className="mt-2 text-sm text-gray-400">
              Get exclusive offers and art updates
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-gray-400"
        >
          <p className="text-sm">
            © {new Date().getFullYear()} Elnagar Art Studio. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Element */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
    </footer>
  );
};

export default Footer;