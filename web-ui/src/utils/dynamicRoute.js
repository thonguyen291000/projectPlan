import React from "react";
import { Route, Redirect } from "react-router-dom";
//Redux
import { useSelector } from "react-redux";

const DynamicRoute = (props) => {
  const userAuthen = useSelector((state) => state.user.authenticated);
  const role = useSelector((state) => state.user.info.role);

  if (props.authenticated && !userAuthen) {
    return <Redirect to="/login" />;
  } else if (props.unauthenticated && userAuthen) {
    if (role === "student" || role === "teacher") {
      return <Redirect to="/chat" />;
    } else {
      return <Redirect to="/manage" />;
    }
  } else {
    if (props.path === "/chat") {
      if (role === "student" || role === "teacher") {
        return <Route component={props.component} {...props} />;
      } else {
        return <Redirect to="/manage"/>
      }
    } else if (props.path === "/manage") {
      if (role === "staff" || role === "admin") {
        return <Route component={props.component} {...props} />;
      } else {
        return <Redirect to="/chat" />;
      }
    } else {
      return <Route component={props.component} {...props} />;
    }
  }
};

export default DynamicRoute;
