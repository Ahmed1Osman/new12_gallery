import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../supabase';

interface Image {
  id: string;
  name: string;
  url: string;
  isDeleting: boolean;
}

const DirectDelete: React.FC = () => {
  const [storageImages, setStorageImages] = useState<Image[]>([]);
  const [dbRecords, setDbRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from storage and database
  const fetchData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch storage files
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('paintings')
        .list();

      if (storageError) throw storageError;

      // Get public URLs for each file
      const imagesWithUrls = await Promise.all((storageData || []).map(async (file) => {
        const { data: urlData } = supabase
          .storage
          .from('paintings')
          .getPublicUrl(file.name);

        return {
          id: file.id,
          name: file.name,
          url: urlData.publicUrl,
          isDeleting: false
        };
      }));

      setStorageImages(imagesWithUrls);

      // Fetch database records
      const { data: dbData, error: dbError } = await supabase
        .from('paintings')
        .select('*');

      if (dbError) throw dbError;
      setDbRecords(dbData || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load images");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Delete image from storage and database
  const handleDelete = async (image: Image) => {
    try {
      // Mark as deleting
      setStorageImages(prev => 
        prev.map(img => img.id === image.id ? { ...img, isDeleting: true } : img)
      );

      // Find corresponding database records that use this image
      const matchingRecords = dbRecords.filter(record => 
        record.image_url && record.image_url.includes(image.name)
      );

      // Delete database records first
      for (const record of matchingRecords) {
        const { error: dbDeleteError } = await supabase
          .from('paintings')
          .delete()
          .eq('id', record.id);

        if (dbDeleteError) throw dbDeleteError;
      }

      // Then delete from storage
      const { error: storageDeleteError } = await supabase
        .storage
        .from('paintings')
        .remove([image.name]);

      if (storageDeleteError) throw storageDeleteError;

      // Remove from local state
      setStorageImages(prev => prev.filter(img => img.id !== image.id));
      setDbRecords(prev => prev.filter(record => 
        !matchingRecords.some(match => match.id === record.id)
      ));

    } catch (err) {
      console.error("Delete error:", err);
      // Reset deleting state
      setStorageImages(prev => 
        prev.map(img => img.id === image.id ? { ...img, isDeleting: false } : img)
      );
      setError("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="mt-2 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Direct Image Management</h2>
        <button 
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {storageImages.map(image => (
          <div key={image.id} className="relative rounded-lg overflow-hidden border border-gray-200 group">
            <img 
              src={image.url} 
              alt={image.name}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/placeholder-image.jpg';
              }}
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200"></div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => handleDelete(image)}
                disabled={image.isDeleting}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {image.isDeleting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2">
              <p className="text-xs truncate" title={image.name}>
                {image.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {storageImages.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No images found in storage</p>
        </div>
      )}
    </div>
  );
};

export default DirectDelete;