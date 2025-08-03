import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { artistsData } from '../data/artists';

const ArtistDetail: React.FC = () => {
  const params = useParams<{ artistSlug: string }>(); // Changed from 'slug' to 'artistSlug'
  const [isLoading, setIsLoading] = React.useState(true);
  const [artist, setArtist] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchArtist = () => {
      console.log('Fetching artist with slug:', params.artistSlug); // Changed from params.slug
      console.log('Available artist slugs:', Object.keys(artistsData));
      try {
        // Make the lookup case-insensitive
        const slug = params.artistSlug?.toLowerCase(); // Changed from params.slug
        const foundArtist = Object.entries(artistsData).find(
          ([key]) => key.toLowerCase() === slug
        )?.[1];
        
        console.log('Found artist:', foundArtist);
        if (!foundArtist) {
          console.error('Artist not found for slug:', params.artistSlug); // Changed from params.slug
          setError('Artist not found');
        } else {
          setArtist(foundArtist);
        }
      } catch (err) {
        console.error('Error in fetchArtist:', err);
        setError('Failed to load artist data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [params.artistSlug]); // Changed from params.slug

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artist Not Found</h1>
          <Link to="/artists" className="text-indigo-600 hover:underline">
            Back to Artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link 
        to="/artists" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Artists
      </Link>
      
      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={artist.image} 
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{artist.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{artist.bio}</p>
          </div>
        </div>
      </motion.div>

      <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artist.paintings.map((painting: any, index: number) => (
          <Link 
            key={painting.id} 
            to={`/artists/${params.artistSlug}/paintings/${painting.id}`} // Changed from params.slug
            className="block"
          >
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-64 bg-gray-200 overflow-hidden flex-shrink-0">
                <img 
                  src={painting.image} 
                  alt={painting.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800">{painting.title}</h3>
                <div className="mt-2 space-y-1">
                  {painting.year && <p className="text-gray-600">{painting.year}</p>}
                  {painting.medium && <p className="text-gray-700">{painting.medium}</p>}
                  {painting.size && <p className="text-gray-700">Size: {painting.size}</p>}
                  {painting.price && <p className="text-lg font-medium text-indigo-700">{painting.price}</p>}
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetail;