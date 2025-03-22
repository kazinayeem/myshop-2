"use client";

import { useLoginMutation, useRegisterMutation } from "@/api/userApi";
import { create } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/hooks";
import { loginSuccess } from "@/reducer/authReducer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: "", username: "", password: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dispatch = useAppDispatch();
  const [
    login,
    {
      error: loginError,

      isError: loginIsError,
    },
  ] = useLoginMutation();

  const [
    register,
    {
      error: registerError,

      isError: registerIsError,
    },
  ] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body = isLogin
      ? { email: form.email, password: form.password }
      : { email: form.email, username: form.username, password: form.password };

    try {
      let data;
      if (isLogin) {
        // Perform login using RTK query hook
        const response = await login(body).unwrap();
        data = response;
      } else {
        // Perform registration using RTK query hook
        const response = await register(body).unwrap();
        data = response;
      }

      if (data) {
        if (isLogin) {
          create({
            token: data.token,
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            },
          });
          dispatch(
            loginSuccess({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
            })
          );
          router.back();
        }
        // if reg istration is successful, redirect to login page
        else {
          setIsLogin(true);
          setForm({ email: "", username: "", password: "" });
        }

        // Show success message
        Swal.fire({
          icon: "success",
          title: isLogin ? "Login Successful" : "Registration Successful",
          text: isLogin
            ? "Welcome back!"
            : "Your account has been created successfully.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error messages based on the error type
        if ("data" in error) {
          const errorData = error.data as { message: string };
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorData.message,
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred.",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred.",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-4 shadow-md bg-white">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {!isLogin && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {loginIsError && (
              <p className="text-red-500 text-sm">
                {loginError &&
                  "data" in loginError &&
                  (loginError.data as { message: string })?.message}
              </p>
            )}
            {registerIsError && (
              <p className="text-red-500 text-sm">
                {"data" in registerError &&
                  (registerError.data as { message: string })?.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleAuthMode}
              className="text-blue-500 ml-1 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
