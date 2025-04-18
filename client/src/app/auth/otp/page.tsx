"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useChangePasswordMutation,
} from "@/api/userApi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendOtp, { isLoading: sendingOtp, error: otperror }] =
    useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyingOtp, error: verifyError }] =
    useVerifyOtpMutation();
  const [
    changePassword,
    { isLoading: changingPassword, error: changePasswordError },
  ] = useChangePasswordMutation();

  const handleSendOtp = async () => {
    try {
      await sendOtp({ email }).unwrap();
      Swal.fire("OTP Sent", "Check your email.", "success");
      setStep("otp");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          otperror &&
          typeof otperror === "object" &&
          "data" in otperror &&
          typeof otperror.data === "object" &&
          otperror.data &&
          "message" in otperror.data
            ? (otperror.data as { message: string }).message
            : "An error occurred",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ email, otp: otpValue }).unwrap();
      Swal.fire("OTP Verified", "Enter your new password.", "success");
      setStep("password");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          verifyError &&
          typeof verifyError === "object" &&
          "data" in verifyError &&
          typeof verifyError.data === "object" &&
          verifyError.data &&
          "message" in verifyError.data
            ? (verifyError.data as { message: string }).message
            : "An error occurred",
      });
    }
  };
  const navigation = useRouter();
  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      return Swal.fire(
        "Too Short",
        "Password must be at least 6 characters.",
        "warning"
      );
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire("Mismatch", "Passwords do not match.", "error");
    }
    try {
      await changePassword({ email, password: newPassword }).unwrap();
      Swal.fire("Success", "Password changed successfully!", "success");
      navigation.push("/auth/login");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          changePasswordError &&
          typeof changePasswordError === "object" &&
          "data" in changePasswordError &&
          typeof changePasswordError.data === "object" &&
          changePasswordError.data &&
          "message" in changePasswordError.data
            ? (changePasswordError.data as { message: string }).message
            : "An error occurred",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (step === "email") {
        handleSendOtp();
      } else if (step === "otp") {
        handleVerifyOtp();
      } else if (step === "password") {
        handlePasswordChange();
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded-2xl shadow-md space-y-6">
      {step === "email" && (
        <>
          <h2 className="text-xl font-semibold text-center">Reset Password</h2>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onKeyDown={handleKeyDown}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handleSendOtp}
            disabled={sendingOtp || !email}
          >
            {sendingOtp ? "Sending..." : "Send OTP"}
          </Button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-xl font-semibold text-center">Enter OTP</h2>
          <InputOTP
            maxLength={6}
            onKeyDown={handleKeyDown}
            value={otpValue}
            onChange={(val) => setOtpValue(val)}
            className="mx-auto"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            className="w-full mt-2"
            onClick={handleVerifyOtp}
            disabled={verifyingOtp || otpValue.length !== 6}
          >
            {verifyingOtp ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={() => {
              setOtpValue("");
              setStep("email");
            }}
          >
            Resend OTP
          </Button>
        </>
      )}

      {step === "password" && (
        <>
          <h2 className="text-xl font-semibold text-center">
            Set New Password
          </h2>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={handlePasswordChange}
            disabled={changingPassword}
          >
            {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </>
      )}
    </div>
  );
}
