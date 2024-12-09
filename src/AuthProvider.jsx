import React, { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { validateAPI, revokeAPI } from "./api/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUserFromToken = async (token) => {
    try {
      const res = await validateAPI(token);
      if (res.status === 200) {
        const userData = res.data.data.user;
        const userRole = res.data.data.roles[0];
        setUser({ ...userData, role: userRole });
      }
    } catch (error) {
      localStorage.getItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const res = await revokeAPI(localStorage.getItem("token"));
      if (res.status === 200) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserFromToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ User, setUser, loading, logout, setUserFromToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProtectedRoute = ({ children, redirectTo }) => {
  const { User, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return User ? children : <Navigate to={redirectTo} />;
};

export const RedirectIfAuthenticated = ({ children, redirectTo }) => {
  const { User, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return User ? <Navigate to={redirectTo} /> : children;
};
