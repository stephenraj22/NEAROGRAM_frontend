import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./AuthContext";

function AuthRouteGuard({ children }: any) {
  const { authenticated } = useAuth();

  return authenticated === true ? children : <Navigate to="/signin" replace />;
}
export default AuthRouteGuard;
