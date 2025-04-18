import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Palette, Brush, Award } from 'lucide-react';
import { paintings } from '../data/paintings';
import { motion } from 'framer-motion';

const Home = () => {
  const featuredPaintings = [...paintings].sort(() => 0.5 - Math.random()).slice(0, 4);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/homw photoooooo.jpeg"
            alt="Ghada El-Nagar Art Collection"
            className="h-full w-full object-cover object-center transform transition-transform duration-10000 group-hover:scale-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative flex h-full items-center justify-center text-center text-white px-4"
        >
          <div className="max-w-5xl">
            <motion.h1 
              variants={itemVariants}
              className="mb-6 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
            >
              Ghada El-Nagar Art
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mb-8 text-xl md:text-2xl font-light text-gray-100 max-w-3xl mx-auto"
            >
              Where Emotion Transforms into Timeless Art
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link
                to="/gallery"
                className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
              >
                Explore Collection
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Featured Masterpieces
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of extraordinary artworks
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredPaintings.map((painting) => (
              <motion.div
                key={painting.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/gallery/${painting.id}`} className="block">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={`/images/${painting.image}`}
                      alt={painting.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {painting.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{painting.type}</p>
                    <p className="mt-2 text-lg font-medium text-indigo-600">
                      {painting.price.toLocaleString()} EGP
                    </p>
                  </div>
                </Link>

                <motion.button 
                  className="absolute top-4 right-4 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to wishlist logic here
                  }}
                >
                  <Heart className="h-5 w-5 text-gray-700" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/gallery"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View Full Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Artistic Vision
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ghada El-Nagar Art celebrates the fusion of cultural heritage and contemporary creativity. 
              Each piece in our collection is a testament to the power of art to transcend boundaries, 
              weaving stories through masterful strokes and vibrant hues.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Palette className="h-8 w-8 text-indigo-600" />,
                title: "Unique Style",
                desc: "Blending tradition with modern innovation"
              },
              {
                icon: <Brush className="h-8 w-8 text-indigo-600" />,
                title: "Master Craftsmanship",
                desc: "Precision in every stroke"
              },
              {
                icon: <Award className="h-8 w-8 text-indigo-600" />,
                title: "Award-Winning",
                desc: "Recognized artistic excellence"
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Own a Masterpiece?
            </h2>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
              Use code <span className="font-semibold">WEBSITE5</span> at checkout for an exclusive 5% discount
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-xl bg-white px-8 py-4 text-lg font-medium text-indigo-600 transition-all hover:bg-indigo-50 hover:shadow-lg"
            >
              Contact Us
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;