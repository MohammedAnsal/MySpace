import { PropsWithChildren } from "react";
import { useAuth } from "../../../context/user/AuthContext";
import { User } from "../../../types/User";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: User["role"][];
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();

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
