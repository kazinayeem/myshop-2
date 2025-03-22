"use client";
import { Search } from "lucide-react";
import { FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { useState } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/reducer/authReducer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { remove } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useGetBrandsQuery } from "@/api/BrandApi";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const { data = [], isLoading } = useGetBrandsQuery({});

  const logoutHandler = () => {
    dispatch(logout());
    remove();
    setMenuOpen(false);
    router.push("/");
  };

  const changeAllproducts = () => {
    setMenuOpen(false);
    router.push("/product");
  };
  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white relative">
      <div className="flex items-center space-x-2">
        <Link href="/">
          {isLoading ? (
            <span className="text-xl font-bold text-gray-700">Loading...</span>
          ) : (
            <Image
              src={data[0]?.logo}
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          )}
        </Link>
        <Link href="/">
          <span className="text-xl font-bold text-gray-700">
            {isLoading ? "Loading..." : data[0]?.name}
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
        <li className="hover:text-black cursor-pointer px-6 md:px-0">Home</li>
        <Link href="/product">
          <li className="hover:text-black cursor-pointer px-6 md:px-0">
            All Products
          </li>
        </Link>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">About</li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          Hot Deals
        </li>
      </ul>

      {/* Search Bar and Icons */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input
            onFocus={changeAllproducts}
            onBlur={() => setMenuOpen(false)}
            onChange={changeAllproducts}
            type="text"
            placeholder="What are you looking for?"
            className="border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-gray-300 w-64"
          />
          <Search className="absolute right-3 top-3 text-gray-500" size={18} />
        </div>

        {/* Profile Dropdown */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white shadow-lg rounded-lg"
            >
              <DropdownMenuItem asChild>
                <Link href="/user/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/address">Address</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/user/order">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={logoutHandler}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">
            <CiLogin className="text-xl text-gray-700 cursor-pointer" />
          </Link>
        )}

        {/* Cart Icon with Quantity Badge */}
        <Link href="/cart" className="relative">
          <FaShoppingCart className="text-xl text-gray-700 cursor-pointer" />
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
              {totalQuantity}
            </span>
          )}
        </Link>
        <FaHeart className="text-xl text-gray-700 cursor-pointer" />
      </div>
    </nav>
  );
}
