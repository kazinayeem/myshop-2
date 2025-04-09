"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRegisterMutation } from "@/api/userApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import Swal from "sweetalert2";
import LogInWithGoogle from "@/components/LogInWithGoogle";
interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const [
    registerUser,
    { isLoading, isSuccess, error: loginError, isError: loginIsError },
  ] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      await registerUser(data).unwrap();
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now log in.",
        confirmButtonText: "OK",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/auth/login");
    }
  }, [isSuccess, router]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side Image */}
      <div className="bg-[#e8f5fa] flex items-center justify-center p-4">
        <Image
          src="/dl.beatsnoop 1.png"
          alt="Shopping Visual"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center px-8 py-12">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2">Create an account</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your details below
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Name"
                  {...register("username", {
                    required: "username is required",
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Email or Phone Number"
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
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
              <LogInWithGoogle />

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
