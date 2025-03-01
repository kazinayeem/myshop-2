import { useState } from "react";
import { useGetUsersQuery } from "../redux/Api/userApi";
import { Link } from "react-router";
import UserAnalysisCharts from "../components/UserAnalysisCharts";

const Userlist = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUser = users?.find((user) => user._id === selectedUserId);

  if (isLoading) return <p className="text-center text-xl">Loading users...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading users</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">User List</h2>
          <ul>
            {users?.map((user) => (
              <li
                key={user._id}
                className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedUserId(user._id)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
        {selectedUser && (
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            {/* Address Handling */}
            <p>
              <strong>Address:</strong>
              {selectedUser.address?.length > 0
                ? `${selectedUser.address[0]?.street}, ${selectedUser.address[0]?.city}`
                : "No address available"}
            </p>
            <Link
              to={`/dashboard/users/${selectedUser._id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              View more details
            </Link>

            {/* Pass the full user data to the UserAnalysisCharts component */}
            <UserAnalysisCharts userDetails={selectedUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Userlist;
