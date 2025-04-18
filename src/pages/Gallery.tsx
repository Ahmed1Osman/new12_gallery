import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Heart, Search, XCircle, Phone } from 'lucide-react';
import { usePaintings } from '../context/PaintingContext';
import ImageHandler from '../components/ImageHandler';
import DeleteButton from '../components/DeleteButton'; // Import the DeleteButton component
import { useAuth } from '../context/AuthContext'; // Import for checking authentication

const Gallery = () => {
  const { paintings, refreshPaintings } = usePaintings();
  // Removed unused addToCart to avoid compile error
  const { isAuthenticated } = useAuth(); // Get authentication status
  const [filteredPaintings, setFilteredPaintings] = useState(paintings);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoritePaintings');
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    sortBy: 'featured',
    onlyFavorites: false
  });
  
  // Debug: Log paintings when they change
  useEffect(() => {
    console.log("Gallery component received paintings:", paintings);
    if (paintings.length > 0) {
      console.log("Sample painting:", paintings[0]);
    }
  }, [paintings]);
  
  const paintingTypes = Array.from(new Set(paintings.map(p => p.type)));
  
  const priceRanges = [
    { label: 'Under 20,000 EGP', min: 0, max: 20000 },
    { label: '20,000 - 40,000 EGP', min: 20000, max: 40000 },
    { label: '40,000 - 60,000 EGP', min: 40000, max: 60000 },
    { label: 'Over 60,000 EGP', min: 60000, max: Infinity }
  ];

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoritePaintings', JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    let result = [...paintings];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const range = priceRanges.find(r => r.label === filters.priceRange);
      if (range) {
        result = result.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }
    
    // Apply favorites filter
    if (filters.onlyFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }
    
    // Apply sorting
    if (filters.sortBy === 'priceLow') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHigh') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    setFilteredPaintings(result);
  }, [filters, paintings, searchTerm, favorites]);
  
  const handleFilterChange = (filterType: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: '',
      priceRange: '',
      sortBy: 'featured',
      onlyFavorites: false
    });
    setSearchTerm('');
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Calculate discounted price (5% discount)
  const calculateDiscountedPrice = (price: number) => {
    return price * 0.95;
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
          
          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-full border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Search paintings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchTerm('')}
                >
                  <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4 flex items-center rounded-lg bg-white px-4 py-2 shadow-sm hover:shadow-md"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filter & Sort
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="favorites-filter"
                checked={filters.onlyFavorites}
                onChange={(e) => handleFilterChange('onlyFavorites', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="favorites-filter" className="ml-2 text-sm text-gray-700">
                Show favorites only
              </label>
            </div>
          </div>
          
          {showFilters && (
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest First</option>
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
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Stats bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredPaintings.length}</span> out of <span className="font-medium text-gray-900">{paintings.length}</span> paintings
          </div>
          {(searchTerm || filters.type || filters.priceRange || filters.onlyFavorites) && (
            <button 
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Clear filters
            </button>
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
                console.log(`Rendering painting ${painting.id}:`, painting);
                const discountedPrice = calculateDiscountedPrice(painting.price);
                const hasDiscount = discountedPrice < painting.price;
                const discountPercentage = 5; // Fixed at 5%
                const isFavorite = favorites.includes(painting.id);
                
                return (
                  <div
                    key={painting.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    {hasDiscount && (
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        {discountPercentage}% OFF
                      </div>
                    )}
                    
                    {/* Favorite button */}
                    <button
                      className={`absolute right-4 top-4 z-10 rounded-full p-2 ${
                        isFavorite ? 'bg-red-100 text-red-500' : 'bg-white/70 text-gray-400 hover:text-gray-700'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(painting.id);
                      }}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart 
                        className="h-5 w-5" 
                        fill={isFavorite ? "currentColor" : "none"} 
                      />
                    </button>
                    
                    {/* Add DeleteButton for admin users */}
                    {isAuthenticated && (
                      <div className="absolute right-4 top-16 z-10">
                        <DeleteButton
                          paintingId={painting.id}
                          imageUrl={painting.image}
                          onSuccess={() => refreshPaintings()}
                        />
                      </div>
                    )}
                    
                    <Link
                      to={`/gallery/${painting.id}`}
                      className="block"
                      aria-label={`View ${painting.title} details`}
                    >
                      <div className="aspect-square w-full overflow-hidden">
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          {painting.image ? (
                            <ImageHandler
                              imageSource={painting.image}
                              alt={painting.title}
                              className="h-full w-full"
                              objectFit="cover"
                              preserveAspectRatio={false}
                            />
                          ) : (
                            <span className="text-gray-500 text-sm">Image not available</span>
                          )}
                        </div>
                        
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
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{painting.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{painting.type}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {hasDiscount && (
                            <span className="mr-2 text-sm text-gray-500 line-through">
                              {painting.price.toLocaleString()} EGP
                            </span>
                          )}
                          <span className="text-lg font-semibold text-gray-900">
                            {discountedPrice.toLocaleString()} EGP
                          </span>
                        </div>
                        <Link
                          to={`/gallery/${painting.id}`}
                          className="flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          aria-label={`View details for ${painting.title}`}
                        >
                          <Phone className="mr-1 h-4 w-4" />
                          Contact
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;