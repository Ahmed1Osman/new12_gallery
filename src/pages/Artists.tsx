import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { artistsList } from '../data/artists';

const Artists: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Artists
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artistsList.map((artist, index) => (
          <motion.div
            key={artist.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="h-48 bg-gray-200 overflow-hidden">
              <img 
                src={artist.image} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{artist.name}</h2>
              <p className="text-gray-600 mb-4">{artist.description}</p>
              <Link
                to={`/artists/${artist.slug}`}
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => console.log('Navigating to artist:', artist.slug)}
              >
                View Collection
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Artists;
