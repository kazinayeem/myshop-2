import { Outlet, useLocation } from "react-router";
import OrderChart from "../components/OrderChart";
import ProductList from "../components/ProductList";
import SideBar from "../components/SideBar";
import TotalSaleandProfite from "../components/TotalSaleandProfite";

export default function Dashboard() {
  const location = useLocation();
  const isMainDashboard = location.pathname === "/dashboard";

  return (
    <div className="flex">
      <SideBar />
      {/* <Test/> */}
      <div className="flex-1 p-6">
        {isMainDashboard && (
          <>
            <TotalSaleandProfite />
            <ProductList />
            <OrderChart />
          </>
        )}
        {!isMainDashboard && <Outlet />}
      </div>
    </div>
  );
}
