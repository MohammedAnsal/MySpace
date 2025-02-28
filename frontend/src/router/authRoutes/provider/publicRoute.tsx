import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({
  element,
  route,
}: {
  element: JSX.Element;
  route: string;
}) => {
  const authenticated = useSelector(
    (state: RootState) => state.provider.isAuthenticated
  );

  if (authenticated) return <Navigate to={route} replace={true} />;
  return element;
};

export default PublicRoute;
