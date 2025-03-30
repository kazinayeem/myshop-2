"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import {
  Box,
  ClipboardCheck,
  Eye,
  Image,
  List,
  LogOut,
  Menu,
  ShoppingBag,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Test() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      if (mobileView) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative flex">
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-full transition-all duration-300 bg-gray-800 text-white shadow-lg
        ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <button
          className="absolute top-4 right-[-45px] md:hidden bg-gray-800 text-white p-2 rounded-md z-50"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>

        <Sidebar aria-label="Dashboard Sidebar">
          <SidebarItems>
            <SidebarItemGroup>
              <SidebarItem href="/dashboard" icon={ShoppingBag}>
                {!isCollapsed && "Home"}
              </SidebarItem>
              <SidebarItem href="/dashboard/show-product" icon={Eye}>
                {!isCollapsed && "Show Products"}
              </SidebarItem>
              <SidebarItem href="/dashboard/add-product" icon={Box}>
                {!isCollapsed && "Add Product"}
              </SidebarItem>
              <SidebarItem href="/dashboard/add-category" icon={Box}>
                {!isCollapsed && "Add Category"}
              </SidebarItem>
              <SidebarItem href="/dashboard/show-category" icon={Box}>
                {!isCollapsed && "Show Categories"}
              </SidebarItem>
              <SidebarItem href="/dashboard/show-subcategory" icon={Box}>
                {!isCollapsed && "Subcategories"}
              </SidebarItem>
              <SidebarItem href="/dashboard/add-subcategory" icon={Box}>
                {!isCollapsed && "Add Subcategory"}
              </SidebarItem>
              <SidebarItem href="/dashboard/users" icon={Users}>
                {!isCollapsed && "Users"}
              </SidebarItem>
              <SidebarItem href="/dashboard/orders" icon={List}>
                {!isCollapsed && "Orders"}
              </SidebarItem>
              <SidebarItem href="/dashboard/add-user" icon={UserPlus}>
                {!isCollapsed && "Add User"}
              </SidebarItem>
              <SidebarItem href="/dashboard/slider" icon={Image}>
                {!isCollapsed && "Sliders"}
              </SidebarItem>
              <SidebarItem href="/dashboard/discount" icon={Tag}>
                {!isCollapsed && "Discounts"}
              </SidebarItem>
              <SidebarItem href="/dashboard/profit-loss" icon={ClipboardCheck}>
                {!isCollapsed && "Profit & Loss"}
              </SidebarItem>
              <SidebarItem href="/dashboard/brandPage" icon={TrendingUp}>
                {!isCollapsed && "Brand Page"}
              </SidebarItem>
              <SidebarItem href="/dashboard/logout" icon={LogOut}>
                {!isCollapsed && "Logout"}
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </div>
    </div>
  );
}
