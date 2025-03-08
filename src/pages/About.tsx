import React from 'react';
// Update your lucide-react imports at the top of About.tsx
import { 
  Award, 
  Users, 
  BookOpen, 
  Brush, 
  Calendar, 
  Mail,
  Globe  // Add this import
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="/images/love_in_the_sea.jpeg"
            alt="Elnagar Art Studio"
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
        </div>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative flex h-full items-center justify-center"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white md:text-6xl">
              About Elnagar Art
            </h1>
            <p className="mt-4 text-xl text-gray-200 md:text-2xl">
              Where Vision Meets Expression
            </p>
          </div>
        </motion.div>
      </section>

      {/* Artist Profile Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* Artist Profile Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={slideUp}
              className="relative overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="p-8">
                <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full">
                  <img
                    src="/images/465009700_27564557996524809_2031844016829520294_n.jpg"
                    alt="Ghada El-Nagar"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold">Ghada El-Nagar</h2>
                  <p className="mt-2 text-indigo-600">Founder & Lead Artist</p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <a href="#cv" className="flex items-center text-gray-600 hover:text-indigo-600">

                    </a>
                    <a href="#exhibitions" className="flex items-center text-gray-600 hover:text-indigo-600">
                    </a>
                  </div>
                </div>
                <p className="mt-8 text-center text-gray-600">
                  "Art is the language through which I converse with the world, 
                  blending cultural heritage with contemporary vision."
                </p>
              </div>
            </motion.div>

            {/* Publications & Recognition */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={slideUp}
              className="space-y-8"
            >
              {/* Featured Publication */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <h3 className="text-2xl font-semibold">Featured in Art Magazine</h3>
                </div>
                <img
                  src="/images/blog.jpeg"
                  alt="Magazine Feature"
                  className="mt-6 h-64 w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="mt-6 space-y-4">
                  <h4 className="text-xl font-semibold">"Modern Art Innovators"</h4>
                  <p className="text-gray-600">
                    Featured in Art Today magazine's annual list of emerging artists 
                    reshaping contemporary art landscapes.
                  </p>
                </div>
              </div>

              {/* Gallery Visitors */}
              <div className="rounded-2xl bg-white p-8 shadow-xl">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-indigo-600" />
                  <h3 className="text-2xl font-semibold">Gallery Visitors</h3>
                </div>
                <img
                  src="/images/awards.jpeg"
                  alt="Gallery Visitors"
                  className="mt-6 h-64 w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="mt-6 space-y-4">
                  <h4 className="text-xl font-semibold">Featured Exhibition</h4>
                  <p className="text-gray-600">
                    Hosting art enthusiasts and collectors at our annual gallery showcase, 
                    featuring special guests from the art community.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Artistic Philosophy */}
      <section className="bg-indigo-50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Artistic Vision</h2>
            <p className="mt-4 text-lg text-gray-600">
              Bridging tradition and innovation in every stroke
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Brush />,
                title: "Technique",
                content: "Mastering both traditional and modern painting methods"
              },
              {
                icon: <Award />,
                title: "Recognition",
                content: "Multiple award-winning contemporary artworks"
              },
              {
                icon: <Globe />,
                title: "Global Reach",
                content: "Collections featured in 15+ countries worldwide"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                className="rounded-2xl bg-white p-6 text-center shadow-xl"
              >
                <div className="flex justify-center">
                  <div className="rounded-full bg-indigo-100 p-4">
                    {item.icon}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-indigo-600 p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold md:text-4xl">
              Experience the Art Journey
            </h2>
            <p className="mt-4 text-lg md:text-xl">
              Visit our gallery or explore our online collection
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/gallery"
                className="rounded-xl bg-white px-8 py-3 font-medium text-indigo-600 transition-all hover:bg-opacity-90"
              >
                View Collection
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border-2 border-white px-8 py-3 font-medium transition-all hover:bg-white hover:text-indigo-600"
              >
                Schedule Visit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;