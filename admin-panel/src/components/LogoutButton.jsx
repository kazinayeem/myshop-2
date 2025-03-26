import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/slice/authSclice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-end p-4 bg-gray-100">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
