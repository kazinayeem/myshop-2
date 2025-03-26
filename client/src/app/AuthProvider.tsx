"use client";

import { get, remove } from "@/app/actions";
import { useAppDispatch } from "@/lib/hooks";
import { logout, setUserandToken } from "@/reducer/authReducer";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { token, user } = await get();
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            dispatch(logout());
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            await remove();
            return;
          }
        }
        if (token && user) {
          const parsedUser = JSON.parse(user);
          dispatch(setUserandToken({ user: parsedUser, token }));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        await remove();
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
