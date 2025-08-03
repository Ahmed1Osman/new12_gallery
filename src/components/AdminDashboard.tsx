import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePaintings } from '../context/PaintingContext';
import { Plus, Loader2, Save, Trash2, Edit, X, ArrowLeft, Eye, Search, Image, AlertCircle } from 'lucide-react';
import { Painting } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import DirectDelete from './DirectDelete';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { paintings, addPainting, updatePainting, deletePainting } = usePaintings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>(paintings);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paintingToDelete, setPaintingToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPainting, setNewPainting] = useState<Partial<Painting>>({
    title: '',
    price: 0,
    dimensions: '',
    type: 'Acrylic Paint',
    image: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Filter paintings based on search term
  useEffect(() => {
    const filtered = paintings.filter(
      painting => 
        painting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        painting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        painting.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPaintings(filtered);
  }, [searchTerm, paintings]);

  const resetForm = () => {
    setNewPainting({
      title: '',
      price: 0,
      dimensions: '',
      type: 'Acrylic Paint',
      image: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setNewPainting({ ...newPainting, [name]: parseInt(value, 10) || 0 });
    } else {
      setNewPainting({ ...newPainting, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        text: 'Image file is too large. Please select a file under 5MB.',
        type: 'error'
      });
      return;
    }
  
    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      // Store the base64 string in the painting data
      setNewPainting({ ...newPainting, image: base64String });
    };
    reader.readAsDataURL(file);
  };

  const getImageSource = (imageString: string) => {
    if (!imageString) return '/placeholder-image.jpg';
    
    // Check if it's already a base64 string
    if (imageString.startsWith('data:image')) {
      return imageString;
    }
    
    // Check if it's a URL
    if (imageString.startsWith('http')) {
      return imageString;
    }
    
    // Assume it's a filename
    return `/images/${imageString}`;
  };

  const handleEditPainting = (painting: Painting) => {
    setNewPainting({ ...painting });
    setIsEditing(true);
    setShowForm(true);
    
    // Set image preview based on the painting's image source
    if (painting.image) {
      setImagePreview(getImageSource(painting.image));
    } else {
      setImagePreview(null);
    }
  };

  const handleViewPainting = (id: string) => {
    navigate(`/gallery/${id}`);
  };

  const confirmDeletePainting = (id: string) => {
    setPaintingToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePainting = async () => {
    if (!paintingToDelete) return;
    
    try {
      // Use the context function to delete the painting
      deletePainting(paintingToDelete);
      setMessage({
        text: 'Painting deleted successfully!',
        type: 'success'
      });
      // Close the modal and reset
      setIsDeleteModalOpen(false);
      setPaintingToDelete(null);
    } catch (error) {
      setMessage({
        text: 'Error deleting painting. Please try again.',
        type: 'error'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate required fields
      if (!newPainting.title || !newPainting.dimensions || !newPainting.price) {
        throw new Error('Please fill in all required fields');
      }

      if (!newPainting.image) {
        throw new Error('Please upload an image');
      }

      // Generate unique ID based on title and dimensions if not editing
      let paintingToSave: Painting;
      
      if (isEditing && newPainting.id) {
        paintingToSave = { ...newPainting } as Painting;
        
        // Add createdAt if it doesn't exist
        if (!paintingToSave.createdAt) {
          paintingToSave.createdAt = new Date().toISOString();
        }
        
        // Use the context function to update the painting
        updatePainting(paintingToSave.id, paintingToSave);
        setMessage({
          text: 'Painting updated successfully!',
          type: 'success'
        });
      } else {
        const id = `${Date.now()}-${newPainting.title?.toLowerCase().replace(/\s+/g, '-')}`;
        paintingToSave = { 
          ...newPainting, 
          id,
          createdAt: new Date().toISOString() 
        } as Painting;
        
        // Use the context function to add the painting
        addPainting(paintingToSave);
        setMessage({
          text: 'New painting added successfully!',
          type: 'success'
        });
      }
      
      // Reset form and close it
      resetForm();
      setShowForm(false);
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Error saving painting. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your gallery paintings</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!showForm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Painting
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Alert message */}
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 rounded-lg p-4 flex justify-between items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              <span className="flex items-center">
                {message.type === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </span>
              <button onClick={() => setMessage({ text: '', type: '' })}>
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add DirectDelete component when not showing form */}
        {!showForm && (
          <div className="mb-8">
            <DirectDelete />
          </div>
        )}

        {/* Add/Edit Painting Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mb-8 rounded-2xl bg-white p-8 shadow-lg"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Painting' : 'Add New Painting'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="inline-flex items-center text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="mr-1 h-5 w-5" />
                  Back to List
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Painting Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newPainting.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (EGP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={newPainting.price || ''}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                      Dimensions <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={newPainting.dimensions}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 40×40 cm"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Artwork Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newPainting.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="Acrylic Paint">Acrylic Paint</option>
                      <option value="Oil on Canvas">Oil on Canvas</option>
                      <option value="Mixed Media">Mixed Media</option>
                      <option value="Ink & Unipen">Ink & Unipen</option>
                      <option value="Acrylic on Paper">Acrylic on Paper</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Creation Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newPainting.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newPainting.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Describe the painting..."
                    ></textarea>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Painting Image <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer flex-1 rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-center transition-colors hover:border-indigo-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          {imagePreview ? (
                            <Image className="h-8 w-8 text-indigo-500" />
                          ) : (
                            <Plus className="h-8 w-8 text-gray-400" />
                          )}
                          <span className="mt-2 block text-sm font-medium text-gray-700">
                            {imagePreview ? 'Change image' : 'Upload painting image'}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PNG, JPG, JPEG up to 5MB
                          </span>
                        </div>
                        <input
                          ref={fileInputRef}
                          id="painting-upload"
                          name="image"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </div>

                      {imagePreview && (
                        <div className="ml-5 h-32 w-32 overflow-hidden rounded-lg border border-gray-200 relative group">
                          <img
                            src={imagePreview}
                            alt="Painting preview"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setNewPainting(prev => ({ ...prev, image: '' }));
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 text-white hover:text-red-300 transition-opacity"
                            >
                              <X className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        {isEditing ? 'Update Painting' : 'Add Painting'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paintings list */}
        {!showForm && (
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white p-8 shadow-lg"
          >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Paintings</h2>
              
              {/* Search bar */}
              <div className="mt-3 sm:mt-0 relative">
                <input
                  type="text"
                  placeholder="Search paintings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-64 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            {filteredPaintings.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                {searchTerm ? (
                  <p className="text-gray-500">No paintings match your search. Try different keywords.</p>
                ) : (
                  <p className="text-gray-500">No paintings added yet. Click the "Add New Painting" button to get started.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dimensions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredPaintings.map((painting) => (
                      <tr key={painting.id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                            {painting.image ? (
                              <img 
                                src={getImageSource(painting.image)} 
                                alt={painting.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/placeholder-image.jpg';
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                No Image
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{painting.title}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{painting.price.toLocaleString()} EGP</div>
                          <div className="text-xs text-green-600">{(painting.price * 0.95).toLocaleString()} EGP (with discount)</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{painting.dimensions}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{painting.type}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewPainting(painting.id)}
                              className="rounded p-1 text-blue-600 hover:bg-blue-50"
                              aria-label="View painting"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditPainting(painting)}
                              className="rounded p-1 text-indigo-600 hover:bg-indigo-50"
                              aria-label="Edit painting"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => confirmDeletePainting(painting.id)}
                              className="rounded p-1 text-red-600 hover:bg-red-50"
                              aria-label="Delete painting"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 m-4 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this painting? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPaintingToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePainting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;