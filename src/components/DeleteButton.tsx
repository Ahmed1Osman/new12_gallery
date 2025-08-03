// src/components/DeleteButton.tsx
import React, { useState } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import { supabase } from '../supabase';

interface DeleteButtonProps {
  paintingId: string;
  imageUrl?: string;
  onSuccess?: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ paintingId, imageUrl, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleDirectDelete = async () => {
    try {
      setIsDeleting(true);
      
      // 1. First delete from database
      const { error: dbError } = await supabase
        .from('paintings')
        .delete()
        .eq('id', paintingId);
      
      if (dbError) {
        console.error("Database delete error:", dbError);
        throw dbError;
      }
      
      // 2. Then try to delete from storage if we have an image URL
      if (imageUrl && imageUrl.includes('supabase')) {
        try {
          // Extract filename from URL
          const url = new URL(imageUrl);
          const pathParts = url.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          
          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from('paintings')
              .remove([fileName]);
            
            if (storageError) {
              console.warn("Storage delete error:", storageError);
              // Continue anyway - database deletion is more important
            }
          }
        } catch (err) {
          console.warn("Error processing image URL:", err);
          // Continue anyway - database deletion is more important
        }
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Hide confirmation dialog
      setShowConfirm(false);
      
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // For local paintings (not Supabase), hide them in localStorage
  const handleHideLocalPainting = () => {
    try {
      // Get current hidden paintings
      const hiddenPaintingsJson = localStorage.getItem('hiddenPaintingIds') || '[]';
      const hiddenPaintings = JSON.parse(hiddenPaintingsJson);
      
      // Add this ID if not already hidden
      if (!hiddenPaintings.includes(paintingId)) {
        hiddenPaintings.push(paintingId);
        localStorage.setItem('hiddenPaintingIds', JSON.stringify(hiddenPaintings));
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Hide confirmation dialog
      setShowConfirm(false);
      
    } catch (err) {
      console.error("Hide failed:", err);
      alert("Failed to hide painting. Please try again.");
    }
  };
  
  const isSupabasePainting = imageUrl?.includes('supabase') || !imageUrl?.includes('/');
  
  return (
    <>
      {/* Delete button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
        aria-label="Delete painting"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>
      
      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button 
                onClick={() => setShowConfirm(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-6">
              Are you sure you want to delete this painting? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              
              <button
                onClick={isSupabasePainting ? handleDirectDelete : handleHideLocalPainting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;