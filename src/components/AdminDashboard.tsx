import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePaintings } from '../context/PaintingContext';
import { Plus, Loader2, Save, Trash2, Edit, X, ArrowLeft } from 'lucide-react';
import { Painting } from '../types';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { paintings, addPainting, updatePainting, deletePainting } = usePaintings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPainting, setNewPainting] = useState<Partial<Painting>>({
    title: '',
    price: 0,
    dimensions: '',
    type: 'Acrylic Paint',
    image: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

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
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set image filename to be saved in paintings data
    setNewPainting({ ...newPainting, image: file.name });
  };

  const handleEditPainting = (painting: Painting) => {
    setNewPainting({ ...painting });
    setIsEditing(true);
    setShowForm(true);
    // In a real app, you'd fetch the image and set the preview
    setImagePreview(`/images/${painting.image}`); // This is a placeholder path
  };

  const handleDeletePainting = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this painting?')) {
      try {
        // Use the context function to delete the painting
        deletePainting(id);
        setMessage({
          text: 'Painting deleted successfully!',
          type: 'success'
        });
      } catch (error) {
        setMessage({
          text: 'Error deleting painting. Please try again.',
          type: 'error'
        });
      }
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

      // Generate unique ID based on title and dimensions if not editing
      let paintingToSave: Painting;
      
      if (isEditing) {
        paintingToSave = { ...newPainting } as Painting;
        // Use the context function to update the painting
        updatePainting(paintingToSave.id, paintingToSave);
        setMessage({
          text: 'Painting updated successfully!',
          type: 'success'
        });
      } else {
        const id = `${newPainting.title?.toLowerCase().replace(/\s+/g, '-')}-${newPainting.dimensions?.toLowerCase().replace(/\s+/g, '-')}`;
        paintingToSave = { ...newPainting, id } as Painting;
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

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your gallery paintings</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Painting
            </button>
          )}
        </div>

        {/* Alert message */}
        {message.text && (
          <div className={`mb-6 rounded-lg p-4 flex justify-between items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: '', type: '' })}>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Add/Edit Painting Form */}
        {showForm ? (
          <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
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
                {/* Form fields remain unchanged */}
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
                    <label
                      htmlFor="painting-upload"
                      className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-center transition-colors hover:border-indigo-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-700">
                          {imagePreview ? 'Change image' : 'Upload painting image'}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, JPEG up to 5MB
                        </span>
                      </div>
                      <input
                        id="painting-upload"
                        name="image"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageChange}
                        required={!imagePreview}
                        className="sr-only"
                      />
                    </label>

                    {imagePreview && (
                      <div className="ml-5 h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Painting preview"
                          className="h-full w-full object-cover"
                        />
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
          </div>
        ) : (
          /* Paintings list */
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Your Paintings</h2>
            
            {paintings.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No paintings added yet. Click the "Add New Painting" button to get started.</p>
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
                    {paintings.map((painting) => (
                      <tr key={painting.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                            {/* This would be a real image in production */}
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                              Image
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{painting.title}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">{painting.price} EGP</div>
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
                              onClick={() => handleEditPainting(painting)}
                              className="rounded p-1 text-indigo-600 hover:bg-indigo-50"
                              aria-label="Edit painting"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePainting(painting.id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;