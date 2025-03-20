"use client";
import { Search } from "lucide-react";
import { FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/reducer/authReducer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { remove } from "@/app/actions";
import { useRouter } from "next/navigation";
interface Brand {
  _id: number;
  name: string;
  logo: string;
}

export default function Navbar() {
  const router = useRouter();
  const [brand, setBrand] = useState<Brand[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const isLoggedIn = useAppSelector((state) => state.auth.isAuthenticated);

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

  const logoutHandler = () => {
    dispatch(logout());
    remove();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          {brand[0]?.logo && (
            <Image
              width={40}
              height={40}
              src={brand[0].logo}
              alt="Brand Logo"
              className="w-10 h-10 rounded-full"
            />
          )}
        </Link>
        <Link href="/">
          <span className="text-xl font-bold text-gray-700">
            {brand[0]?.name}
          </span>
        </Link>
      </div>
      <div className="lg:hidden md:flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <FaBars size={30} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white shadow-lg rounded-lg"
          >
            <DropdownMenuItem asChild>
              <Link href="/product">All Prodcut</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/new/">New Collection</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/user/order">Orders</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <button
        className="md:hidden lg:hidden text-xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </button> */}

      {/* Navigation Links */}
      <ul
        className={`md:flex space-x-6 text-gray-700 absolute md:static bg-white w-full md:w-auto md:flex-row flex-col md:space-y-0 space-y-4 md:items-center left-0 top-16 transition-all duration-300 ease-in-out lg:items-center  ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          <Link href="/product">All Product</Link>
        </li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          <Link href="/new">New Collection</Link>
        </li>

        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          <Link href="/about">About</Link>
        </li>
        <li className="hover:text-black cursor-pointer px-6 md:px-0">
          <Link href="/contact">Contact</Link>
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

        {/* Profile Dropdown */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <CgProfile size={30} className="cursor-pointer" />
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
