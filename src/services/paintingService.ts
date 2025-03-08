import { Painting } from '../types';
import { paintings } from '../data/paintings';

// In a real app, these would be API calls to your backend
export const paintingService = {
  // Get all paintings
  getAllPaintings: () => {
    return Promise.resolve([...paintings]);
  },
  
  // Add a new painting
  addPainting: (painting: Painting) => {
    // Generate a unique ID based on the title and dimensions
    const id = `${painting.title.toLowerCase().replace(/\s+/g, '-')}-${painting.dimensions.toLowerCase().replace(/\s+/g, '-')}`;
    const newPainting = { ...painting, id };
    
    // In a real application, you would send this to your backend
    // For now, we'll just log it
    console.log('New painting to be saved:', newPainting);
    
    // Simulate API delay
    return new Promise<Painting>((resolve) => {
      setTimeout(() => {
        // In a real app, the backend would add the painting to the database
        resolve(newPainting);
      }, 1000);
    });
  },
  
  // Handle image upload
  uploadImage: (file: File) => {
    // In a real app, this would upload the file to your server/storage
    console.log('Image to be uploaded:', file.name);
    
    // Simulate API delay
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Return the filename that would be saved on the server
        resolve(file.name);
      }, 1000);
    });
  }
};