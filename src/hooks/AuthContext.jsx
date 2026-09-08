import React, { createContext, useState, useEffect, useContext } from "react";
import { User, login as apiLogin, logout as apiLogout, setAuthToken } from "../Api/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const fetchUserData = async (preserveExistingUser = false) => {
    try {
      const response = await User();
      const userData = response.data?.user;

      if (userData) {
        setUser(userData);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    } catch (error) {
      // A 401 here is the normal result for a visitor without a session.
      if (error.response?.status !== 401) {
        console.error("Error fetching user data:", error);
      }
      if (!preserveExistingUser) {
        setUser(null);
        setStatus("unauthenticated");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

    useEffect(() => {
  }, [user]);
  
  

  const login = async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      if (response.status === 200) {
        // The login response already contains the authenticated user's id and
        // role. Set it immediately so a transient cookie propagation delay
        // cannot leave the app in the unauthenticated state.
        if (response.data?.user) {
          setUser(response.data.user);
          setStatus("authenticated");
        }
        // Hydrate the profile from the API for fields that may have changed
        // since the login response was created, but retain the login profile
        // if an old deployment has not issued the cookie correctly yet.
        await fetchUserData(true);
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };



   const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      // Clear local auth state even if the server session is already gone.
      if (error.response?.status !== 401) {
        console.error("Logout error:", error);
      }
    }
    setAuthToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{ user, status, login, fetchUserData, handleLogout }} 
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
