import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./redux/store/store.ts";
import MainRouter from "./router/MainRouter.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "./contexts/socketProviderr.tsx";
import { NotificationProvider } from "./contexts/NotificationContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <SocketProvider>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <GoogleOAuthProvider clientId={googleClientId}>
            <Toaster richColors position="top-right" theme="dark" />
            <RouterProvider router={MainRouter} />
          </GoogleOAuthProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </SocketProvider>
  </Provider>
);
