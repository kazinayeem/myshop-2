// In index.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import Dashboard from "./pages/Dashboard"; // Make sure it's exported correctly
import ShowPage from "./pages/ShowPage";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ShowCategory from "./pages/ShowCategory";
import AddCategory from "./pages/AddCategory";
import AddSubCategory from "./pages/AddSubcategory";
import ShowAllOrders from "./pages/ShowAllOrder";
import { Analytics } from "@vercel/analytics/react";
import ShowSubCategory from "./pages/ShowSubCategory";
import Userlist from "./pages/Userlist";
import ViewSingleUserDetails from "./pages/ViewSingleUserDetails";
import SliderManager from "./pages/SliderManager";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import LogoutButton from "./components/LogoutButton";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <Analytics />
    <SpeedInsights />
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
          <Route path="show-product" element={<ShowPage />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="show-category" element={<ShowCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-subcategory" element={<AddSubCategory />} />
          <Route path="show-subcategory" element={<ShowSubCategory />} />
          <Route path="users" element={<Userlist />} />
          <Route path="users/:userId" element={<ViewSingleUserDetails />} />
          <Route path="orders" element={<ShowAllOrders />} />
          <Route path="slider" element={<SliderManager />} />
          <Route path="logout" element={<LogoutButton />} />
          <Route path="stock" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
