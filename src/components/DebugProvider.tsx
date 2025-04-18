// src/components/DebugProvider.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface DebugProviderProps {
  children: React.ReactNode;
}

/**
 * This component helps diagnose data fetching issues by displaying debug information
 * only in development mode. You can temporarily wrap your app with this component
 * to see what's happening with your Supabase data.
 */
const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [debugInfo, setDebugInfo] = useState<any>({
    loading: true,
    supabaseConnection: 'checking...',
    paintings: [],
    error: null
  });
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase.from('paintings').select('count');
        
        if (error) {
          setDebugInfo(prev => ({
            ...prev,
            loading: false,
            supabaseConnection: 'error',
            error: error.message
          }));
        } else {
          // If connection is successful, fetch all data
          const { data: paintingsData, error: paintingsError } = await supabase
            .from('paintings')
            .select('*');
            
          setDebugInfo(prev => ({
            ...prev,
            loading: false,
            supabaseConnection: 'connected',
            paintings: paintingsData || [],
            error: paintingsError ? paintingsError.message : null
          }));
        }
      } catch (err) {
        setDebugInfo(prev => ({
          ...prev,
          loading: false,
          supabaseConnection: 'error',
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    checkSupabase();
  }, []);

  const toggleDebug = () => {
    setShowDebug(prev => !prev);
  };

  // Only show in development
  if (import.meta.env.DEV !== true) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleDebug}
          className="bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-800"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>

      {showDebug && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 overflow-auto p-4">
          <div className="bg-white rounded-lg max-w-4xl mx-auto p-6 my-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Debug Information</h2>
              <button
                onClick={toggleDebug}
                className="text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Supabase Connection</h3>
                <div className={`mt-1 font-mono text-sm p-2 rounded ${
                  debugInfo.supabaseConnection === 'connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {debugInfo.supabaseConnection}
                </div>
                {debugInfo.error && (
                  <div className="mt-1 text-red-600 font-mono text-sm">
                    Error: {debugInfo.error}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">Paintings in Supabase</h3>
                <div className="mt-1 bg-gray-100 p-2 rounded max-h-96 overflow-auto">
                  {debugInfo.loading ? (
                    <p>Loading data...</p>
                  ) : debugInfo.paintings.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image URL</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {debugInfo.paintings.map((painting: any) => (
                          <tr key={painting.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{painting.id}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{painting.title}</td>
                            <td className="px-3 py-2 text-xs text-gray-900 overflow-hidden text-ellipsis" style={{ maxWidth: '300px' }}>
                              {painting.image_url}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No paintings found in Supabase.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Test Image Loading</h3>
                <div className="mt-1 grid grid-cols-3 gap-4">
                  {!debugInfo.loading && debugInfo.paintings.slice(0, 3).map((painting: any) => (
                    <div key={`test-${painting.id}`} className="border rounded p-2">
                      <p className="text-xs mb-1 truncate">{painting.title}</p>
                      <div className="aspect-square bg-gray-200 relative">
                        <img 
                          src={painting.image_url} 
                          alt={painting.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder-image.jpg';
                            const parent = target.parentElement;
                            if (parent) {
                              const errorDiv = document.createElement('div');
                              errorDiv.className = 'absolute inset-0 bg-red-100 text-red-800 text-xs p-1 flex items-center justify-center';
                              errorDiv.textContent = 'Image load error';
                              parent.appendChild(errorDiv);
                            }
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
};

export default DebugProvider;