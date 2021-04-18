import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
//Toast
import { notifyError } from "../../utils/toast";
//Redux
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/userAction";
import { setLoading } from "../../redux/actions/dataAction";
//Image
import schoolIcon from "../../assets/imgs/cooperation.jpg";
//Const
import { ClientId } from "../../const/googleAPI";
// Apollo
import { gql, useMutation } from "@apollo/client";
//Logic
import { translateErrorMessage } from "../../funcs/errors";

const LOGIN = gql`
  mutation LOGIN($email: String!) {
    login(email: $email) {
      email
      name
      role
      token
      avatar
    }
  }
`;

const Login = () => {
  const history = useHistory();

  //Redux variables
  const dispatch = useDispatch();

  // Login mutation
  const [login, { loading }] = useMutation(LOGIN, {
    update(_, res) {
      const userDetails = res.data.login;
      userDetails.avatar = res.data.login.avatar
        ? res.data.login.avatar
        : emailDetails.imageUrl;

      localStorage.setItem("user", JSON.stringify(userDetails));

      const user = {
        email: userDetails.email,
        name: userDetails.name,
        role: userDetails.role.toLowerCase(),
        avatar: userDetails.avatar,
      };

      dispatch(setUserData(user));

      switch (user.role) {
        case "student":
          history.push("/chat");
          break;
        case "teacher":
          history.push("/chat");
          break;
        case "staff":
          history.push("/manage");
          break;
        case "admin":
          history.push("/manage");
          break;
        default:
          break;
      }
      window.location.reload();
    },
    onError(err) {
      notifyError(translateErrorMessage(err.message));
    },
  });

  //Variables
  const [emailDetails, setEmailDetails] = useState();
  //Methods
  React.useEffect(() => {
    setLoading(loading);
  }, [loading]);

  const responseGoogle = (response) => {
    setEmailDetails(response.profileObj);
    try {
      login({ variables: { email: response.profileObj.email } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login_container">
      <div className="content_container">
        <img className="school_icon" src={schoolIcon} />
        <span className="school_name">Academic Portal</span>
        <div className="email_container">
          <span className="login_label">Sign in</span>
          <GoogleLogin
            clientId={ClientId}
            buttonText="Login with school email"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
            theme="dark"
            className="btn_google"
          />
        </div>
        <span className="copyright">© Copyright by Nguyen Tho</span>
      </div>
    </div>
  );
};

export default Login;
