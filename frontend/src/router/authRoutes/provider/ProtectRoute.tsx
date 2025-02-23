import { PropsWithChildren } from "react";
import { useAuth } from "../../../context/Provider/AuthContext.p";
import { Provider } from "../../../types/Provider";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: Provider["role"][];
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  console.log(currentUser?.role, "JFJFJ");

  // Show loading if currentUser is still being fetched
  if (currentUser === undefined) {
    return <div>Loading...</div>; // Maybe replace with a spinner later
  }

  if (
    currentUser === null ||
    (allowedRoles && !allowedRoles.includes(currentUser.role))
  ) {
    return <div>Permission denied</div>;
  }

  // All good, show the protected content
  return <>{children}</>;
}
