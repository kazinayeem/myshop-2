import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Brand Name */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">DEV SHOP</h2>
          <p className="text-sm text-gray-400">Creating amazing experiences</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 md:mt-0">
          <a href="#" className="hover:text-white">
            Home
          </a>
          <a href="#" className="hover:text-white">
            About
          </a>
          <a href="#" className="hover:text-white">
            Services
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6 mt-6 md:mt-0">
          <a href="#" className="hover:text-white">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-white">
            <Github size={20} />
          </a>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex justify-center gap-8">
          <Image
            src="/Bkash-Logo-removebg-preview.png"
            alt="bKash"
            className="h-10"
            width={100}
            height={100}
          />
          <Image
            src="/Nagad-Logo.wine-removebg-preview.png"
            alt="Nagad"
            className="h-10"
            width={100}
            height={100}
          />

          <Image
            src="/logo-removebg-preview.png"
            alt="SSLCommerz"
            className="h-10"
            width={100}
            height={100}
          />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} YourBrand. All rights reserved.
      </div>
    </footer>
  );
}
