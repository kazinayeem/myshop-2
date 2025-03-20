"use client";

import { create } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/hooks";
import { loginSuccess } from "@/reducer/authReducer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "user1@gmail.com",
    username: "",
    password: "password123",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isLogin
      ? "https://myshop-2-production.up.railway.app/api/users/login"
      : "https://myshop-2-production.up.railway.app/api/users/register";

    const body = isLogin
      ? { email: form.email, password: form.password }
      : { email: form.email, username: form.username, password: form.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

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
        router.push("/");
      }

      toast.success(isLogin ? "Login successful!" : "Registration successful!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
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
