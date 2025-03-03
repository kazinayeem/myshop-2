import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ element: Component, ...rest }) => {
  // Check if the user is authenticated
  const { isAuthenticated } = useSelector((state) => state.auth);

  // if already authenticated, redirect to dashboard
//   const token = localStorage.getItem("token");
//   if (token) {
//     return <Navigate to="/dashboard" />;
//   }

  return isAuthenticated ? (
    <Component {...rest} /> // Render the passed component
  ) : (
    <Navigate to="/login" /> // Redirect if not authenticated
  );
};
PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
