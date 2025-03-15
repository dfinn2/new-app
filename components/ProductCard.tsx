import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type ProductTypeCard = {
  name: string;
  category: string;
  description: string;
  _id: string;
  slug: string;
  basePrice: number;
  
};

const ProductCard = ({ post }: { post: ProductTypeCard }) => {
  const { name, category, description, _id, slug, basePrice } = post;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-full transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
    
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        <p>{category}</p>
        <p>{_id}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="font-bold text-lg">
            ${basePrice.toFixed(2)}
          </p>
          
          <Button asChild variant="default" size="sm">
            <Link href={`/product/${slug}`}>
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
