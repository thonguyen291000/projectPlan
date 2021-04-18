import React from "react";
//Icons
import trash from "../../assets/icons/trash.png";
//Library
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
//Components
import EditGroupsModal from "../EditGroupsModal/EditGroupsModal";
//Redux
import { useSelector } from "react-redux";

const MemberItem = ({ member, room }) => {
  //Redux
  const email = useSelector((state) => state.user.info.email);

  return (
    <div className="card_content">
      <div className="member_avatar">
        <img src={member.avatar} />
      </div>
      <div className="content">
        <div>
          <h5>{member.email}</h5>
        </div>
      </div>
      {member.email !== email && (
        <a href="#" className="action">
          <Popup
            trigger={<img src={trash} />}
            position="right center"
            modal
            nested
          >
            {(close) => (
              <EditGroupsModal
                type="delete"
                closeModal={close}
                deleteData={{
                  target: "user",
                  room: room,
                  users: [member.email],
                }}
              />
            )}
          </Popup>
        </a>
      )}
    </div>
  );
};

export default MemberItem;
