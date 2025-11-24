import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crash2cost_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('crash2cost_token');
    if (savedToken) {
      try {
        const decoded = JSON.parse(atob(savedToken.split('.')[1]));
        setUser({ username: decoded.sub, role: decoded.role });
      } catch (e) {
        console.error("Invalid token", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const { accessToken } = response.data;
      
      localStorage.setItem('crash2cost_token', accessToken);
      setToken(accessToken);
      
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({ username: decoded.sub, role: decoded.role });
      
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      const { accessToken } = response.data;
      
      localStorage.setItem('crash2cost_token', accessToken);
      setToken(accessToken);
      
      const decoded = JSON.parse(atob(accessToken.split('.')[1]));
      setUser({ username: decoded.sub, role: decoded.role });
      
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('crash2cost_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
