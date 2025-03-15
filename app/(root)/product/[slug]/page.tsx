'use client'

import { PRODUCT_PAGE_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import React, { useState, use } from 'react'
import { notFound } from "next/navigation"
import markdownit from 'markdown-it';
import BuyNowButton from '@/components/BuyNowButton';
import { Button } from "@/components/ui/button";

const md = markdownit()

// This async function needs to be separated since we're in a client component
async function getProductData(slug: string) {
  return await client.fetch(PRODUCT_PAGE_QUERY, { slug });
}

interface Product {
  title: string;
  productId: string;
  stripePriceId: string;
  stripeProductId: string;
  description: string;
  name: string;
  category: string;
  basePrice?: number;
  content?: string;
  _id: string;
}

const Page = ({ params }: { params: Promise<{ slug: string }> }) => {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  
  const [showForm, setShowForm] = useState(false);
  const [post, setPost] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductData(slug);
        if (!data) {
          notFound();
          return;
        }
        setPost(data);
        setParsedContent(md.render(data?.content || ''));
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post) return null;

  return (
    <>
      <section className="hero_container !min-h-[180px]">
        <h1 className="text-3xl">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      
      <section className="section_container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Container with animation */}
          <div className="relative min-h-[500px]">
            {/* Information Card */}
            <div 
              className={`absolute inset-0 bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out ${
                showForm ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{post.name}</h2>
                  <p className="category-tag">{post.category}</p>
                </div>
                                
                <p className="text-gray-600">YYY {post.description}</p>
                
                {post.basePrice && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Base Price</h3>
                    <p className="text-xl font-bold text-emerald-600">${post.basePrice}</p>
                  </div>
                )}
                
                
                
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-1/2"
                >
                  Get Started
                </Button>
              </div>
            </div>
            
            {/* Form Card */}
            <div 
              className={`absolute inset-0 bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                showForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Get Started</h2>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    ← Back
                  </button>
                </div>
                
                <form className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter your name" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter your email" />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" id="phone" className="w-full border border-gray-300 rounded-md p-2" placeholder="Enter your phone number" />
                  </div>
                  
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition">
                    Submit Request
                  </button>
                </form>
                
              </div>
            </div>
          </div>
          
          {/* Right Column - Legal Document Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold">Legal Document Preview</h2>
              <p className="text-gray-600">Template for: {post.title}</p>
            </div>
            
            <div className="prose max-w-none">
              {parsedContent ? (
                <article
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                />
              ) : (
                <p className="text-gray-500 italic">No document preview available</p>
              )}
            </div>
            
          </div>
        </div>
      </section>
      <section className="section_container">
        {/* Buy Now Button */}
        <div className="max-w-md">
                <BuyNowButton
                  productId={post._id} 
                  productName={post.name}
                  price={post.basePrice || 0}
                  description={post.description}
                  stripePriceId={post.stripePriceId}
                  stripeProductId={post.stripeProductId}
                  slug={slug}
                />
        </div>
        </section>
    </>
  )
}

export default Page
