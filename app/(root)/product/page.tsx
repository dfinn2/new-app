import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import { PRODUCT_QUERY } from "@/sanity/lib/queries";
import { ProductTypeCard } from "@/components/ProductCard";
import { SanityProduct } from "@/types/sanity";
import Image from "next/image";
import { Star } from "lucide-react";

export default async function ProductsPage() {
  // Fetch all products
  const products = await client.fetch(PRODUCT_QUERY);

  return (
    <>
      <section className="hero_container !min-h-[200px]">
        <h1 className="heading">Our Products</h1>
        <p className="subheading">
          Explore our selection of professional services and products designed to protect your ideas
        </p>
      </section>

      <section className="section_container py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products && products.length > 0 ? (
              products.map((product: SanityProduct) => {
                if (!product || typeof product !== "object") {
                  return null;
                }
                
                // Format product data for the ProductCard component
                const productData: ProductTypeCard = {
                  name: product.name || "Unnamed Product",
                  category: product.category || "Uncategorized",
                  description: product.description || "No description available",
                  _id: product._id || "",
                  slug: typeof product.slug === 'string' ? product.slug : product.slug?.current || "",
                  basePrice: product.basePrice || 0,
                };
                
                return <ProductCard key={product._id} post={productData} />;
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 font-medium">
                  No products available. Check back soon!
                </p>

                  {/* Review avatars and rating */}
                                  <div className="flex justify-center items-center">
                                    <div className="flex flex-col items-center">
                                      <div className="flex items-center mb-2">
                                        <div className="flex -space-x-2">
                                          <Image
                                            src="https://randomuser.me/api/portraits/men/32.jpg"
                                            width={40}
                                            height={40}
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-white z-30"
                                          />
                                          <Image
                                            src="https://randomuser.me/api/portraits/women/44.jpg"
                                            width={40}
                                            height={40}
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-white z-20"
                                          />
                                          <Image
                                            src="https://randomuser.me/api/portraits/men/51.jpg"
                                            width={40}
                                            height={40}
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-white z-10"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center">
                                        <span className="font-semibold text-gray-800 mr-1">
                                          Reviews 4.3
                                        </span>
                                        <span className="text-gray-600">
                                          <Star size={16} />
                                        </span>
                                      </div>
                                    </div>
                                  </div>

              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}