import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";

interface AuthContextType {
  authenticated: boolean;
  token: string;
  login: (signInToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextType);

function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const localStorageToken = localStorage.getItem("nearogram-token");
    if (localStorageToken) {
      setToken(localStorageToken);
      setAuthenticated(true);
      //Verify token's authenticity
    }
  }, []);

  return {
    authenticated,
    token,
    login(signInToken: string) {
      return new Promise<void>(() => {
        localStorage.setItem("nearogram-token", signInToken);
        setAuthenticated(true);
        setToken(signInToken);
      });
    },
    logout() {
      return new Promise<void>(() => {
        setAuthenticated(false);
        localStorage.removeItem("nearogram-token");
      });
    },
  };
}

export function AuthProvider({ children }: any) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(AuthContext);
}
