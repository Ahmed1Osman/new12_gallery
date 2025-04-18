import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePaintings } from '../context/PaintingContext';
import ImageHandler from '../components/ImageHandler'; // Import the ImageHandler component

const PaintingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const phoneNumber = "+20 100 273 8764";
  
  // Get paintings from context
  const { paintings } = usePaintings();

  // Find the painting using the id parameter
  const painting = paintings.find((p) => p.id === id);
  
  console.log("PaintingDetail - paintings:", paintings);
  console.log("PaintingDetail - looking for id:", id);
  console.log("PaintingDetail - found painting:", painting);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!painting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8 rounded-xl bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Painting Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the painting you're looking for.</p>
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Gallery
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-16">
          {/* Modified this div to better handle various image dimensions */}
          <div className="overflow-hidden rounded-xl shadow-xl bg-white p-4 flex items-center justify-center min-h-[400px]">
            <ImageHandler
              imageSource={painting.image}
              alt={painting.title}
              className="max-w-full max-h-full"
              preserveAspectRatio={true}
              objectFit="contain"
            />
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-4xl font-bold text-gray-900">{painting.title}</h1>
              <p className="mt-4 text-3xl font-semibold text-indigo-600">
                {(painting.price * 0.95).toLocaleString()} EGP
                <span className="ml-2 text-base text-gray-500 line-through">
                  {painting.price.toLocaleString()} EGP
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <dt className="text-lg font-medium text-gray-900">Artwork Type</dt>
                  <dd className="mt-1 text-gray-600">{painting.type}</dd>
                </div>
                <div className="flex-1">
                  <dt className="text-lg font-medium text-gray-900">Dimensions</dt>
                  <dd className="mt-1 text-gray-600">{painting.dimensions}</dd>
                </div>
              </div>

              {painting.description && (
                <div className="mt-4">
                  <dt className="text-lg font-medium text-gray-900">Description</dt>
                  <dd className="mt-1 text-gray-600">{painting.description}</dd>
                </div>
              )}

              <motion.div 
                className="mt-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Interested in this artwork?</h2>
                <p className="mb-4">Contact the artist directly to purchase:</p>
                
                <div className="flex items-center justify-between bg-white/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <Phone className="h-6 w-6 mr-3" />
                    <span className="text-xl font-semibold">{phoneNumber}</span>
                  </div>
                  <button 
                    onClick={handleCopyNumber}
                    className="bg-white text-indigo-600 rounded-lg px-4 py-2 flex items-center hover:bg-indigo-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-2" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <p className="mt-4 text-sm text-white/80">
                  Mention code <span className="font-bold">WEBSITE5</span> for 5% discount
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;