// src/context/PaintingContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Painting } from '../types';
import { paintings as initialPaintings } from '../data/paintings';
import { supabase } from '../supabase';

interface PaintingContextType {
  paintings: Painting[];
  addPainting: (painting: Painting) => Promise<void>;
  updatePainting: (id: string, updatedPainting: Painting) => Promise<void>;
  deletePainting: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshPaintings: () => Promise<void>;
}

const PaintingContext = createContext<PaintingContextType | undefined>(undefined);

// Load hidden painting IDs from localStorage
const getHiddenPaintingIds = (): string[] => {
  try {
    const saved = localStorage.getItem('hiddenPaintingIds');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Error loading hidden IDs:', err);
    return [];
  }
};

// Save hidden painting IDs to localStorage
const saveHiddenPaintingIds = (ids: string[]): void => {
  localStorage.setItem('hiddenPaintingIds', JSON.stringify(ids));
};

export const PaintingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Track which static paintings should be hidden
  const [hiddenPaintingIds, setHiddenPaintingIds] = useState<string[]>(getHiddenPaintingIds());
  // Track Supabase paintings separately
  const [supabasePaintings, setSupabasePaintings] = useState<Painting[]>([]);

  // When hidden IDs change, save to localStorage
  useEffect(() => {
    saveHiddenPaintingIds(hiddenPaintingIds);
  }, [hiddenPaintingIds]);

  // Fetch paintings from Supabase
  const fetchSupabasePaintings = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('paintings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase fetch error:", error);
        throw error;
      }
      
      if (data) {
        const paintings = data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled',
          price: typeof item.price === 'number' ? item.price : 0,
          type: item.type || 'Unknown',
          dimensions: item.dimensions || '',
          image: item.image_url || '',
          description: item.description || '',
          createdAt: item.created_at || new Date().toISOString(),
          date: item.date || new Date().toISOString().split('T')[0],
          isSupabasePainting: true // Mark as Supabase painting
        }));
        
        setSupabasePaintings(paintings);
      }
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Combine filtered static paintings with Supabase paintings
  useEffect(() => {
    // Filter out hidden static paintings
    const visibleStaticPaintings = initialPaintings.filter(
      painting => !hiddenPaintingIds.includes(painting.id)
    );
    
    // Combine with Supabase paintings
    setPaintings([...visibleStaticPaintings, ...supabasePaintings]);
  }, [hiddenPaintingIds, supabasePaintings]);

  // Initial load
  useEffect(() => {
    fetchSupabasePaintings();
  }, [fetchSupabasePaintings]);

  // Upload image to Supabase storage
  const uploadBase64Image = async (base64Image: string, fileName: string) => {
    try {
      const mimeType = base64Image.split(';')[0].split(':')[1];
      const base64Data = base64Image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays: number[] = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });
      
      const { error } = await supabase.storage
        .from('paintings')
        .upload(fileName, blob, {
          contentType: mimeType,
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('paintings')
        .getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  // Add a new painting
  const addPainting = async (painting: Painting) => {
    try {
      setLoading(true);
      
      let imageUrl = painting.image;
      
      // Upload image if it's a base64 string
      if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
        const fileName = `${Date.now()}-${painting.title.replace(/\s+/g, '-')}`;
        imageUrl = await uploadBase64Image(imageUrl, fileName);
      }
      
      // Generate a unique ID
      const id = crypto.randomUUID();
      
      // Create record in database
      const { error } = await supabase
        .from('paintings')
        .insert({
          id,
          title: painting.title,
          price: painting.price,
          type: painting.type,
          dimensions: painting.dimensions,
          image_url: imageUrl,
          description: painting.description || null,
          date: painting.date,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Refresh Supabase paintings
      await fetchSupabasePaintings();
    } catch (err) {
      console.error("Error adding painting:", err);
      setError("Failed to add painting");
    } finally {
      setLoading(false);
    }
  };

  // Update a painting
  const updatePainting = async (id: string, updatedPainting: Painting) => {
    try {
      setLoading(true);
      
      // Check if this is a static painting
      const isStaticPainting = initialPaintings.some(p => p.id === id);
      
      if (isStaticPainting) {
        // For static paintings, just update the local state
        setPaintings(prev => prev.map(p => 
          p.id === id ? { ...updatedPainting } : p
        ));
      } else {
        // For Supabase paintings, update in database
        let imageUrl = updatedPainting.image;
        
        // Upload new image if needed
        if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
          const fileName = `${Date.now()}-${updatedPainting.title.replace(/\s+/g, '-')}`;
          imageUrl = await uploadBase64Image(imageUrl, fileName);
        }
        
        const { error } = await supabase
          .from('paintings')
          .update({
            title: updatedPainting.title,
            price: updatedPainting.price,
            type: updatedPainting.type,
            dimensions: updatedPainting.dimensions,
            image_url: imageUrl,
            description: updatedPainting.description || null,
            date: updatedPainting.date
          })
          .eq('id', id);
        
        if (error) throw error;
        
        // Refresh Supabase paintings
        await fetchSupabasePaintings();
      }
    } catch (err) {
      console.error("Error updating painting:", err);
      setError("Failed to update painting");
    } finally {
      setLoading(false);
    }
  };

  // Delete a painting
  const deletePainting = async (id: string) => {
    try {
      setLoading(true);
      
      // Find the painting
      const paintingToDelete = paintings.find(p => p.id === id);
      if (!paintingToDelete) {
        throw new Error("Painting not found");
      }
      
      // Check if it's a static painting
      const isStaticPainting = initialPaintings.some(p => p.id === id);
      
      if (isStaticPainting) {
        // For static paintings, just hide it by adding to hiddenPaintingIds
        setHiddenPaintingIds(prev => [...prev, id]);
      } else {
        // For Supabase paintings, delete from database
        const { error } = await supabase
          .from('paintings')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Delete image from storage if it exists
        if (paintingToDelete.image && paintingToDelete.image.includes('supabase')) {
          try {
            const url = new URL(paintingToDelete.image);
            const pathParts = url.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            
            await supabase.storage
              .from('paintings')
              .remove([fileName]);
          } catch (storageErr) {
            console.warn("Failed to delete image file:", storageErr);
          }
        }
        
        // Refresh Supabase paintings
        await fetchSupabasePaintings();
      }
    } catch (err) {
      console.error("Error deleting painting:", err);
      setError("Failed to delete painting");
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh paintings
  const refreshPaintings = useCallback(async () => {
    await fetchSupabasePaintings();
  }, [fetchSupabasePaintings]);

  return (
    <PaintingContext.Provider value={{
      paintings,
      addPainting,
      updatePainting,
      deletePainting,
      loading,
      error,
      refreshPaintings
    }}>
      {children}
    </PaintingContext.Provider>
  );
};

export const usePaintings = () => {
  const context = useContext(PaintingContext);
  if (context === undefined) {
    throw new Error('usePaintings must be used within a PaintingProvider');
  }
  return context;
};