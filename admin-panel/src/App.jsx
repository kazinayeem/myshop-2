import {Link} from "react-router";
export default function App() {
  return (
    <div>
      App
      {/* basic navbar  */}
      <nav className="flex flex-row justify-between bg-gray-800 p-4">
        <div className="text-white text-2xl">My App</div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/login">Products</Link>
          </li>
          <li>
            <Link to="/dashboard">Register</Link>
          </li>
          <li>
            <Link to="/dashboard">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
