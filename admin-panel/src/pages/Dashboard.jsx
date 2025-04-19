import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import OrderChart from "../components/OrderChart";
import ProductList from "../components/ProductList";
import SideBar from "../components/SideBar";
import TotalSaleandProfite from "../components/TotalSaleandProfite";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard";

  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 bg-gray-800 text-white w-64 transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <SideBar />
      </div>

      {/* Content */}
      <div className="flex-1 lg:ml-64 p-1 overflow-y-auto w-full">
        {isMainDashboard ? (
          <>
            <TotalSaleandProfite />
            <ProductList />
            <OrderChart />
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
