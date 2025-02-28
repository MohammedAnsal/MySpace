import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { Provider } from "../../types/Provider";

type AuthContext = {
  authToken?: string | null;
  currentUser?: Provider | null;
  handleLogout: () => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Provider | null>(null);

  // Get auth state from Redux
  const provider = useSelector((state: RootState) => state.provider);

  // console.log(provider, "ssssss");

  useEffect(() => {
    // Sync Redux state to context state
    if (provider?.token) {
      setAuthToken(provider.token);
      setCurrentUser(provider);
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
