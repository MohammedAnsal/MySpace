import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./redux/store/store.ts";
import MainRouter from "./router/MainRouter.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" theme="dark" />
      <RouterProvider router={MainRouter} />
    </QueryClientProvider>
  </Provider>
);
