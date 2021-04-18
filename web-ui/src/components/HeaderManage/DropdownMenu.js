import React from "react";
//Library
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Image
import userImage from "../../assets/imgs/user_avatar.jpg";
//Icons
import profile from "../../assets/icons/profile.png";
import lock from "../../assets/icons/lock.png";
//Redux
import { useSelector } from "react-redux";

const DropdownMenu = ({ openModal, handleLogout }) => {
  //Redux
  const userAvatar = useSelector((state) => state.user.info.avatar);

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={userAvatar}
            alt="admin@bootstrapmaster.com"
            width="36"
            height="36"
            style={{ borderRadius: "50%" }}
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem onClick={openModal}>
          <CImg src={profile} height="15px" className="mfe-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <CImg src={lock} height="15px" className="mfe-2" />
          Lock Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default DropdownMenu;
