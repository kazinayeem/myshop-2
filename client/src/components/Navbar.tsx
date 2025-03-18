"use client";
import { Search } from "lucide-react";
import { FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between  items-center px-10 py-4 shadow-md bg-white relative">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/" className="text-gray-700">
          <span className="text-red-500">Shop</span>Easy
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </button>

      {/* Navigation Links */}
      <ul
        className={`md:flex space-x-6 text-gray-700 absolute md:static bg-white w-full md:w-auto md:flex-row flex-col md:space-y-0 space-y-4 md:items-center left-0 top-16 transition-all duration-300 ease-in-out ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <li className="border-b-2 border-black pb-1 px-6 md:px-0">Home</li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          Contact
        </li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">About</li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          Sign Up
        </li>
      </ul>

      {/* Search Bar and Icons */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-300 w-64"
          />
          <Search className="absolute right-3 top-3 text-gray-500" size={18} />
        </div>
        <FaHeart className="text-xl text-gray-700 cursor-pointer" />
        <FaShoppingCart className="text-xl text-gray-700 cursor-pointer" />
      </div>
    </nav>
  );
}
