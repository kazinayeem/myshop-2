import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/Api/userApi";
import { setUser } from "../../redux/slice/authSclice";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("user1@gmail.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      const { token, user } = response;
      dispatch(setUser({ user, token }));
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Login
        </h2>
        {isError && (
          <p className="text-red-500 text-center mb-4">
            {error?.data?.message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?
            <a href="/register" className="text-blue-600 hover:underline">
              {" "}
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
