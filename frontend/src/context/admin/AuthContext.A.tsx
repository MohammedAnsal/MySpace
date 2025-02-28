import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Admin } from "../../types/Admin";

type AuthContext = {
  authToken?: string | null;
  currentUser?: Admin | null;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthAdminProvider = PropsWithChildren;

export default function AuthProvider({ children }: AuthAdminProvider) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);

  // Get auth state from Redux
  const admin = useSelector((state: RootState) => state.admin);

  // console.log(admin, "ssssss");

  useEffect(() => {
    // Sync Redux state to context state
    if (admin?.token) {
      setAuthToken(admin.token);
      setCurrentUser(admin);
    } else {
      setAuthToken(null);
      setCurrentUser(null);
    }
  }, []);

  function handleLogout() {
    setAuthToken(null);
    setCurrentUser(null);
    // Here you can also clear Redux state if needed (like dispatch(logoutAction()))
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
