import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fakeLogin, logout } from "../redux/slice/authSclice";
const LoginPage = () => {
  const [username, setUsername] = useState("test");
  const [password, setPassword] = useState("password");
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(fakeLogin(username, password));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        {isAuthenticated ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
