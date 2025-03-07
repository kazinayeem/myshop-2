import { useState } from "react";
import { useGetUsersQuery } from "../redux/Api/userApi";
import { Link } from "react-router";
import UserAnalysisCharts from "../components/UserAnalysisCharts";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

const Userlist = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUser = users?.find((user) => user._id === selectedUserId);

  if (isLoading) return <Loading />;
  if (error)
    return <p className="text-center text-red-500">Error loading users</p>;

  return (
    <motion.div
      className="container mx-auto p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-700">
        Users
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            User List
          </h2>
          <ul>
            {users?.map((user) => (
              <motion.li
                key={user._id}
                className="p-3 border-b hover:bg-gray-100 cursor-pointer transition rounded-md"
                onClick={() => setSelectedUserId(user._id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.username}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {selectedUser && (
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              User Details
            </h2>
            <p className="text-gray-600">
              <strong>Name:</strong> {selectedUser.username}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong>{" "}
              {selectedUser.address?.length > 0
                ? `${selectedUser.address[0]?.street}, ${selectedUser.address[0]?.city}`
                : "No address available"}
            </p>
            <Link
              to={`/dashboard/users/${selectedUser._id}`}
              className="text-blue-500 hover:text-blue-700 mt-3 block"
            >
              View more details
            </Link>
            <UserAnalysisCharts userDetails={selectedUser} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Userlist;
