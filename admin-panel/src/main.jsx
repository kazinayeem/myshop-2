import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import "./index.css";
import Login from "./pages/login";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import Dashboard from "./pages/Dashboard";
import ShowPage from "./pages/ShowPage";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ShowCategory from "./pages/ShowCategory";
import AddCategory from "./pages/AddCategory";
import AddSubCategory from "./pages/AddSubcategory";
import ShowAllOrders from "./pages/ShowAllOrder";
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="show-product" element={<ShowPage />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="show-category" element={<ShowCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-subcategory" element={<AddSubCategory />} />
          <Route path="orders" element={<ShowAllOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
