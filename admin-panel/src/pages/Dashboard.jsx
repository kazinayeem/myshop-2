import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import ProductList from "../components/ProductList";
import OrderChart from "../components/OrderChart";
export default function Dashboard() {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 p-6">
        <ProductList/>
        <OrderChart/>
        <Outlet />
      </div>
    </div>
  );
}
