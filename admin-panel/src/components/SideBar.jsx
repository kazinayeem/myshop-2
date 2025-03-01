import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Box,
  Plus,
  Edit,
  Eye,
  Users,
  List,
  UserPlus,
  Image,
  Tag,
  PackageCheck,
} from "lucide-react";
export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("isCollapsed") === "true"
  );
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed);
  }, [isCollapsed]); // Sync localStorage when isCollapsed changes

  const toggleDropdown = (menu) => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem("isCollapsed", newValue);
      return newValue;
    });
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };
  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen bg-gray-800 text-white p-4 transition-all duration-300`}
    >
      <button
        className="text-white mb-4 focus:outline-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {!isCollapsed && <h2 className="text-2xl font-bold mb-4">Dashboard</h2>}

      <ul>
        <li className="mb-2">
          <Link
            to="/dashboard"
            className="hover:text-gray-400 flex items-center"
          >
            🏠 {!isCollapsed && "Home"}
          </Link>
        </li>

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
          {!isCollapsed && openDropdown === "product" && (
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  to="/dashboard/show-product"
                  className="hover:text-gray-400 flex items-center"
                >
                  <Eye size={18} className="mr-2" /> Show Product
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/add-product"
                  className="hover:text-gray-400 flex items-center"
                >
                  <Plus size={18} className="mr-2" /> Add Product
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/edit-product"
                  className="hover:text-gray-400 flex items-center"
                >
                  <Edit size={18} className="mr-2" /> Edit Product
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mb-2">
          <button
            className="w-full flex justify-between items-center hover:text-gray-400"
            onClick={() => toggleDropdown("category")}
          >
            <span className="flex items-center">
              <Box size={18} className="mr-2" />
              {!isCollapsed && "Category"}
            </span>
            {!isCollapsed &&
              (openDropdown === "category" ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              ))}
          </button>
          {!isCollapsed && openDropdown === "category" && (
            <ul className="ml-4 mt-2">
              <li className="mb-2">
                <Link
                  to="/dashboard/add-category"
                  className="hover:text-gray-400"
                >
                  {" "}
                  Add Category{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/show-category"
                  className="hover:text-gray-400"
                >
                  {" "}
                  Show Category{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/subcategory"
                  className="hover:text-gray-400"
                >
                  {" "}
                  Subcategory{" "}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/dashboard/add-subcategory"
                  className="hover:text-gray-400"
                >
                  Add Subcategory
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/users"
            className="hover:text-gray-400 flex items-center"
          >
            <Users size={18} className="mr-2" />{" "}
            {!isCollapsed && "See All Users"}
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/orders"
            className="hover:text-gray-400 flex items-center"
          >
            <List size={18} className="mr-2" /> {!isCollapsed && "Order List"}
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/add-user"
            className="hover:text-gray-400 flex items-center"
          >
            <UserPlus size={18} className="mr-2" /> {!isCollapsed && "Add User"}
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/slider"
            className="hover:text-gray-400 flex items-center"
          >
            <Image size={18} className="mr-2" /> {!isCollapsed && "Add Slider"}
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/discount"
            className="hover:text-gray-400 flex items-center"
          >
            <Tag size={18} className="mr-2" /> {!isCollapsed && "Add Discount"}
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to="/dashboard/stock"
            className="hover:text-gray-400 flex items-center"
          >
            <PackageCheck size={18} className="mr-2" />{" "}
            {!isCollapsed && "Check Stock"}
          </Link>
        </li>

        <li className="mb-2">
          <Link to="/" className="hover:text-gray-400 flex items-center">
            🚪 {!isCollapsed && "Logout"}
          </Link>
        </li>
      </ul>
    </div>
  );
}
