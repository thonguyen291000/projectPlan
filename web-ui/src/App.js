import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
//Library
import GridLoader from "react-spinners/GridLoader";
import LoadingOverlay from "react-loading-overlay";
//Pages
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import Manage from "./pages/Manage/Manage";
import ErrorPage from "./pages/Error/Error";
//Components
import ApolloProvider from "./apollo/apolloProvider";
import DynamicRoute from "./utils/dynamicRoute";
//SCSS
import "./scss/main.scss";
//Redux
import { useSelector } from "react-redux";
//Toast
import { Container } from "./utils/toast";

const App = () => {
  //Redux
  const loading = useSelector((state) => state.data.loading);
  //Methods
  React.useEffect(() => {
    localStorage.removeItem("selectedRoom");
  }, []);

  return (
    <ApolloProvider>
      <LoadingOverlay active={loading} spinner={<GridLoader color="silver" />}>
        <BrowserRouter>
          <Container />
          <Switch>
            <DynamicRoute path="/login" component={Login} unauthenticated />
            <DynamicRoute exact path="/chat" component={Chat} authenticated />
            <DynamicRoute
              exact
              path="/manage"
              component={Manage}
              authenticated
            />
            <DynamicRoute path="/" component={Chat} authenticated />
          </Switch>
        </BrowserRouter>
      </LoadingOverlay>
    </ApolloProvider>
  );
};

export default App;
