import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Router } from "./router/UserRoute.tsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster richColors position="top-right" theme="dark" />
      {/* <App /> */}
      <RouterProvider router={Router} />
    </Provider>
  </StrictMode>
);
