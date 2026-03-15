import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import API from "../api/axios";

const getCurrentUser = () => {
  const dispatch = useDispatch();
  // const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    // if (userData === null) return;
    const fetchUser = async () => {
      try {
        const result = await API.get("/user/me");
        // console.log(result.data)
        dispatch(setUserData(result.data.data));
      } catch (error) {
        if (error.response?.status === 400) {
          dispatch(setUserData(null)); // user not logged in, ignore console error
        } else {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default getCurrentUser;
