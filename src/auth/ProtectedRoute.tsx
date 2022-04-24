import React from "react";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({
  isAuth: isAuth,
  component: Component,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (isAuth) {
          return <Component />;
        } else {
          <Navigate to={{ pathname: "signin" }} />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
