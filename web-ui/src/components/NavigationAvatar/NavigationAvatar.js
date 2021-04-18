import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//Library
import useOnclickOutside from "react-cool-onclickoutside";
//Icon
import user_avatar from "../../assets/imgs/user_avatar.jpg";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../redux/actions/userAction";
// Apollo
import { gql, useMutation } from "@apollo/client";

const LOGOUT = gql`
  mutation Logout($email: String!) {
    logout(email: $email) {
      status
    }
  }
`;

function NavigationAvatar() {
  const history = useHistory();
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const avatar = useSelector((state) => state.user.info.avatar);
  //Apollo
  const [logout] = useMutation(LOGOUT);
  //Variables
  const [show, setShow] = useState(false);
  //Methods
  const ref = useOnclickOutside(() => {
    setShow(false);
  });

  const handleOpenDropdownMenu = (e) => {
    e.preventDefault();

    setShow(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    //Set logout redux
    dispatch(setLogout());
    //Set logout status on database
    logout({ variables: { email } });
    history.push("/login");
  };

  return (
    <div className="user_avatar">
      <a href="#" onClick={handleOpenDropdownMenu}>
        <img src={avatar} />
      </a>

      <div className={show ? "dropdown_menu show" : "dropdown_menu"} ref={ref}>
        <a href="" onClick={handleLogout}>
          Log out <span>↳</span>
        </a>
      </div>
    </div>
  );
}

export default NavigationAvatar;
