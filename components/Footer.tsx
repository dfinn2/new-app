import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-xs">
      <div className="container mx-auto px-2 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Address Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Main Office</h3>
            <div className="flex items-start ml-2">
                <p className="text-gray-300">
                    123 Business Avenue<br />
                    Suite 456<br />
                    New York, NY 10001
                </p>
            </div>
            <div className="flex items-center ml-2">
              <Phone className="w-4 h-4 text-white mr-2" />
              <p className="text-gray-300">(555) 123-4567</p>
            </div>
            <div className="flex items-center ml-2">
              <Mail className="w-4 h-4 text-white mr-2" />
              <p className="text-gray-300">info@yourcompany.com</p>
            </div>
            
            {/* Map placeholder - can be replaced with actual MapBox integration */}
            <div className="h-30 w-50 bg-gray-800 rounded-md flex items-center justify-center mt-3 border border-gray-700">
              <p className="text-sm text-gray-400">Interactive Map</p>
            </div>
          </div>
          
          {/* Second Address Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">China Office</h3>
            <div className="flex items-start ml-2">
                <p className="text-gray-300">
                    123 Business Avenue<br />
                    Suite 456<br />
                    New York, NY 10001
                </p>
            </div>
            <div className="flex items-center ml-2">
              <Phone className="w-4 h-4 text-white mr-2" />
              <p className="text-gray-300">(555) 123-4567</p>
            </div>
            <div className="flex items-center ml-2">
              <Mail className="w-4 h-4 text-white mr-2" />
              <p className="text-gray-300">info@yourcompany.com</p>
            </div>
            
            {/* Map placeholder - can be replaced with actual MapBox integration */}
            <div className="h-30 w-50 bg-gray-800 rounded-md flex items-center justify-center mt-3 border border-gray-700">
              <p className="text-sm text-gray-400">Interactive Map</p>
            </div>
          </div>
          
          {/* Sitemap Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sitemap</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/startups" className="text-gray-300 hover:text-white transition-colors">
                  Startups
                </Link>
              </li>
              <li>
                <Link href="/knowledge-base" className="text-gray-300 hover:text-white transition-colors">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal and Contact Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-gray-300 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-gray-300 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-gray-300 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 text-gray-300 hover:text-primary transition-colors" />
              </Link>
            </div>
            
            <div className="pt-4">
              <h3 className="text-xl font-semibold">Newsletter</h3>
              <p className="text-gray-300 text-sm mt-2">Subscribe to receive updates</p>
              <form className="mt-2 flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-3 py-2 rounded-l-md border border-gray-700 focus:outline-none focus:border-primary text-sm flex-1"
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white px-3 py-2 rounded-r-md text-sm hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Image src="/logo.png" alt="Company Logo" width={100} height={30} className="mr-3" />
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                Designed and developed with ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
