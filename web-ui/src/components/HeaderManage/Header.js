import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//Library
import { CHeader, CHeaderNav, CImg } from "@coreui/react";
//Icons
import app_icon from "../../assets/icons/app-icon.svg";
//Components
import DropdownMenu from "./DropdownMenu";
import ModalProfile from "./ModalProfile";
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

const Header = () => {
  const history = useHistory();
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const userName = useSelector((state) => state.user.info.name);
  //Apollo
  const [logout] = useMutation(LOGOUT);
  //Variables
  const [modal, setModal] = useState(false);
  //Methods
  const openModal = () => {
    setModal(true);
  };

  const handleLogout = (e) => {
    localStorage.removeItem("user");
    //Set logout status on database
    logout({ variables: { email } });
    //Set logout in redux
    dispatch(setLogout());
    history.push("/login");
    window.location.reload();
  };

  return (
    <>
      <CHeader className="header_manage_container">
        <CHeaderNav className="px-3">
          <CImg name="logo" height="48" alt="Logo" src={app_icon} />
        </CHeaderNav>

        <CHeaderNav className="mr-auto"></CHeaderNav>
        <CHeaderNav className="px-3 text_welcome">
          <h4>
            <b>
              Welcome <u>{userName}</u>
            </b>
          </h4>
          <DropdownMenu openModal={openModal} handleLogout={handleLogout} />
        </CHeaderNav>
        <ModalProfile modal={modal} setModal={setModal} />
      </CHeader>
    </>
  );
};

export default Header;
