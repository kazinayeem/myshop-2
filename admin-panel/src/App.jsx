// src/App.jsx
import { Link } from "react-router";

export default function App() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center p-6 space-y-6 bg-white rounded-lg shadow-md">
        {/* Introductory Heading */}
        <h1 className="text-4xl font-bold text-blue-600">
          Welcome to Our Application
        </h1>
        <p className="text-lg text-gray-600">
          A brief introduction to what your app does goes here. This could
          include the benefits, key features, or just a welcoming message for
          users.
        </p>

        {/* Action Buttons for Login and Register */}
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
