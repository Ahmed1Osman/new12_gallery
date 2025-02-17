import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { paintings } from '../data/paintings';
import { usePayment } from '../context/PaymentContext';

const Gallery = () => {
  const { addToCart, applyDiscount } = usePayment();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-center text-4xl font-bold text-gray-900">
          Our Collection
        </h1>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paintings.map((painting) => {
            const discountedPrice = applyDiscount(painting.price);
            
            return (
              <div
                key={painting.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <Link
                  to={`/gallery/${painting.id}`}
                  className="block"
                  aria-label={`View ${painting.title} details`}
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={`/images/${painting.image}`}
                      alt={painting.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="absolute bottom-0 left-0 right-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="space-y-2 p-4 text-center text-white">
                        <h3 className="text-xl font-bold drop-shadow-md">
                          {painting.title}
                        </h3>
                        <p className="text-lg font-medium text-amber-200">
                          <span className="line-through mr-2 opacity-70">
                            {painting.price.toLocaleString()} EGP
                          </span>
                          {discountedPrice.toLocaleString()} EGP
                        </p>
                        <p className="text-sm font-medium">Website Exclusive Price</p>
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
                      className="rounded-full p-2 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      aria-label="Add to cart"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: painting.id,
                          title: painting.title,
                          price: painting.price
                        });
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Original Price: {painting.price.toLocaleString()} EGP
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      -5% Website Discount
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;