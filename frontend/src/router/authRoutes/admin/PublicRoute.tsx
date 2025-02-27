import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { Navigate } from "react-router-dom";

export const PublicRoute = async ({
  element,
  route,
}: {
  element: JSX.Element;
  route: string;
}) => {
  const authenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );

  if (authenticated) return <Navigate to={route} replace={true} />;

  return element;
};
