import SearchForm from "@/components/SearchForm";
import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import FeatureCard from "@/components/FeatureCard";
import { ProductTypeCard } from "@/components/ProductCard";
import SimpleStripeButton from "@/components/SimpleStripeButton";

import { PRODUCT_QUERY } from "@/sanity/lib/queries";

export default async function Home({ searchParams }: { searchParams: { query?: string } }) {
  const params = await searchParams;
  const query = params.query || null;
  const posts = await client.fetch(PRODUCT_QUERY, { search: query });

  // For debugging purposes
  console.log("Posts from Sanity:", JSON.stringify(posts, null, 2));

  return (
    <>
      <section className="hero_container">
        <h1 className="heading">Protect your ideas with the best team...</h1>
        <p className="subheading bg-leather">
          We are a team of professionals who are dedicated to protecting your
          ideas and making them a reality.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="hero_card_container">
        <div>
          <h2 className="text-30-semibold">This is the hero card container</h2>
          <p className="text-16-medium">
            We offer a wide range of services to help you protect your ideas and
            make{" "}
          </p>
          <FeatureCard
            containerColor="var(--color-pearl-bush-300)"
            lineColor="#3b82f6"
            iconName="Star"
            title="This is the FeatureCard"
            description="Access exclusive tools and capabilities designed to enhance your experience."
            personImage="/happyguy.png"
            personAlt="Happy customer"
            iconPosition="bottom-right"
          />
        </div>

        <div></div>
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search Results for "${query}"` : 'All Services'}
        </p>
        
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => {
              if (!post || typeof post !== "object") {
                return null;
              }
              
              // Create a properly formatted product object
              const productPost: ProductTypeCard = {
                name: post.name || "Unnamed Product",
                category: post.category || "Uncategorized",
                description: post.description || "No description available",
                _id: post._id || "",
                slug: {
                  current: post.slug?.current || "",
                  type: post.slug?.type || "slug",
                },
                basePrice: parseFloat(post.basePrice || post.price || "0"),
                image: post.image || "/placeholder-product.jpg",
                features: post.features || []
              };
              
              return <ProductCard key={post._id} post={productPost} />;
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 font-medium">
                No services available. {query ? "Try a different search term." : "Check back soon."}
              </p>
            </div>
          )}
        </div>
        <div>
          <SimpleStripeButton 
            productName="Standard Protection Package" 
            amount={2500}  // $25.00
          />
        </div>
      </section>
    </>
  );
}
