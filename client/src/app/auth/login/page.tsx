"use client";

import { useLoginMutation } from "@/api/userApi";
import { create } from "@/app/actions";
import LogInWithGoogle from "@/components/LogInWithGoogle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/hooks";
import { loginSuccess } from "@/reducer/authReducer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
interface LoginFormValues {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const [
    login,
    { error: loginError, isSuccess, isError: loginIsError, isLoading },
  ] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await login(data).unwrap();
      create({
        token: response.token,
        user: {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        },
      });
      dispatch(
        loginSuccess({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        })
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Login successful",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Image Section */}
      <div className="bg-[#e8f5fa] flex items-center justify-center p-4">
        <Image
          src="/dl.beatsnoop 1.png"
          alt="Shopping Visual"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center px-8 py-12">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2">Log in to Exclusive</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your details below
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Email Address"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginIsError && (
                <p className="text-red-500 text-sm">
                  {loginError &&
                    "data" in loginError &&
                    (loginError.data as { message: string })?.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>

              <LogInWithGoogle />

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
