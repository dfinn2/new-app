// components/ProductCard.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Updated to match Supabase schema
export type ProductTypeCard = {
  id: string;
  title: string;
  category?: string;
  description?: string;
  base_price: number;
  stripe_product_id?: string;
  stripe_price_id?: string;
  is_active?: boolean;
};

// Updated ProductCard component that accepts Supabase data structure
const ProductCard = ({ product }: { product: ProductTypeCard }) => {
  const { id, title, category, description, base_price } = product;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
    
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description || "No description available"}
        </p>
        
        {category && <p className="text-sm text-gray-500 mb-2">{category}</p>}
        
        <div className="flex items-center justify-between mt-auto">
          <p className="font-bold text-lg">
            ${(base_price || 0).toFixed(2)}
          </p>
          
          <Button asChild variant="default" size="sm">
            <Link href={`/product/${id}`}>
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;