import ProductCard from "@/components/ProductCard";
import { client } from "@/sanity/lib/client";
import { ProductTypeCard } from "@/components/ProductCard";
import { SanityProduct } from "@/types/sanity";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  Globe,
  Shield,
  ScrollText,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

import { PRODUCT_QUERY } from "@/sanity/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const params = await searchParams;
  const query = params.query || null;
  const posts = await client.fetch(PRODUCT_QUERY, { search: query });

  // For debugging purposes
  console.log("Posts from Sanity:", JSON.stringify(posts, null, 2));

  return (
    <>
      {/* New NNN Agreement CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#ffe6d2] via-[#fff3e9] to-[#fff5e7]">
        <div className="container mx-auto px-4 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - CTA Content */}
            <div className="text-left space-y-6">
              <h2 className="text-4xl font-bold tracking-tight">
                Complete legal solutions for IP Protection in China
              </h2>

              <p className="text-lg text-gray-600">
                Our Non-Disclosure, Non-Compete, and Non-Circumvention Agreement
                provides comprehensive protection for your business ideas and
                intellectual property.
              </p>

              <ul className="text-lg text-gray-600 space-y-4">
                <li className="flex items-start">
                  <Check size={24} className="text-green-500 mr-4 shrink-0" />
                  <span>
                    Legally binding legal contracts for your confidential
                    information.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check size={24} className="text-green-500 mr-4 shrink-0" />
                  <span>
                    Prevent your manufacturer and others from competing with
                    your products.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check size={24} className="text-green-500 mr-4 shrink-0" />
                  <span>Get advice, trademarks and patents from industry experts.</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/product/nnn-agreement-cn">
                    Get Your NNN Agreement <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link href="#services">Explore Protection Packages</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Hero Image and Reviews */}
            <div className="flex flex-col items-center">
              {/* Image container */}
              <div className="relative w-11/12 aspect-square">
                <Image
                  src="/hero.png"
                  alt="NNN Agreement Protection"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              
              {/* reviews - now below the image */}
              <div className="w-full">
                              
                
              </div>
            </div>
          </div>
        </div>

        {/* Client and Testimonials section - unchanged */}
        <div className="w-8/12 mx-auto mt-16">
          <div className="max-w-6xl mx-auto">
            {/* Testimonials and */}
            <div className="w-full py-2">
              {/* Top gradient line */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-4"></div>

              {/* Testimonial logos in a responsive, evenly-spaced grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 place-items-center">
                <Image
                  src="/trezorlogo.svg"
                  width={60}
                  height={60}
                  alt="Trezor Client Testimonial"
                  className="max-w-[70px] w-full h-auto"
                />

                <Image
                  src="/qurelogo.svg"
                  width={60}
                  height={60}
                  alt="Qure Client Testimonial"
                  className="max-w-[65px] w-full h-auto"
                />

                <Image
                  src="/vanguardlogo.svg"
                  width={60}
                  height={60}
                  alt="Vanguard Client Testimonial"
                  className="max-w-[65px] w-full h-auto"
                />

                <Image
                  src="/pikllogo.svg"
                  width={60}
                  height={60}
                  alt="Pikl Client Testimonial"
                  className="max-w-[65px] w-full h-auto"
                />

                <Image
                  src="/pikllogo.svg"
                  width={60}
                  height={60}
                  alt="Pikl Client Testimonial"
                  className="max-w-[65px] w-full h-auto"
                />
              </div>

              {/* Bottom gradient line */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mt-4"></div>
              {/* Stats grid */}
              <div className="grid grid-cols-3 text-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600">7+</h3>
                    <p className="text-xs text-blue-600 uppercase tracking-wider">
                      Years experience
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">4.3</h3>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                      Average review
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">24/7</h3>
                    <p className="text-xs text-gray-600 uppercase tracking-wider">
                      Support
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* IP Services for China Manufacturing Section */}
      <section className="bg-gradient-to-br from-[#fff3e9] via-[#fff5e7] to-[#fffffd]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" id="services">
              Complete{" "}
              <span className="bg-black text-white px-2">IP Protection</span> in
              China
            </h2>
            <p className="text-lg text-gray-600">
              We offer comprehensive legal solutions to protect your
              intellectual property when manufacturing in China...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Step 1</h3>
              <p className="text-gray-600">
                Comprehensive legal agreements to protect your intellectual
                property from unauthorized use or disclosure.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Step 2</h3>
              <p className="text-gray-600">
                Templates that comply with international standards and Chinese
                legal requirements for maximum protection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <ScrollText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Step 3</h3>
              <p className="text-gray-600">
                Tailor-made legal documents specific to your industry, products,
                and manufacturing requirements.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/services" className="flex items-center">
                Explore All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Lawyer-Approved Templates Section */}
      <section className="py-20 bg-gradient-to-br from-[#fff5e7] via-[#fffffd] to-[#ffffff]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative w-10/12 aspect-square">
                <Image
                  src="/contract_cartoon.svg"
                  alt="Lawyer-approved templates"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                Tested and Lawyer-Approved Templates
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Every template in our library is crafted by experienced
                  international business lawyers and regularly updated to
                  reflect the latest legal requirements.
                </p>
                <ul className="space-y-3">
                  {[
                    "Reviewed by practicing attorneys",
                    "Tested in real business scenarios",
                    "Updated to reflect current laws",
                    "Used by thousands of businesses",
                  ].map((item) => (
                    <li key={item} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 mt-4">
                  Our templates provide the legal protection you need without
                  the expense of hiring a dedicated legal team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extra bits 
      <div className="transform translate-y-1/2 -rotate-3 bg-highlight-200 px-6 py-2 rounded-sm shadow-md max-w-1/2 z-20">
              <p className="font-bold text-sm">Read more</p>
              <Image
                src="/handrawnarrow.png"
                alt="arrow"
                width={60}
                height={60}
              />
            </div>
            <div className="inline-flex px-4 py-2 mb-4 bg-blue-50 text-gray-700 rounded-md text-sm font-medium border border-gray-400 relative">
              Most Popular
              <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-blue-500 animate-pulse">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
              </span>
            </div>
            <div className="bg-black text-white text-30-extrabold ml-4 mr-4 mt-2 mb-2">
              <span className=""> OTHER SERVICES </span>
            </div>
            */}

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Fill Out the Form</h3>
              <p className="text-gray-600">
                Answer a few simple questions about your specific needs and
                requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Preview in Real-Time
              </h3>
              <p className="text-gray-600">
                See your customized document update instantly as you complete
                the form.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Receive Your Document
              </h3>
              <p className="text-gray-600">
                Get your completed document via email and download link for
                immediate use.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600">
                <span className="font-semibold">Note:</span> All documents are
                delivered in PDF and editable Word format, allowing you to make
                additional changes if necessary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Brief Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="h-14 w-14 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold">About Us</h2>
            </div>

            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
              We are a team of international business lawyers and consultants
              with extensive experience helping companies protect their
              intellectual property when manufacturing in China. With over 15
              years of experience, we have helped thousands of businesses secure
              their IP and navigate international manufacturing relationships
              successfully.
            </p>

            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/about-us" className="flex items-center">
                  Learn More About Our Team{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="hero_card_container">
        <div>
          <h2 className="text-30-semibold">This is the hero card container</h2>
          <p className="text-16-medium">
            We offer a wide range of services to help you protect your ideas and
            make{" "}
          </p>
        </div>

        <div>
          <p className="text-30-semibold">
            {query ? `Search Results for "${query}"` : "All Services"}
          </p>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts && posts.length > 0 ? (
              posts.map((post: SanityProduct) => {
                if (!post || typeof post !== "object") {
                  return null;
                }

                // Create a properly formatted product object
                const productPost: ProductTypeCard = {
                  name: post.name || "Unnamed Product",
                  category: post.category || "Uncategorized",
                  description: post.description || "No description available",
                  _id: post._id || "",
                  slug: post.slug?.current || "",
                  basePrice: post.basePrice || post.price || 0,
                };

                return <ProductCard key={post._id} post={productPost} />;
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 font-medium">
                  No services available.{" "}
                  {query ? "Try a different search term." : "Check back soon."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
