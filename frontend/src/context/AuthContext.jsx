import {
  createContext,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  const storedToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  function login(userData, jwt, rememberMe) {
    const storage = rememberMe
      ? localStorage
      : sessionStorage;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    storage.setItem(
      "user",
      JSON.stringify(userData)
    );

    storage.setItem("token", jwt);

    setUser(userData);
    setToken(jwt);
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };