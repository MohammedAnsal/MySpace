import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import MainRouter from "./router/MainRouter.tsx";
import AuthProvider_User from "./context/user/AuthContext.tsx";
import AuthProvider_Provider from "./context/Provider/AuthContext.p.tsx";
import AuthProvider_Admin from "./context/admin/AuthContext.A.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider_Admin>
        <AuthProvider_User>
          <AuthProvider_Provider>
            <Toaster richColors position="top-right" theme="dark" />
            <RouterProvider router={MainRouter} />
          </AuthProvider_Provider>
        </AuthProvider_User>
      </AuthProvider_Admin>
    </Provider>
  </StrictMode>
);
