// pages/success.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  // Optional: Automatically redirect after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to homepage after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-500 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your transaction was completed successfully. We are processing your
          payment.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Transaction ID: <span className="font-semibold">{tranId}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Thank you for your purchase. You will be redirected shortly.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default Success;
