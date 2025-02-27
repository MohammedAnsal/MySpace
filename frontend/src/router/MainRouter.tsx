import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRoute";
import { ProviderRouter } from "./ProviderRoute";
import { AdminRouter } from "./AdminRoute";

const MainRouter = createBrowserRouter([
  ...UserRoutes,
  ...ProviderRouter,
  ...AdminRouter,
]);

export default MainRouter;
