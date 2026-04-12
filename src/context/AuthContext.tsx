import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { IUser, IStore } from "../types";
import { apiGetMe, apiGetMyStore } from "../config/api";

interface AuthCtx {
  user: IUser | null;
  store: IStore | null;
  token: string | null;
  loading: boolean;
  setAuth: (user: IUser, token: string) => void;
  setStore: (store: IStore) => void;
  logout: () => void;
  refreshStore: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [store, setStoreState] = useState<IStore | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await apiGetMe();
        setUser(data.user);
        if (data.user.role === "admin") {
          try {
            const storeRes = await apiGetMyStore();
            setStoreState(storeRes.data.store);
          } catch {}
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const setAuth = (user: IUser, newToken: string) => {
    setUser(user);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const setStore = (s: IStore) => setStoreState(s);

  const logout = () => {
    setUser(null);
    setStoreState(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshStore = async () => {
    try {
      const { data } = await apiGetMyStore();
      setStoreState(data.store);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, store, token, loading, setAuth, setStore, logout, refreshStore }}>
      {children}
    </AuthContext.Provider>
  );
};
