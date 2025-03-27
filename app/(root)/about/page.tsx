// app/(root)/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Shield, 
  Users, 
  CheckCircle, 
  Calendar,
  ArrowRight
} from "lucide-react";

export default function AboutUsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Protecting your intellectual property and business interests 
            with expert legal solutions for global manufacturing.
          </p>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 px-10 bg-white">
        <div className="container mx-auto px-4 mx-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <Image
                  src="/mission-image.jpg"
                  alt="Our mission"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At YLD, our mission is to empower businesses to confidently enter and navigate 
                the global manufacturing landscape, particularly in China, by providing comprehensive 
                legal protection for their intellectual property and business interests.
              </p>
              <p className="text-gray-700 mb-4">
                We believe that innovation should be protected, and that businesses of all sizes 
                deserve access to high-quality legal solutions that safeguard their ideas, designs, 
                and proprietary information.
              </p>
              <p className="text-gray-700">
                Through our expertise in international business law and intellectual property protection, 
                we strive to be the trusted partner that enables our clients to focus on growth and innovation 
                while we handle the complex legal considerations of global manufacturing relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Sets Us Apart</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Expertise</h3>
              <p className="text-gray-600">
                Our team has extensive experience in international business law, with specific 
                focus on manufacturing in China and intellectual property protection across borders.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Protection</h3>
              <p className="text-gray-600">
                Our legal templates and services have successfully protected the intellectual 
                property of thousands of businesses, from startups to established enterprises.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Client-Focused</h3>
              <p className="text-gray-600">
                We believe in making legal protection accessible, offering solutions that are 
                both comprehensive and easy to understand and implement for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="border-l-4 border-blue-500 pl-6 mb-12">
              <h3 className="text-xl font-semibold mb-2">2017: The Beginning</h3>
              <p className="text-gray-700 mb-6">
                YLD was founded by a team of international business lawyers who identified a critical gap 
                in legal protection for businesses manufacturing in China. After witnessing numerous clients 
                face intellectual property theft and contract disputes, we set out to create accessible legal 
                solutions specifically designed for global manufacturing relationships.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">2019: Expanding Our Reach</h3>
              <p className="text-gray-700 mb-6">
                After helping over 500 clients successfully protect their intellectual property, we expanded 
                our service offerings to include trademark registration, patent services, and custom legal 
                consulting for businesses of all sizes, from startups to multinational corporations.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">2021: Digital Transformation</h3>
              <p className="text-gray-700 mb-6">
                Recognizing the need for faster, more accessible legal solutions, we launched our digital 
                platform, allowing clients to customize and download legal documents instantly while still 
                maintaining the high quality and legal validity our reputation was built on.
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Today: Your Trusted Partner</h3>
              <p className="text-gray-700">
                Today, YLD continues to evolve and innovate, serving thousands of clients worldwide with comprehensive 
                legal protection for their intellectual property and business interests. Our team of experts remains 
                committed to our founding mission: empowering businesses to confidently navigate global manufacturing 
                with their innovations and ideas fully protected.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Our Impact</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">7+</p>
                  <p className="text-sm text-gray-600">Years of Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">3,500+</p>
                  <p className="text-sm text-gray-600">Clients Served</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">98%</p>
                  <p className="text-sm text-gray-600">Client Satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">40+</p>
                  <p className="text-sm text-gray-600">Countries Reached</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Optional, can be removed or expanded */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Meet Our Expert Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-12">
            Our team consists of international business lawyers, IP specialists, and industry experts 
            with deep experience in global manufacturing and Chinese business law.
          </p>
          
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/team">View Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Schedule a Consultation</h2>
            <p className="text-gray-700 mb-8">
              Want to learn more about how we can help protect your business? 
              Schedule a free 30-minute consultation with one of our legal experts.
            </p>
            
            {/* Calendly Placeholder - Replace with actual Calendly embed */}
            <div className="bg-gray-100 p-8 rounded-lg border border-gray-200 mb-8">
              <div className="flex flex-col items-center">
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Calendly Booking Widget</h3>
                <p className="text-gray-600 mb-6">
                  Select a time that works for you, and our team will reach out to confirm your appointment.
                </p>
                
                {/* This is a placeholder button - replace with actual Calendly implementation */}
                <Button size="lg" className="w-full max-w-md">
                  Book Your Free Consultation
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Prefer to email us directly? Contact us at <a href="mailto:contact@yld.com" className="text-blue-600 hover:underline">contact@yld.com</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}