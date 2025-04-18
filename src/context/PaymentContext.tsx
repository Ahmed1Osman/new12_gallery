import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import React from 'react';

// Define interfaces
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt?: string;
}

interface PaymentContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'addedAt'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyDiscount: (price: number, discountCode?: string) => number;
  clearCart: () => void;
  getTotal: () => number;
  cartCount: number;
  isLoading: boolean;
  error: string | null;
}

// Utility type for omitting properties
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Create context with proper undefined initial state
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Constants
const STORAGE_KEY = 'cart';
const DEFAULT_DISCOUNT = 0.95; // 5% discount

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      setIsLoading(true);
      const storedCart = localStorage.getItem(STORAGE_KEY);
      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        // Validate cart items
        const validCart = parsedCart.filter(item => 
          item.id && 
          item.title && 
          typeof item.price === 'number' && 
          typeof item.quantity === 'number' && 
          item.quantity > 0
        );
        setCart(validCart);
      }
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error loading cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync cart with localStorage
  React.useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (err) {
        setError('Failed to save cart');
        console.error('Error saving cart:', err);
      }
    }
  }, [cart, isLoading]);

  // Add item to cart
  const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'addedAt'>) => {
    if (!item.id || !item.title || typeof item.price !== 'number') {
      setError('Invalid item data');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, addedAt: new Date().toISOString() }];
    });
    setError(null);
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id: string) => {
    setCart(prev => {
      const exists = prev.some(i => i.id === id);
      if (!exists) {
        setError('Item not found in cart');
        return prev;
      }
      return prev.filter(i => i.id !== id);
    });
    setError(null);
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    setCart(prev => {
      const exists = prev.find(i => i.id === id);
      if (!exists) {
        setError('Item not found in cart');
        return prev;
      }
      
      if (quantity === 0) {
        return prev.filter(i => i.id !== id);
      }
      
      return prev.map(i => 
        i.id === id ? { ...i, quantity } : i
      );
    });
    setError(null);
  }, []);

  // Apply discount with optional discount code
// Simplify to always apply 5% discount
  const applyDiscount = useCallback((price: number, discountCode?: string): number => {
    if (typeof price !== 'number' || price < 0) {
      setError('Invalid price');
      return price;
    }
    
    // Always apply 5% discount regardless of code
    const discountedPrice = price * 0.95;
    return Number(discountedPrice.toFixed(2));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
    setError(null);
  }, []);

  // Calculate total
  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => 
      total + applyDiscount(item.price) * item.quantity, 0
    );
  }, [cart, applyDiscount]);

  // Get cart items count
  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Memoized context value
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    clearCart,
    getTotal,
    cartCount,
    isLoading,
    error,
  }), [
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    clearCart,
    getTotal,
    cartCount,
    isLoading,
    error,
  ]);

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook with type safety
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

// Example usage component to verify functionality
export const CartExample: React.FC = () => {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    applyDiscount, 
    clearCart, 
    getTotal, 
    cartCount,
    error,
    isLoading 
  } = usePayment();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <button 
        onClick={() => addToCart({ id: '1', title: 'Test Painting', price: 100 })}
      >
        Add Item
      </button>
      <button onClick={() => removeFromCart('1')}>Remove Item</button>
      <button onClick={() => updateQuantity('1', 2)}>Set Quantity to 2</button>
      <button onClick={clearCart}>Clear Cart</button>
      
      <div>Items in cart: {cartCount}</div>
      <div>Total: {getTotal().toFixed(2)} EGP</div>
      <div>Discounted Price (100): {applyDiscount(100, 'WEBSITE5')} EGP</div>
      
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.title} - {item.quantity} x {item.price} EGP
          </li>
        ))}
      </ul>
    </div>
  );
};