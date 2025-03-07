import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <motion.div
          className="w-4 h-4 bg-blue-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0,
          }}
        />
        <motion.div
          className="w-4 h-4 bg-blue-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-4 h-4 bg-blue-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.4,
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loading;
