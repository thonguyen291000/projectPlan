import React from "react";
//Icons
import trash from "../../assets/icons/trash.png";
import room_owner from "../../assets/icons/room_owner.png";
//Library
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
//Components
import EditGroupsModal from "../EditGroupsModal/EditGroupsModal";
//Redux
import { useSelector } from "react-redux";

const MemberItem = ({ member, room, owner }) => {
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
      {owner === member.email && (
        <div className="action" data-tip="Owner">
          <img src={room_owner} />
        </div>
      )}
      {member.email !== email && owner === email && (
        <a href="#" className="action" data-tip="Delete">
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
