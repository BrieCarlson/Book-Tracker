import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext();

function readStoredJson(key) {
  const value =
    localStorage.getItem(key) ||
    sessionStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readStoredToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    readStoredJson("user")
  );

  const [token, setToken] = useState(() =>
    readStoredToken()
  );

  const login = useCallback((userData, jwt, rememberMe) => {
    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("token", jwt);

    setUser(userData);
    setToken(jwt);
  }, []);

  const updateUser = useCallback((userData) => {
    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;

    storage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      updateUser,
      logout,
      isLoggedIn: Boolean(token),
    }),
    [user, token, login, updateUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };