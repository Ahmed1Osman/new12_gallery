import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { artistsData } from '../data/artists'; // Import the centralized data

const ArtistPaintingDetail = () => {
  const { artistSlug, paintingId } = useParams<{ artistSlug: string; paintingId: string }>();
  const navigate = useNavigate();
  // Use the centralized artistsData instead of hardcoded data
  const artist = artistsData[artistSlug as keyof typeof artistsData];
  const painting = artist?.paintings.find(p => p.id.toString() === paintingId);

  if (!painting || !artist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center p-8 rounded-xl bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Painting Not Found</h2>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the painting you're looking for.</p>
          <button
            onClick={() => navigate(artistSlug ? `/artists/${artistSlug}` : '/artists')}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {artist ? `Back to ${artist.name}` : 'Back to Artists'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/artists/${artistSlug}`)}
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back to artist page"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to {artist.name}
        </button>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:gap-16">
          <div className="overflow-hidden rounded-xl shadow-xl bg-white p-4 flex items-center justify-center min-h-[500px]">
            <img
              src={painting.image}
              alt={painting.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-4xl font-bold text-gray-900">{painting.title}</h1>
              <p className="mt-4 text-3xl font-semibold text-indigo-600">
                {painting.price}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <dt className="text-lg font-medium text-gray-900">Artist</dt>
                  <dd className="mt-1 text-gray-600">{artist.name}</dd>
                </div>
                <div className="flex-1">
                  <dt className="text-lg font-medium text-gray-900">Medium</dt>
                  <dd className="mt-1 text-gray-600">{painting.medium}</dd>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <dt className="text-lg font-medium text-gray-900">Dimensions</dt>
                  <dd className="mt-1 text-gray-600">{painting.size}</dd>
                </div>
              </div>

              {painting.description && (
                <div className="mt-4">
                  <dt className="text-lg font-medium text-gray-900">Description</dt>
                  <dd className="mt-1 text-gray-600 whitespace-pre-line">{painting.description}</dd>
                </div>
              )}
            </div>

            {/* Contact section removed as per request */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPaintingDetail;