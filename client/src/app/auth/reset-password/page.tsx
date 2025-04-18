"use client";
import { useResetPasswordMutation } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";

interface ResetPasswordFormValues {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const [resetPassword, { isLoading, isSuccess, error }] =
    useResetPasswordMutation();
  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "You can now log in with your new password.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/user/profile");
      });
    }
  }, [isSuccess, router]);

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    if (!passwordMatch) return;

    try {
      const submitData = {
        email: data.email,
        oldpassword: data.oldPassword,
        password: data.newPassword,
      };
      await resetPassword(submitData).unwrap();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text:
          error &&
          typeof error === "object" &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data &&
          "message" in error.data
            ? (error.data as { message: string }).message
            : "An error occurred",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side Image */}
      <div className="bg-[#e8f5fa] flex items-center justify-center p-4">
        <Image
          src="/dl.beatsnoop 1.png"
          alt="Visual"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center px-8 py-12">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your credentials to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Email"
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
                  placeholder="Old Password"
                  {...register("oldPassword", {
                    required: "Old password is required",
                  })}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="New Password"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Re-enter New Password"
                  {...register("confirmPassword", {
                    required: "Please re-enter new password",
                  })}
                />
                {!passwordMatch && (
                  <p className="text-red-500 text-sm mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={!passwordMatch || isLoading}
              >
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
