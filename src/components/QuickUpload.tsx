// src/components/QuickUpload.tsx
import React, { useState, useRef } from 'react';
import { usePaintings } from '../context/PaintingContext';
import { Loader2, Upload, X, Check, Image } from 'lucide-react';

const QuickUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPainting } = usePaintings();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setSuccessCount(0);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create file reader to get base64 of image
        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Generate a title from the filename (remove extension)
        let title = file.name.split('.')[0];
        // Replace hyphens and underscores with spaces
        title = title.replace(/[-_]/g, ' ');
        // Capitalize first letter of each word
        title = title.replace(/\b\w/g, c => c.toUpperCase());
        
        // Create a default painting object
        await addPainting({
          id: crypto.randomUUID(), // Generate a unique ID
          title,
          price: 10000, // Default price
          dimensions: '40×40 cm', // Default dimensions
          type: 'Acrylic Paint', // Default type
          image: imageBase64,
          description: '',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString() // Add createdAt property
        });
        
        // Update progress
        setSuccessCount(prev => prev + 1);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Clear files after successful upload
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Quick Image Upload</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
          files.length > 0 ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />
        
        {files.length === 0 ? (
          <div className="flex flex-col items-center">
            <Image className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500">
              Click to select images or drop files here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Accept PNG, JPG, JPEG, WebP
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Check className="w-12 h-12 text-green-500 mb-2" />
            <p className="text-lg font-medium text-gray-700">
              {files.length} {files.length === 1 ? 'image' : 'images'} selected
            </p>
            <button 
              className="text-red-500 text-sm mt-2 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Images to upload:</h3>
          <div className="max-h-36 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center py-1 border-b">
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-gray-500 text-sm">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1 text-sm">
            <span>Uploading...</span>
            <span>{successCount} of {files.length} complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
          files.length === 0 || uploading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Upload {files.length > 0 ? files.length : ''} {files.length === 1 ? 'Image' : 'Images'}
          </>
        )}
      </button>
    </div>
  );
};

export default QuickUpload; 