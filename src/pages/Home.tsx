import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { paintings } from '../data/paintings';
import { motion } from 'framer-motion';

const Home = () => {
  const featuredPaintings = [...paintings].sort(() => 0.5 - Math.random()).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh]">
        <div className="absolute inset-0">
          <img
            src="/images/homw photoooooo.jpeg"
            alt="Ghada El-Nagar Art Collection"
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex h-full items-center justify-center text-center text-white"
        >
          <div className="max-w-4xl px-4">
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Welcome to Ghada El-Nagar Art
            </h1>
            <p className="mb-8 text-xl md:text-2xl font-light text-gray-200">
              Where Emotion Meets Canvas
            </p>
            <Link
              to="/gallery"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Explore Collection
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
          >
            Featured Masterpieces
          </motion.h2>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPaintings.map((painting) => (
              <motion.div
                key={painting.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/gallery/${painting.id}`}
                  className="group relative block overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="aspect-square w-full">
                    <img
                      src={`/images/${painting.image}`}
                      alt={painting.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="truncate text-xl font-semibold drop-shadow-md">
                      {painting.title}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-amber-200">
                      {painting.price.toLocaleString()} EGP
                    </p>
                  </div>

                  <button 
                    className="absolute top-4 right-4 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all hover:bg-white/20"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle wishlist
                    }}
                  >
                    <Heart className="h-6 w-6 text-white" />
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">
              Our Artistic Vision
            </h2>
            <p className="mx-auto text-lg leading-relaxed text-gray-600 md:max-w-3xl md:text-xl">
              At the heart of Ghada El-Nagar Art lies a passionate commitment to 
              bridging cultural heritage with contemporary expression. Each 
              carefully curated piece in our collection tells a unique story, 
              inviting viewers to embark on a journey where traditional techniques 
              dance with modern sensibilities. We champion artists who dare to 
              redefine boundaries while honoring the timeless essence of 
              artistic craftsmanship.
            </p>
            
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {['0', '1', '2', '3'].map((tag) => (
                <span 
                  key={tag}
                  className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;