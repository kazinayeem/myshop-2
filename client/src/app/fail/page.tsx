"use client";

import { useRouter } from "next/navigation";

const Fail = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Failed</h1>
        <p className="text-lg text-gray-600 mb-6">
          Something went wrong with your payment. Please try again or contact
          support if the issue persists.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Fail;
