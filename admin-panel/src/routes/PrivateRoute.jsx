import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { setUser } from "../redux/slice/authSclice";
import { jwtDecode } from "jwt-decode";
const PrivateRoute = ({ element: Component, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode(token) : null;
    const currentTime = Date.now() / 1000;
    if (decodedToken && decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (token) {
      dispatch(setUser({ user: { name: "Test User" }, token }));
    } else {
      navigate("/login");
    }

    setLoading(false);
  }, [dispatch, navigate]);

  const { isAuthenticated } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>; // Prevent flashing

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
