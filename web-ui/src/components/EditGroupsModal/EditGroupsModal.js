import React from "react";
//Components
import Create from "./Tabs/Create";
import Delete from "./Tabs/Delete";
import Update from "./Tabs/Update";
//Icons
import close from "../../assets/icons/close_icon.png";

const EditGroupsModel = ({
  type,
  closeModal,
  className,
  roomDetails,
  usersOutRoom,
  deleteData,
}) => {
  const checkType = () => {
    switch (type) {
      case "create":
        return (
          <div>
            <h5>Create Room</h5>
            <div className="tab_content_create">
              <Create className={className} closeModal={closeModal} />
            </div>
          </div>
        );
      case "update":
        return (
          <div>
            <h5>Add Student</h5>
            <div className="tab_content_update">
              <Update
                object="user"
                roomDetails={roomDetails}
                usersOutRoom={usersOutRoom}
                closeModal={closeModal}
              />
            </div>
          </div>
        );
      case "update_room":
        return (
          <div>
            <h5>Room Update</h5>
            <div className="tab_content_update">
              <Update
                object="room"
                roomDetails={roomDetails}
                closeModal={closeModal}
              />
            </div>
          </div>
        );
      case "room_event":
        return (
          <div>
            <h5>New Event</h5>
            <div className="tab_content_update">
              <Update
                object="event"
                roomDetails={roomDetails}
                closeModal={closeModal}
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h5>Are you sure to delete?</h5>
            <div className="tab_content_delete">
              <Delete closeModal={closeModal} deleteData={deleteData} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="model_container">
      <img src={close} onClick={closeModal} />
      {checkType()}
    </div>
  );
};

export default EditGroupsModel;
