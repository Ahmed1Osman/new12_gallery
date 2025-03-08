import React, { createContext, useContext, useState, useEffect } from 'react';
import { Painting } from '../types';
import { paintings as initialPaintings } from '../data/paintings'; // Import initial paintings data

interface PaintingContextType {
  paintings: Painting[];
  addPainting: (painting: Painting) => void;
  updatePainting: (id: string, updatedPainting: Painting) => void;
  deletePainting: (id: string) => void;
}

const PaintingContext = createContext<PaintingContextType | undefined>(undefined);

export const PaintingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with paintings from data file
  const [paintings, setPaintings] = useState<Painting[]>(initialPaintings);

  // Load paintings from localStorage on mount
  useEffect(() => {
    const storedPaintings = localStorage.getItem('paintings');
    if (storedPaintings) {
      try {
        // We merge the stored paintings with initial ones to avoid duplicates
        const parsedPaintings = JSON.parse(storedPaintings);
        
        // Create a map of initial painting IDs for quick lookup
        const initialIds = new Set(initialPaintings.map(p => p.id));
        
        // Filter out any stored paintings that have the same ID as initial ones
        const uniqueStoredPaintings = parsedPaintings.filter(
          (p: Painting) => !initialIds.has(p.id)
        );
        
        // Combine initial paintings with unique stored ones
        setPaintings([...initialPaintings, ...uniqueStoredPaintings]);
      } catch (error) {
        console.error('Error parsing stored paintings:', error);
      }
    }
  }, []);

  // Save paintings to localStorage whenever they change
  useEffect(() => {
    // We only want to store paintings added/edited through the admin panel
    // So we identify which ones aren't in the initial set
    const initialIds = new Set(initialPaintings.map(p => p.id));
    const adminPaintings = paintings.filter(p => !initialIds.has(p.id));
    
    localStorage.setItem('paintings', JSON.stringify(adminPaintings));
  }, [paintings]);

  // Add a new painting
  const addPainting = (painting: Painting) => {
    setPaintings(prevPaintings => [...prevPaintings, painting]);
  };

  // Update an existing painting
  const updatePainting = (id: string, updatedPainting: Painting) => {
    setPaintings(prevPaintings => 
      prevPaintings.map(painting => 
        painting.id === id ? updatedPainting : painting
      )
    );
  };

  // Delete a painting
  const deletePainting = (id: string) => {
    setPaintings(prevPaintings => 
      prevPaintings.filter(painting => painting.id !== id)
    );
  };

  return (
    <PaintingContext.Provider value={{ paintings, addPainting, updatePainting, deletePainting }}>
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