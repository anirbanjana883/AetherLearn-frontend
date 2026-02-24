import { createContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../api/axios"; 
import { setUserData, setLoader } from "../redux/userSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    dispatch(setLoader(true));
    try {
      // Calling your existing backend endpoint
      const { data } = await API.get("/user/getcurrentuser");
      if (data.success) {
        dispatch(setUserData(data.data));
      }
    } catch (error) {
      dispatch(setUserData(null));
    } finally {
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};