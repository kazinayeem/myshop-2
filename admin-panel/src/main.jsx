// In index.jsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";

import store from "./redux/store/store";

import MainRoutes from "./routes/MainRoutes";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <Analytics />
    <SpeedInsights />
    <MainRoutes />
  </Provider>
);
