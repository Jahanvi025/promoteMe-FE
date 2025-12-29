import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface FanRouteProps {
  children: JSX.Element;
}

const FanRoute: React.FC<FanRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const role = useSelector(
    (state: RootState) => state.auth.user?.lastActiveRole
  );

  const location = useLocation();

  const redirectRoute = isAuthenticated ? "/feed" : "/login";

  if (isAuthenticated && role === "FAN") {
    return children;
  }

  return <Navigate to={redirectRoute} state={{ from: location }} />;
};

export default FanRoute;
