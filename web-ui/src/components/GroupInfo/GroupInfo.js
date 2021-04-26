import React, { useEffect, useState } from "react";
//Image
import userImage from "../../assets/imgs/user_avatar.jpg";
//Icons
import close_x from "../../assets/icons/close.png";
import online from "../../assets/icons/online.png";
import add_more from "../../assets/icons/plus.png";
import trash from "../../assets/icons/trash.png";
import edit_icon from "../../assets/icons/edit.png";
import edit_room_name from "../../assets/icons/edit_name.png";
import event from "../../assets/icons/event.png";
//Components
import MemberItem from "./MemberItem";
import EditGroupsModal from "../EditGroupsModal/EditGroupsModal";
//Library
import ReactTooltip from "react-tooltip";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
//Redux
import { setLoading, updateRoomAvatar } from "../../redux/actions/dataAction";
import { useDispatch, useSelector } from "react-redux";
// Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError, notifySuccess } from "../../utils/toast";
//Const
import { UPDATE_AVATAR } from "../../const/string";

const UPLOAD_AVATAR = gql`
  mutation(
    $file: Upload!
    $idOrEmail: String!
    $messageOrUser: String!
    $user: String
  ) {
    uploadFile(
      file: $file
      idOrEmail: $idOrEmail
      messageOrUser: $messageOrUser
      user: $user
    ) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

const GroupInfo = ({ closeSlidebar, roomDetails, classFromServer }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  //Apollo
  const [uploadFile, updateAvatarPros] = useMutation(UPLOAD_AVATAR, {
    update(_, res) {
      const avatarData = {
        url: res.data.uploadFile.url,
        room: roomDetails.name,
      };
      //Edit in redux
      dispatch(updateRoomAvatar(avatarData));
    },
    onCompleted(data) {
      notifySuccess(UPDATE_AVATAR);
    },
    onError(err) {
      console.log(err);
      notifyError(err.message);
    },
  });
  //Variables
  const [usersOutRoom, setUsersOutRoom] = useState();
  //Methods

  useEffect(() => {
    dispatch(setLoading(updateAvatarPros.loading));
  }, [updateAvatarPros.loading]);

  useEffect(() => {
    //Get email of users out room
    if (roomDetails && classFromServer) {
      var usersInRoom = [];
      var usersInClass = [];
      var usersOutRoom = [];

      for (var i = 0; i < roomDetails.users.length; i++) {
        usersInRoom.push(roomDetails.users[i].email);
      }

      for (var i = 0; i < classFromServer.users.length; i++) {
        if (classFromServer.users[i].role !== "staff") {
          usersInClass.push(classFromServer.users[i].email);
        }
      }

      for (var i = 0; i < usersInClass.length; i++) {
        if (usersInRoom.indexOf(usersInClass[i]) === -1) {
          usersOutRoom.push(usersInClass[i]);
        }
      }

      setUsersOutRoom(usersOutRoom);
    }
  }, [roomDetails.users, classFromServer.users]);

  const handleEditAvatar = () => {
    const fileInput = document.getElementById("file_input");
    fileInput.click();
  };

  const handleUploadImage = (e) => {
    const {
      target: {
        validity,
        files: [file],
      },
    } = e;

    if (validity.valid) {
      uploadFile({
        variables: {
          file,
          idOrEmail: roomDetails.name,
          messageOrUser: "room",
          user: email,
        },
      });
    }
  };

  return (
    <div className="group_content">
      <ReactTooltip />
      <div className="group_content_header">
        <h4>Group Details</h4>
        <div className="float_right_dropdown">
          <div className="dropdown">
            <a href="#">
              {closeSlidebar && <img src={close_x} onClick={closeSlidebar} />}
            </a>
            <div className="dropdown_menu"></div>
          </div>
        </div>
      </div>
      <div className="group_session">
        <div className="group_session_image">
          <img src={roomDetails.avatar} />
          <button className="btn_edit_room_avatar" onClick={handleEditAvatar}>
            <img className="edit_icon" src={edit_icon} />
            <input
              type="file"
              name="file_input"
              id="file_input"
              accept="image/*"
              hidden
              onChange={handleUploadImage}
            />
          </button>
        </div>
        <div className="group_session_name">
          {roomDetails && roomDetails.name.split("|")[0]}
        </div>
        <div className="group_session_state">
          <img src={online} /> Active
        </div>
        {email === roomDetails.whoCreated && (
          <div className="group_session_action">
            <Popup
              trigger={<img src={edit_room_name} data-tip="Set name" />}
              position="right center"
              modal
              nested
            >
              {(close) => (
                <EditGroupsModal
                  type="update_room"
                  closeModal={close}
                  roomDetails={roomDetails}
                />
              )}
            </Popup>

            <Popup
              trigger={<img src={event} data-tip="Set event" />}
              position="right center"
              modal
              nested
            >
              {(close) => (
                <EditGroupsModal
                  type="room_event"
                  closeModal={close}
                  roomDetails={roomDetails}
                />
              )}
            </Popup>

            <Popup
              trigger={<img src={trash} data-tip="Delete" />}
              position="right center"
              modal
              nested
            >
              {(close) => (
                <EditGroupsModal
                  type="delete"
                  closeModal={close}
                  deleteData={{ target: "room", name: roomDetails.name }}
                />
              )}
            </Popup>
          </div>
        )}
      </div>

      <div className="list_members">
        <h5 className="brief_title">Member list</h5>
        <div className="list_content">
          <div className="list_wrapper">
            <div className="auto_height_wrapper">
              <div className="auto_height"></div>
            </div>
            <div className="bar_mask">
              <div className="bar_offset">
                <div className="list_wrapper">
                  <div className="list">
                    <div className="accordion">
                      <Popup
                        trigger={
                          <div>
                            <div className="card_content">
                              <div
                                className="member_avatar"
                                style={{ width: "auto" }}
                              >
                                <img src={add_more} />
                              </div>
                              <div className="content add">
                                <div>
                                  <h5>Add member</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                        position="right center"
                        modal
                        nested
                      >
                        {(close) => (
                          <EditGroupsModal
                            type="update"
                            closeModal={close}
                            roomDetails={roomDetails}
                            usersOutRoom={usersOutRoom}
                          />
                        )}
                      </Popup>

                      {roomDetails &&
                        roomDetails.users.map((member, index) => (
                          <div key={index}>
                            <MemberItem
                              member={member}
                              room={roomDetails.name}
                              owner={roomDetails.whoCreated}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
