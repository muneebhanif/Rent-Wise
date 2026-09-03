import React, { createContext, useState, useEffect, useContext } from "react";
import { User, login as apiLogin } from "../Api/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const fetchUserData = async () => {
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
      console.error("Error fetching user data:", error);
      setStatus("unauthenticated");
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
        await fetchUserData();
        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };



   const handleLogout = async () => {    
    setUser(null)
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
