// app/(root)/product/[slug]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import UpdatedProductClient from "./product-client";

// Server component to fetch product data
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  // Fetch product from Supabase server-side
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from('product_db')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error || !product) {
    console.error(`Error fetching product with slug '${slug}':`, error);
    notFound();
  }
  
  // Transform the data to match the format expected by components
  const Product = {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: product.base_price,
    stripePriceId: product.stripe_price_id,
    stripeProductId: product.stripe_product_id,
    slug: product.slug,
    content: product.content,
    category: product.category
  };

  return <UpdatedProductClient product={Product} slug={slug} />;
}