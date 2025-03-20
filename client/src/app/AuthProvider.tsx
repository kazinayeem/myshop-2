"use client";

import { get } from "@/app/actions";
import { useAppDispatch } from "@/lib/hooks";
import { setUserandToken } from "@/reducer/authReducer";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { token, user } = await get();
        if (token && user) {
          const parsedUser = JSON.parse(user);
          dispatch(setUserandToken({ user: parsedUser, token }));
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
