import { BrowserRouter, Route, Routes } from "react-router";
import App from "../App";
import LogoutButton from "../components/LogoutButton";
import AddCategory from "../pages/AddCategory";
import AddProduct from "../pages/AddProduct";
import AddSubCategory from "../pages/AddSubcategory";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import EditProduct from "../pages/EditProduct";
import NotFound from "../pages/NotFound";
import OrderDetails from "../pages/OrderDetails";
import ProfilePage from "../pages/ProfilePage";
import ShowAllOrders from "../pages/ShowAllOrder";
import ShowCategory from "../pages/ShowCategory";
import ProductTable from "../pages/ShowPage";
import ShowSubCategory from "../pages/ShowSubCategory";
import SliderManager from "../pages/SliderManager";
import Userlist from "../pages/Userlist";
import ViewSingleUserDetails from "../pages/ViewSingleUserDetails";
import PrivateRoute from "./PrivateRoute";
import PosPage from "../pages/PosPage";
import BrandPage from "../pages/BrandPage";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={<PrivateRoute element={Dashboard} />}
        >
          <Route path="show-product" element={<ProductTable />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="show-category" element={<ShowCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-subcategory" element={<AddSubCategory />} />
          <Route path="show-subcategory" element={<ShowSubCategory />} />
          <Route path="users" element={<Userlist />} />
          <Route path="users/:userId" element={<ViewSingleUserDetails />} />
          <Route path="orders" element={<ShowAllOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="slider" element={<SliderManager />} />
          <Route path="logout" element={<LogoutButton />} />
          <Route path="profit-loss" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="pos" element={<PosPage />} />
          <Route path="brandPage" element={<BrandPage />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
