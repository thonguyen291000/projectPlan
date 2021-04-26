import React, { useEffect, useState } from "react";
//Components
import ChatItem from "./ChatItem";
import EditGroupsModal from "../../EditGroupsModal/EditGroupsModal";
import ChatItemSkeleton from "./ChatItemSkeleton";
//Icons
import open from "../../../assets/icons/right-arrow.png";
import close from "../../../assets/icons/up-arrow.png";
import class_icon from "../../../assets/icons/class.png";
import add_icon from "../../../assets/icons/plus.png";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedGroup,
  setChosenClass,
  setSeenRooms,
  setSeenMessage,
  setClassShowCollapse,
  setMoreRooms,
  setUpdateListRoom,
} from "../../../redux/actions/dataAction";
//Library
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
// Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError } from "../../../utils/toast";

const UPDATE_USER_SEENROOMS = gql`
  mutation(
    $email: String!
    $name: String!
    $password: String!
    $avatar: String!
    $seenRooms: [String]
  ) {
    updateUser(
      email: $email
      name: $name
      password: $password
      avatar: $avatar
      seenRooms: $seenRooms
    ) {
      seenRooms
    }
  }
`;

const UPDATE_MESSAGE = gql`
  mutation(
    $message: ID!
    $content: String
    $seen: String
    $fileName: String
    $mimetype: String
    $encoding: String
    $url: String
    $usersSeenMessage: [String]
  ) {
    updateMessage(
      message: $message
      content: $content
      seen: $seen
      fileName: $fileName
      mimetype: $mimetype
      encoding: $encoding
      url: $url
      usersSeenMessage: $usersSeenMessage
    ) {
      _id
      usersSeenMessage
      room {
        name
      }
    }
  }
`;

const ChatDropDown = ({
  className,
  newGroups,
  groups,
  openChatContent,
  index,
  unreadMessages,
  seenRooms,
  newRoomNameData,
  initialRooms,
}) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const searchData = useSelector((state) => state.data.searchData);
  const deletedRoom = useSelector((state) => state.data.deletedRoom);
  const updateListRoom = useSelector((state) => state.data.updateListRoom);
  const closeChatMobile = useSelector((state) => state.data.closeChatMobile);
  //Variables
  const [collapse, setCollapse] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [hideViewMore, setHideViewMore] = useState(false);
  //Apollo
  const [updateUserSeenRooms, updateUserSeenRoomsProps] = useMutation(
    UPDATE_USER_SEENROOMS,
    {
      onCompleted(data) {
        dispatch(setSeenRooms(data.updateUser.seenRooms));
      },
      onError(err) {
        notifyError(err.message);
      },
    }
  );

  const [updateMessage, updateUserSeenMessagesProps] = useMutation(
    UPDATE_MESSAGE,
    {
      onCompleted(data) {
        dispatch(setSeenMessage(data.updateMessage));
      },
      onError(err) {
        console.log(err);
        notifyError(err.message);
      },
    }
  );
  // //Hook
  // useEffect(() => {
  //   const collapseElements = document.getElementsByClassName("collapse");

  //   collapseElements[0].className += " show";

  //   setCollapse(!collapse);
  // }, []);

  //Methods
  useEffect(() => {
    if (closeChatMobile) {
      const optionRoomElements = document.getElementsByName("option_room");

      for (var i = 0; i < optionRoomElements.length; i++) {
        optionRoomElements[i].style.backgroundColor = "#f7f7ff";
      }

      localStorage.setItem("selectedRoom", null);
    }
  }, [closeChatMobile]);

  const handleSelectedGroup = (group, updateSeenRoom) => {
    const optionRoomElements = document.getElementsByName("option_room");

    for (var i = 0; i < optionRoomElements.length; i++) {
      if (optionRoomElements[i].id === group?.name) {
        optionRoomElements[i].style.backgroundColor = "#E6EBF5";
      } else {
        optionRoomElements[i].style.backgroundColor = "#f7f7ff";
      }
    }

    localStorage.setItem("selectedRoom", JSON.stringify(group));

    if (group && updateSeenRoom) {
      updateUserSeenRooms({
        variables: {
          email,
          name: "",
          password: "",
          avatar: "",
          seenRooms: [
            ...seenRooms.filter((item) => item !== group.name),
            group.name,
          ],
        },
      });

      if (group.messages && group.messages.length > 0) {
        for (var i = 0; i < group.messages.length; i++) {
          if (group.messages[i].usersSeenMessage?.indexOf(email) === -1) {
            if (group.messages[i].usersSeenMessage.length === 0) {
              updateMessage({
                variables: {
                  message: group.messages[i]._id,
                  content: "",
                  seen: "true",
                  fileName: "",
                  mimetype: "",
                  encoding: "",
                  url: "",
                  usersSeenMessage: [email],
                },
              });
            } else {
              updateMessage({
                variables: {
                  message: group.messages[i]._id,
                  content: "",
                  seen: "true",
                  fileName: "",
                  mimetype: "",
                  encoding: "",
                  url: "",
                  usersSeenMessage: [
                    ...group.messages[i].usersSeenMessage.filter(
                      (item) => item !== email
                    ),
                    email,
                  ],
                },
              });
            }
          }
        }
      }

      dispatch(setSelectedGroup(group.name));
      dispatch(setChosenClass(className));
      openChatContent();
    }
  };

  const handleShowCollapse = (event) => {
    if (groups.length === 0) {
      dispatch(setClassShowCollapse(className));
    }

    const collapseElements = document.getElementsByClassName("collapse");

    for (var i = 0; i < collapseElements.length; i++) {
      if (collapseElements[i].id === `chat_collapse_${index}`) {
        if (collapseElements[i].className.includes("show")) {
          collapseElements[i].className = "collapse";
        } else {
          collapseElements[i].className += " show";
        }
      } else if (collapseElements[i].id.includes("chat_collapse")) {
        collapseElements[i].className = "collapse";
      }
      setCollapse(!collapse);
    }
  };

  //   const handleShowEdit = () => {
  //     setShowEdit(true);
  //   };

  const getMoreRooms = (e) => {
    e.preventDefault();

    var offset;

    if (newGroups) {
      offset = newGroups[newGroups.length - 1].name;
    } else {
      offset = initialRooms[initialRooms.length - 1].name;
    }

    dispatch(setMoreRooms({ className, offset }));
  };

  useEffect(() => {
    if (newGroups?.length === 0 || newGroups?.length < 4) {
      setHideViewMore(true);
    }
  }, [newGroups]);

  useEffect(() => {
    if (!newGroups) {
      if (groups.length < 4 && groups.length >= 0) {
        setHideViewMore(true);
      } else {
        setHideViewMore(false);
      }
    }
  }, [groups]);

  useEffect(() => {
    if (deletedRoom) handleSelectedGroup();
  }, [deletedRoom]);

  useEffect(() => {
    try {
      const currentRoom = JSON.parse(localStorage.getItem("selectedRoom"));
      if (updateListRoom && (newRoomNameData || currentRoom)) {
        handleSelectedGroup(
          newRoomNameData ? null : currentRoom,
          newRoomNameData ? true : false
        );

        dispatch(setUpdateListRoom());
      }
    } catch (err) {
      console.log(err);
    }
  }, [updateListRoom]);

  return (
    <div className="card" id="card">
      <a href="#" onClick={handleShowCollapse}>
        <div className="title_tab">
          <div>
            <img src={class_icon} className="class_icon" />
            <span>{className}</span>
            {unreadMessages && (
              <div className="unread_message_class">
                <span className="badge_unread_class">{`${unreadMessages} unread rooms`}</span>
              </div>
            )}
          </div>
          <img src={collapse ? open : close} className="open_close_icon" />
        </div>
      </a>
      <div className="collapse" id={`chat_collapse_${index}`}>
        <div className="card_body">
          <ul>
            {groups.length === 0 ? (
              [1, 2, 3, 4].map((item, index) => (
                <li name="option_room" key={index}>
                  <ChatItemSkeleton />
                </li>
              ))
            ) : (
              <>
                <li>
                  <Popup
                    trigger={
                      <a href="#">
                        <div className="edit_chat">
                          <img src={add_icon} className="edit_icon" />
                          <span>Add new group</span>
                        </div>
                      </a>
                    }
                    position="right center"
                    modal
                    nested
                  >
                    {(close) => (
                      <EditGroupsModal
                        type="create"
                        closeModal={close}
                        className={className}
                      />
                    )}
                  </Popup>
                </li>
                {groups.map((item, index) => {
                  if (searchData !== "") {
                    if (item.name.includes(searchData)) {
                      return (
                        <li
                          name="option_room"
                          key={index}
                          onClick={() => handleSelectedGroup(item, true)}
                          id={item.name}
                        >
                          <ChatItem
                            item={item}
                            newRoomNameData={newRoomNameData}
                            numberGroup={groups.length}
                          />
                        </li>
                      );
                    }
                  } else {
                    return (
                      <li
                        name="option_room"
                        key={index}
                        onClick={() => handleSelectedGroup(item, true)}
                        id={item.name}
                      >
                        <ChatItem
                          item={item}
                          newRoomNameData={newRoomNameData}
                          numberGroup={groups.length}
                        />
                      </li>
                    );
                  }
                })}
                {!hideViewMore && (
                  <li className="button_view_more_rooms">
                    <button type="button" onClick={getMoreRooms}>
                      View more
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatDropDown;
