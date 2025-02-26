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
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="show" element={<ShowPage />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
