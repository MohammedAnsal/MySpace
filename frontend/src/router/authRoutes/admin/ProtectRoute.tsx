import { PropsWithChildren } from "react";
import { Admin } from "../../../types/Admin";
import { useAuth } from "../../../context/admin/AuthContext.A";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRoles?: Admin["role"][];
};

export default function ProtectRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (currentUser === undefined) {
    return <div>Loading...</div>;
  }

  if (
    currentUser === null ||
    (allowedRoles && !allowedRoles.includes(currentUser.role))
  ) {
    return <div>Permission Denided</div>;
  }

  return <>{children}</>;
}
