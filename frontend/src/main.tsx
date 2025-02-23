import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./redux/store/store.ts";
import MainRouter from "./router/MainRouter.tsx";
import AuthProvider from "./context/user/AuthContext.tsx";
import AuthProviderP from "./context/Provider/AuthContext.p.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <AuthProviderP>
          <Toaster richColors position="top-right" theme="dark" />
          <RouterProvider router={MainRouter} />
        </AuthProviderP>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
