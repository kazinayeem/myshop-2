"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaAddressBook,
  FaBars,
  FaCreditCard,
  FaShoppingCart,
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Track the sidebar open/close state

  return (
    <div className="relative">
      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden p-4">
        <FaBars
          className="text-white text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} // Toggle sidebar open/close on click
        />
      </div>

      {/* Mobile Sidebar (visible when isOpen is true) */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-64 bg-gray-800 text-white h-full p-4 space-y-6 transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "left-0" : "-left-64"
        }`}
      >
        <div className="text-center text-2xl font-bold">User Dashboard</div>

        <ul className="space-y-4">
          <li>
            <Link
              href="/user/profile"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <FaAddressBook size={20} />
              <span>Address</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/address"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <FaAddressBook size={20} />
              <span>Address</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/order"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <FaShoppingCart size={20} />
              <span>Order</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user/payment"
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <FaCreditCard size={20} />
              <span>Payment</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Desktop Sidebar */}
      <div className="lg:block hidden">
        <div className="lg:flex lg:flex-col lg:w-64 bg-gray-800 text-white h-full p-4 space-y-6">
          <div className="text-center text-2xl font-bold">User Dashboard</div>

          <ul className="space-y-4">
            <li>
              <Link
                href="/user/profile"
                className="flex items-center space-x-2 hover:text-gray-400"
              >
                <FaAddressBook size={20} />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/address"
                className="flex items-center space-x-2 hover:text-gray-400"
              >
                <FaAddressBook size={20} />
                <span>Address</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/order"
                className="flex items-center space-x-2 hover:text-gray-400"
              >
                <FaShoppingCart size={20} />
                <span>Order</span>
              </Link>
            </li>
            <li>
              <Link
                href="/user/payment"
                className="flex items-center space-x-2 hover:text-gray-400"
              >
                <FaCreditCard size={20} />
                <span>Payment</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
