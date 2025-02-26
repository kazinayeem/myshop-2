import { useState } from "react";
import { Link, Outlet } from "react-router";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Box,
  Plus,
  Edit,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Function to toggle dropdown
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-16" : "w-64"
        } min-h-screen bg-gray-800 text-white p-4 transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className="text-white mb-4 focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>

        {/* Dashboard Title */}
        {!isCollapsed && <h2 className="text-2xl font-bold mb-4">Dashboard</h2>}

        {/* Navigation Links */}
        <ul>
          <li className="mb-2">
            <Link
              to="/dashboard"
              className="hover:text-gray-400 flex items-center"
            >
              🏠 {!isCollapsed && "Home"}
            </Link>
          </li>

          {/* Product Dropdown */}
          <li className="mb-2">
            <button
              className="w-full flex justify-between items-center hover:text-gray-400"
              onClick={() => toggleDropdown("product")}
            >
              <span className="flex items-center">
                <Box size={18} className="mr-2" />
                {!isCollapsed && "Product"}
              </span>
              {!isCollapsed &&
                (openDropdown === "product" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                ))}
            </button>

            {/* Product Sub-menu */}
            {!isCollapsed && openDropdown === "product" && (
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <Link
                    to="/dashboard/show-product"
                    className="hover:text-gray-400 flex items-center"
                  >
                    <Eye size={18} className="mr-2" />
                    Show Product
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/dashboard/add-product"
                    className="hover:text-gray-400 flex items-center"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Product
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/dashboard/edit-product"
                    className="hover:text-gray-400 flex items-center"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Product
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Product Under Dropdown */}
          <li className="mb-2">
            <button
              className="w-full flex justify-between items-center hover:text-gray-400"
              onClick={() => toggleDropdown("productUnder")}
            >
              <span className="flex items-center">
                <Box size={18} className="mr-2" />
                {!isCollapsed && "Product Under"}
              </span>
              {!isCollapsed &&
                (openDropdown === "productUnder" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                ))}
            </button>

            {/* Product Under Sub-menu */}
            {!isCollapsed && openDropdown === "productUnder" && (
              <ul className="ml-4 mt-2">
                <li className="mb-2">
                  <Link
                    to="/dashboard/product-category1"
                    className="hover:text-gray-400"
                  >
                    Category 1
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/dashboard/product-category2"
                    className="hover:text-gray-400"
                  >
                    Category 2
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Logout */}
          <li className="mb-2">
            <Link to="/" className="hover:text-gray-400 flex items-center">
              🚪 {!isCollapsed && "Logout"}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}
