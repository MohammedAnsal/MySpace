import { createBrowserRouter } from "react-router-dom";
import { UserRoutes } from "./UserRoute";
import { ProviderRouter } from "./ProviderRoute";

const MainRouter = createBrowserRouter([...UserRoutes, ...ProviderRouter]);

export default MainRouter;
