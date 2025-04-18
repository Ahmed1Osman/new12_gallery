// src/components/SupabaseFix.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const SupabaseFix: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking Supabase configuration...');
  const [logs, setLogs] = useState<string[]>([]);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const [dbPaintings, setDbPaintings] = useState<any[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const checkSupabase = async () => {
    try {
      addLog('1. Testing Supabase connection...');
      const { data, error } = await supabase.from('paintings').select('count');
      
      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist error
          addLog('ERROR: Paintings table does not exist in the database!');
          await createPaintingsTable();
        } else {
          addLog(`ERROR: ${error.message}`);
          setStatus('Supabase connection error. See logs for details.');
        }
      } else {
        addLog('✓ Successfully connected to Supabase');
        await checkStorage();
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('Failed to connect to Supabase');
    }
  };

  const checkStorage = async () => {
    try {
      addLog('2. Checking storage bucket...');
      
      // First check if the bucket exists
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('paintings');
      
      if (bucketError) {
        addLog(`ERROR: ${bucketError.message}`);
        
        // Try to create the bucket if it doesn't exist
        if (bucketError.message.includes('not found')) {
          await createBucket();
        }
      } else {
        addLog('✓ Storage bucket "paintings" exists');
      }
      
      // List files in storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('paintings')
        .list();
      
      if (storageError) {
        addLog(`ERROR: ${storageError.message}`);
      } else {
        setStorageFiles(storageData || []);
        addLog(`✓ Found ${storageData?.length || 0} files in storage`);
        
        // Check database records
        await checkDatabase();
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const checkDatabase = async () => {
    try {
      addLog('3. Checking paintings database records...');
      
      const { data, error } = await supabase
        .from('paintings')
        .select('*');
      
      if (error) {
        addLog(`ERROR: ${error.message}`);
      } else {
        setDbPaintings(data || []);
        addLog(`✓ Found ${data?.length || 0} painting records in database`);
        
        // Compare storage files with database records
        await compareStorageAndDb(data || []);
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const compareStorageAndDb = async (dbRecords: any[]) => {
    try {
      addLog('4. Comparing storage files with database records...');
      
      const dbImageUrls = new Set(dbRecords.map(record => {
        // Extract filename from URL
        if (record.image_url) {
          try {
            const url = new URL(record.image_url);
            return url.pathname.split('/').pop();
          } catch {
            return null;
          }
        }
        return null;
      }).filter(Boolean));
      
      const orphanedFiles = storageFiles.filter(file => 
        !dbImageUrls.has(file.name)
      );
      
      if (orphanedFiles.length > 0) {
        addLog(`Found ${orphanedFiles.length} files in storage without database records:`);
        orphanedFiles.forEach(file => {
          addLog(`- ${file.name}`);
        });
        
        const shouldFix = confirm("Found files in storage that don't have database records. Would you like to create database records for these files?");
        
        if (shouldFix) {
          await createMissingRecords(orphanedFiles);
        }
      } else {
        addLog('✓ All storage files have corresponding database records');
        setStatus('Supabase setup looks good!');
        setIsFixed(true);
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createBucket = async () => {
    try {
      addLog('Creating storage bucket "paintings"...');
      
      const { data, error } = await supabase
        .storage
        .createBucket('paintings', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
      
      if (error) {
        addLog(`ERROR: ${error.message}`);
      } else {
        addLog('✓ Created storage bucket "paintings"');
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createPaintingsTable = async () => {
    try {
      addLog('Creating paintings table...');
      
      // We need to use the raw SQL interface since Supabase JS doesn't expose schema creation
      const { error } = await supabase.rpc('create_paintings_table');
      
      if (error) {
        addLog(`ERROR: ${error.message}`);
        addLog('Creating paintings table via SQL function failed.');
        addLog('Please create the table manually with:');
        addLog(`
CREATE TABLE public.paintings (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  type TEXT,
  dimensions TEXT,
  image_url TEXT,
  description TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
      } else {
        addLog('✓ Created paintings table');
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const createMissingRecords = async (orphanedFiles: any[]) => {
    try {
      addLog('Creating database records for orphaned files...');
      
      let successCount = 0;
      
      for (const file of orphanedFiles) {
        // Get the public URL for the file
        const { data: urlData } = supabase
          .storage
          .from('paintings')
          .getPublicUrl(file.name);
        
        if (!urlData || !urlData.publicUrl) {
          addLog(`- Failed to get public URL for ${file.name}`);
          continue;
        }
        
        // Create a record with default values and the image URL
        const { error } = await supabase
          .from('paintings')
          .insert({
            id: crypto.randomUUID(),
            title: `Painting from ${file.name}`,
            price: 0, // Default price, you'll need to update this later
            type: 'Unknown',
            dimensions: 'Unknown',
            image_url: urlData.publicUrl,
            description: 'Automatically created record for orphaned storage file',
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
          });
        
        if (error) {
          addLog(`- Error creating record for ${file.name}: ${error.message}`);
        } else {
          addLog(`✓ Created record for ${file.name}`);
          successCount++;
        }
      }
      
      addLog(`Created ${successCount} of ${orphanedFiles.length} missing records`);
      
      if (successCount > 0) {
        addLog('✓ Fix applied! Refresh the gallery page to see the paintings.');
        setStatus('Fixed missing database records!');
        setIsFixed(true);
      }
    } catch (err) {
      addLog(`ERROR: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    checkSupabase();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Gallery Fix</h1>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Status: {status}</h2>
        {isFixed && (
          <div className="p-3 bg-green-100 text-green-800 rounded mb-4">
            <p className="font-bold">Fix applied successfully!</p>
            <p>Please refresh your gallery page to see the changes. You might need to adjust some details like price and dimensions in the admin dashboard.</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={checkSupabase}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Run Diagnostics Again
        </button>
        
        <a 
          href="/gallery"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 inline-block"
        >
          Go to Gallery
        </a>
        
        <a 
          href="/admin"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 inline-block"
        >
          Go to Admin
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Storage Files ({storageFiles.length})</h3>
          <div className="bg-gray-50 p-3 rounded h-60 overflow-y-auto">
            {storageFiles.length > 0 ? (
              <ul className="list-disc pl-5">
                {storageFiles.map((file, index) => (
                  <li key={index} className="text-sm mb-1">{file.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No files found</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Database Records ({dbPaintings.length})</h3>
          <div className="bg-gray-50 p-3 rounded h-60 overflow-y-auto">
            {dbPaintings.length > 0 ? (
              <ul className="list-disc pl-5">
                {dbPaintings.map((painting, index) => (
                  <li key={index} className="text-sm mb-1">
                    {painting.title} (ID: {painting.id?.substring(0, 8)}...)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No database records found</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Logs</h3>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupabaseFix;