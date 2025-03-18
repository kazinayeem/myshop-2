"use client";
import { Search } from "lucide-react";
import { FaHeart, FaShoppingCart, FaBars,  } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
interface Brand {
  _id: number;
  name: string;
  logo: string;
}

export default function Navbar() {
  const [brand, setBrand] = useState<Brand[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(
          "https://myshop-2-production.up.railway.app/api/brands"
        );
        const data = await response.json();
        setBrand(data);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
    fetchBrand();
  }, []);

  return (
    <nav className="flex justify-between  items-center px-10 py-4 shadow-md bg-white relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image
            width={40}
            height={40}
            src={brand[0]?.logo}
            alt="Brand Logo"
            className="w-10 h-10 rounded-full"
          />
        </Link>
        {/* Brand Name */}
        <Link href="/">
          <span className="text-xl font-bold text-gray-700">
            {brand[0]?.name}
          </span>
        </Link>
      </div>

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
        {/* login and logout */}
        <Link
          href="/auth"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          <CiLogin className="text-xl" />
        </Link>
      </div>
    </nav>
  );
}
