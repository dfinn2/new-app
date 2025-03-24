// lib/stripe/products.ts
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface EnhancedProduct {
  id: string;
  name: string;
  description?: string;
  localPrice?: {
    amount: number;
    currency: string;
    formatted: string;
  };
}

export async function getProduct(productId: string, currency?: string) {
  try {
    // First try to get product from database
    const supabase = await createClient();
    const { data: dbProduct } = await supabase
      .from('product_db')
      .select('*, localized_prices')
      .eq('stripe_product_id', productId)
      .single();
    
    // If product exists in database
    if (dbProduct) {
      // Check if we have cached pricing for this currency
      if (currency && dbProduct.localized_prices && dbProduct.localized_prices[currency]) {
        return {
          ...dbProduct,
          localPrice: dbProduct.localized_prices[currency]
        };
      }
      
      // If we need fresh pricing, get it from Stripe
      if (currency) {
        const { data: prices } = await stripe.prices.list({
          product: productId,
          active: true,
          currency: currency.toLowerCase()
        });
        
        if (prices && prices.length > 0) {
          const price = prices[0];
          const localPrice = {
            amount: price.unit_amount! / 100,
            currency: price.currency,
            formatted: formatPrice(price.unit_amount!, price.currency)
          };
          
          return {
            ...dbProduct,
            localPrice
          };
        }
      }
      
      return dbProduct;
    }
    
    // If not in database, fetch directly from Stripe
    const product = await stripe.products.retrieve(productId);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
}