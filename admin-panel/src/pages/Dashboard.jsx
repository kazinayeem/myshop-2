import { Outlet, useLocation } from "react-router";
import SideBar from "../components/SideBar";
import ProductList from "../components/ProductList";
import OrderChart from "../components/OrderChart";

export default function Dashboard() {
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard"; // Check if on main dashboard

  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6">
        {isMainDashboard && (
          <>
            <ProductList />
            <OrderChart />
          </>
        )}
        {!isMainDashboard && <Outlet />}
      </div>
    </div>
  );
}
