import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Brush, Award, Sparkles, Star, Users, Heart } from 'lucide-react';
import { paintings } from '../data/paintings';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const Home = () => {
  // Create a ref for the featured artists section
  const featuredArtistsRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to featured artists
  const scrollToFeaturedArtists = () => {
    featuredArtistsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  // Get 3 random paintings for the featured section
  const featuredPaintings = [...paintings].sort(() => 0.5 - Math.random()).slice(0, 3);

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
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/homw photoooooo.jpeg"
            alt="El-Nagar Atelier - A World of Artistic Wonders"
            className="h-full w-full object-cover object-center transform transition-all duration-1000 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative flex h-full items-center justify-center text-center px-4"
        >
          <div className="max-w-6xl">
            <motion.div 
              variants={itemVariants}
              className="inline-block mb-6 px-4 py-2 bg-indigo-100/20 backdrop-blur-sm rounded-full border border-white/20"
            >
              <p className="text-indigo-200 font-medium flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Welcome to El-Nagar Atelier
              </p>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200"
            >
              Where Art Comes to Life
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mb-8 text-xl md:text-2xl font-light text-gray-100 max-w-3xl mx-auto leading-relaxed"
            >
              Step into a world where colors dance, emotions speak, and every stroke tells a story.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/gallery"
                className="group inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95"
              >
                Explore My Gallery
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center justify-center rounded-xl bg-white/10 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:scale-95"
              >
                Meet the Artist
                <Users className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={scrollToFeaturedArtists}
                className="group inline-flex items-center justify-center rounded-xl bg-indigo-500/20 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-indigo-500/30 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 active:scale-95 border border-indigo-400/30"
              >
                Explore Other Artists
                <Palette className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex flex-wrap justify-center gap-6 opacity-90"
            >
              <div className="flex items-center text-white/80">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span>Original Artworks</span>
              </div>
              <div className="flex items-center text-white/80">
                <Palette className="h-5 w-5 text-indigo-300 mr-2" />
                <span>Unique Styles</span>
              </div>
              <div className="flex items-center text-white/80">
                <Heart className="h-5 w-5 text-rose-400 mr-2" />
                <span>Handcrafted with Love</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scrolling indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -10]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 flex flex-col items-center"
        >
          <span className="text-sm mb-2">Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <motion.div 
              className="w-1 h-2 bg-white rounded-full"
              animate={{ 
                y: [0, 8, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                Featured Collection
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
              My Latest Creations
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A glimpse into my artistic journey, one brushstroke at a time
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

      {/* My Artistic Journey */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-white via-indigo-50 to-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                The Artist's Touch
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              My Creative Universe
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Welcome to my world where colors dance and emotions take form. Each piece I create is a 
              conversation between my soul and the canvas, blending cultural heritage with contemporary 
              vision in a way that's uniquely mine.
            </p>
          </motion.div>

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Palette className="h-8 w-8 text-indigo-600" />,
                  title: "My Signature Style",
                  desc: "A unique blend of traditional techniques and contemporary vision that makes each piece unmistakably mine.",
                  emoji: "🎨"
                },
                {
                  icon: <Brush className="h-8 w-8 text-indigo-600" />,
                  title: "Creative Process",
                  desc: "Every artwork begins with a spark of inspiration and evolves through layers of emotion and technique.",
                  emoji: "✨"
                },
                {
                  icon: <Award className="h-8 w-8 text-indigo-600" />,
                  title: "Artistic Philosophy",
                  desc: "I believe art should move you, challenge you, and stay with you long after you've looked away.",
                  emoji: "💫"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-indigo-100 rounded-xl mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <span className="text-2xl">{feature.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section ref={featuredArtistsRef} className="py-20 md:py-28 bg-gradient-to-br from-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 group"
          >
            <Link to="/artists" className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4 group-hover:bg-indigo-200 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                Featured Artists
              </span>
            </Link>
            <Link to="/artists" className="block">
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                Discover More Talent
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto group-hover:text-gray-800 transition-colors">
                While you're here, explore these incredible artists I admire
              </p>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Wagih Yassa",
                image: "/images/wagihhhh.jpeg",
                bio: "Contemporary artist known for vibrant abstract expressions",
                slug: "wagih-yassa"
              },
              {
                name: "Mohamed Abla",
                image: "/images/artist2.jpg",
                bio: "Master of modern Egyptian art with a satirical edge",
                slug: "mohamed-abla"
              },
              {
                name: "Gazbia Sirry",
                image: "/images/artist3.jpg",
                bio: "Pioneering Egyptian painter with a focus on feminist themes",
                slug: "gazbia-sirry"
              }
            ].map((artist, index) => (
              <motion.div
                key={artist.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                  <p className="text-gray-600 mb-4">{artist.bio}</p>
                  <Link 
                    to={`/artists/${artist.slug}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
                  >
                    View Gallery
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/artists"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg"
            >
              Explore All Artists
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Art Journey?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Whether you're looking to add to your collection or commission a custom piece, I'd love to create something special for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 bg-white rounded-xl hover:bg-gray-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all"
              >
                Get in Touch
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all"
              >
                View Full Gallery
              </Link>
            </div>
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