import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const NotFound = () => {
  const naviagtion = useNavigate();
  const backprev = () => {
    naviagtion(-1);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <motion.h1
        className="text-9xl font-bold text-blue-500"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.h2
        className="text-2xl font-semibold text-gray-700 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Oops! Page Not Found
      </motion.h2>
      <p className="text-gray-500 mt-2">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <button
        onClick={backprev}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
