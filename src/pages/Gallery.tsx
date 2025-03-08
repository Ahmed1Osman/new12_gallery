import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import { usePaintings } from '../context/PaintingContext'; // Import the paintings context instead

const Gallery = () => {
  const { paintings } = usePaintings(); // Get paintings from context instead of data file
  const { addToCart, applyDiscount } = usePayment();
  const [filteredPaintings, setFilteredPaintings] = useState(paintings);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    sortBy: 'featured'
  });
  
  // Get unique painting types for filter
  const paintingTypes = Array.from(new Set(paintings.map(p => p.type)));
  
  // Price ranges for filtering
  const priceRanges = [
    { label: 'Under 20,000 EGP', min: 0, max: 20000 },
    { label: '20,000 - 40,000 EGP', min: 20000, max: 40000 },
    { label: '40,000 - 60,000 EGP', min: 40000, max: 60000 },
    { label: 'Over 60,000 EGP', min: 60000, max: Infinity }
  ];
  
  // Apply filters when they change or when paintings change
  useEffect(() => {
    let result = [...paintings];
    
    // Filter by type
    if (filters.type) {
      result = result.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
    }
    
    // Filter by price range
    if (filters.priceRange) {
      const range = priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }
    
    // Sort results
    if (filters.sortBy === 'priceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHigh') {
      result.sort((a, b) => b.price - a.price);
    }
    // 'featured' sorting uses default order
    
    setFilteredPaintings(result);
  }, [filters, paintings]); // Add paintings as a dependency so filters update when paintings change
  
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: '',
      priceRange: '',
      sortBy: 'featured'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-center text-4xl font-bold text-gray-900">
            Our Collection
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            Discover unique pieces from the Elnagar Art Studio Collection
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 flex items-center rounded-lg bg-white px-4 py-2 shadow-sm hover:shadow-md"
          >
            <Filter className="mr-2 h-5 w-5" />
            Filter & Sort
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Artwork Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Artwork Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Types</option>
                    {paintingTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Gallery Grid */}
        <div>
          {filteredPaintings.length === 0 ? (
            <div className="my-12 rounded-lg bg-white p-8 text-center shadow">
              <p className="text-lg text-gray-600">No paintings match your filters. Try adjusting your criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPaintings.map((painting) => {
                // Calculate discounted price safely
                const discountedPrice = typeof applyDiscount === 'function' 
                  ? applyDiscount(painting.price) 
                  : painting.price;
                
                // Check if there's actually a discount
                const hasDiscount = discountedPrice < painting.price;
                const discount = painting.price - discountedPrice;
                const discountPercentage = hasDiscount 
                  ? Math.round((discount / painting.price) * 100) 
                  : 0;
                
                return (
                  <div
                    key={painting.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    {/* Discount Badge - only show if there's a discount */}
                    {hasDiscount && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    
                    <Link
                      to={`/gallery/${painting.id}`}
                      className="block"
                      aria-label={`View ${painting.title} details`}
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        {/* Check if image exists and handle appropriately */}
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          {painting.image ? (
                            <img
                              src={`/images/${painting.image}`}
                              alt={painting.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                // Handle image loading errors by displaying a placeholder
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder-image.jpg'; // Fallback image
                              }}
                            />
                          ) : (
                            <span className="text-gray-500 text-sm">Image not available</span>
                          )}
                        </div>
                        
                        {/* Overlay with hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        
                        <div className="absolute bottom-0 left-0 right-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <div className="p-4 text-center text-white">
                            <h3 className="text-xl font-bold drop-shadow-md">
                              {painting.title}
                            </h3>
                            <p className="mt-1 text-lg font-medium text-amber-200">
                              {hasDiscount && (
                                <span className="mr-2 line-through opacity-70">
                                  {painting.price.toLocaleString()} EGP
                                </span>
                              )}
                              {discountedPrice.toLocaleString()} EGP
                            </p>
                            <div className="mt-3">
                              <span className="inline-block rounded-full bg-indigo-600 px-4 py-1 text-sm font-medium">
                                View Details
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="truncate text-lg font-semibold text-gray-900">
                            {painting.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">{painting.type}</span>
                            <span className="mx-2">•</span>
                            {painting.dimensions}
                          </p>
                        </div>
                        <button
                          className="rounded-full bg-indigo-100 p-2 text-indigo-600 transition-colors hover:bg-indigo-200"
                          aria-label="Add to cart"
                          onClick={(e) => {
                            e.preventDefault();
                            if (typeof addToCart === 'function') {
                              addToCart({
                                id: painting.id,
                                title: painting.title,
                                price: discountedPrice
                              });
                            }
                          }}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {hasDiscount ? (
                            <>
                              <span className="line-through text-gray-400">{painting.price.toLocaleString()} EGP</span>
                              <span className="ml-2 text-indigo-600">{discountedPrice.toLocaleString()} EGP</span>
                            </>
                          ) : (
                            <span className="text-indigo-600">{painting.price.toLocaleString()} EGP</span>
                          )}
                        </span>
                        {hasDiscount && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            Website Exclusive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Information Banner */}
        <div className="mt-16 rounded-xl bg-indigo-50 p-6 text-center">
          <h2 className="text-2xl font-bold text-indigo-800">Looking for a custom piece?</h2>
          <p className="mt-2 text-gray-700">
            We also create custom artwork tailored to your preferences and space.
          </p>
          <Link 
            to="/contact" 
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Request a Commission
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;