// components/ProductPrice.tsx
'use client';

import { useUserLocation } from '@/lib/location';

export default function ProductPrice({ product }) {
  const { location, loading } = useUserLocation();
  
  if (loading) return <span>Loading price...</span>;
  
  // Check for localized price
  const localPrice = product.localPrice || 
    (product.localized_prices && product.localized_prices[location.currency]);
  
  if (localPrice) {
    return <span className="font-bold text-blue-600">{localPrice.formatted}</span>;
  }
  
  // Fallback to base price
  return (
    <div>
      <span className="font-bold">${product.base_price || 0}</span>
      <span className="text-xs text-gray-500 ml-1">
        (Will be converted to {location.currency} at checkout)
      </span>
    </div>
  );
}