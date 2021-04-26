import React, { useEffect, useState } from "react";
//Library
import ReactTooltip from "react-tooltip";
//Components
import NavigationTabs from "../../components/NavigationTabs/NavigationTabs";
import NavigationAvatar from "../../components/NavigationAvatar/NavigationAvatar";
import SwitchTab from "../../components/Tabs/SwitchTab";
import ChatHeader from "../../components/ChatScreen/ChatHeader";
import ChatArea from "../../components/ChatScreen/ChatArea/ChatArea";
import GroupInfor from "../../components/GroupInfo/GroupInfo";
import ChatInput from "../../components/ChatScreen/ChatInput";
//Icons
import app_icon from "../../assets/icons/app-icon.svg";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setLoading,
  setNewMessage,
  setRoomDetailChatTab,
  setDeletedUser,
  setEachRoomDetails,
  setMoreMessages,
  setDeletedRoom,
  setUpdateListRoom,
  setCloseChatMobile,
} from "../../redux/actions/dataAction";
//Apollo
import { gql, useQuery, useSubscription } from "@apollo/client";
//Toast
import { notifyError } from "../../utils/toast";

const GET_ROOM = gql`
  query($name: String!, $limit: Int) {
    room(name: $name) {
      _id
      createdAt
      name
      event
      whoCreated
      rootRoom {
        _id
        name
      }
      avatar
      messages(limit: $limit) {
        _id
        createdAt
        user {
          _id
          email
          avatar
        }
        content
        type
        filename
        mimetype
        url
        size
        room {
          name
        }
        replyToMessage {
          content
          filename
        }
        reacts
      }
      users {
        _id
        email
        avatar
      }
    }
  }
`;

const GET_MORE_MESSAGE = gql`
  query($name: String!, $offset: String, $limit: Int) {
    room(name: $name) {
      _id
      messages(offset: $offset, limit: $limit) {
        _id
        createdAt
        user {
          _id
          email
          avatar
        }
        content
        type
        filename
        mimetype
        url
        size
        room {
          name
        }
        replyToMessage {
          content
          filename
        }
        reacts
      }
    }
  }
`;

const GET_CLASS = gql`
  query($name: String!) {
    class(name: $name) {
      _id
      users {
        _id
        email
        role
      }
    }
  }
`;
const UPDATE_MESSAGE = gql`
  subscription {
    updateMessage {
      _id
      createdAt
      user {
        _id
        email
        avatar
      }
      content
      type
      filename
      mimetype
      url
      size
      room {
        name
      }
      replyToMessage {
        content
        filename
      }
      reacts
    }
  }
`;

const NEW_USER_ADDED = gql`
  subscription {
    newUsersJoinRoom {
      users {
        _id
        email
        avatar
      }
    }
  }
`;

const NEW_ROOM_AVATAR = gql`
  subscription {
    newRoomAvatar {
      room
      url
    }
  }
`;

const NEW_USER_AVATAR = gql`
  subscription {
    newUserAvatar {
      email
      avatar
    }
  }
`;

const DELETE_MESSAGE_ANNOUNCE = gql`
  subscription {
    deleteMessage {
      _id
      room {
        name
      }
    }
  }
`;

const UPDATE_ROOM = gql`
  subscription {
    updateRoom {
      name
      oldName
      event
    }
  }
`;

const Chat = () => {
  //Redux
  const dispatch = useDispatch();
  const chosenRoom = useSelector((state) => state.data.group);
  const newMessage = useSelector((state) => state.data.newMessage);
  const moreMessages = useSelector((state) => state.data.moreMessages);
  const chosenClass = useSelector((state) => state.data.class);
  const deletedRoom = useSelector((state) => state.data.deletedRoom);
  const dataFromServer = useSelector((state) => {
    if (chosenRoom) {
      return state.data[`${chosenRoom}`];
    }
  });
  const deletedUserData = useSelector((state) => state.data.deletedUserData);
  const avatarRoom = useSelector((state) => state.data.avatarRoom);
  const updateListRoom = useSelector((state) => state.data.updateListRoom);
  //Variables
  const [newUsers, setNewUsers] = useState();
  const [checked, setChecked] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState();
  const [updatedMessage, setUpdatedMessage] = useState();
  const [newRoomAvatarData, setNewRoomAvatarData] = useState();
  const [
    closeChatContentWhenRoomDeleted,
    setCloseChatContentWhenRoomDeleted,
  ] = useState(false);
  const [newRoomName, setNewRoomName] = useState();
  const [newEvent, setNewEvent] = useState();
  const [newUserAvatar, setNewUserAvatar] = useState();
  //Apollo
  var { loading, error, data } = useQuery(GET_ROOM, {
    variables: { name: chosenRoom, limit: 5 },
    skip: chosenRoom !== "" ? false : true,
    onError(error) {
      notifyError(error.message);
    },
  });

  var moreMessageData = useQuery(GET_MORE_MESSAGE, {
    variables: { name: chosenRoom, offset: moreMessages?.offset, limit: 5 },
    skip: moreMessages ? false : true,
    onError(error) {
      notifyError(error.message);
    },
  });

  var classFromServer = useQuery(GET_CLASS, {
    variables: { name: chosenClass },
    skip: chosenClass !== "" ? false : true,
    onError(error) {
      notifyError(error.message);
    },
  });

  useSubscription(UPDATE_MESSAGE, {
    onSubscriptionData(data) {
      setUpdatedMessage(data.subscriptionData.data.updateMessage);
    },
  });

  useSubscription(NEW_ROOM_AVATAR, {
    onSubscriptionData(data) {
      setNewRoomAvatarData(data.subscriptionData.data.newRoomAvatar);
    },
  });

  const roomWithNewUsers = useSubscription(NEW_USER_ADDED, {
    onSubscriptionData({ subscriptionData }) {
      setNewUsers(subscriptionData.data.newUsersJoinRoom.users);
    },
  });

  useSubscription(DELETE_MESSAGE_ANNOUNCE, {
    onSubscriptionData(data) {
      setDeleteMessage(data.subscriptionData.data.deleteMessage);
    },
  });

  useSubscription(UPDATE_ROOM, {
    onSubscriptionData(data) {
      const room = data.subscriptionData.data.updateRoom;
      if (room.name !== room.oldName) {
        setNewRoomName(room.name);
        dispatch(setUpdateListRoom());
        setTimeout(() => {
          dispatch(setUpdateListRoom(true));
          closeChatContent();
          setCloseChatContentWhenRoomDeleted(true);
          closeSlidebar();
        }, 500);
      } else {
        setNewEvent(room.event);
        dispatch(setUpdateListRoom());
        setTimeout(() => {
          dispatch(setUpdateListRoom(true));
        }, 500);
      }
    },
  });

  useSubscription(NEW_USER_AVATAR, {
    onSubscriptionData(data) {
      setNewUserAvatar(data.subscriptionData.data.newUserAvatar);
    },
  });

  //Methods
  useEffect(() => {
    if (newUserAvatar) {
      const newMessagesArray = [];
      const newUsersArray = [];
      for (
        let index = 0;
        index < dataFromServer.room.messages.length;
        index++
      ) {
        const message = dataFromServer.room.messages[index];

        if (message.user.email === newUserAvatar.email) {
          newMessagesArray.push({
            ...message,
            user: {
              email: newUserAvatar.email,
              avatar: newUserAvatar.avatar,
            },
          });
        } else {
          newMessagesArray.push(message);
        }
      }

      for (let index = 0; index < dataFromServer.room.users.length; index++) {
        const user = dataFromServer.room.users[index];

        if (user.email === newUserAvatar.email) {
          newUsersArray.push({
            ...user,
            avatar: newUserAvatar.avatar,
          });
        } else {
          newUsersArray.push(user);
        }
      }

      var room = {
        room: {
          ...dataFromServer.room,
          messages: newMessagesArray,
          users: newUsersArray,
        },
      };

      dispatch(setRoomDetailChatTab(dataFromServer.room.name, room));
    }
  }, [newUserAvatar]);

  useEffect(() => {
    if (moreMessages) {
      moreMessageData.fetchMore({
        variables: {
          name: chosenRoom,
          offset: moreMessages?.offset,
          limit: 5,
        },
      });
    }
  }, [moreMessages]);

  useEffect(() => {
    dispatch(setLoading(moreMessageData.loading));

    if (
      !moreMessageData.loading &&
      moreMessageData.data?.room &&
      moreMessages
    ) {
      var room;
      var messages = moreMessageData.data.room.messages.filter(
        (message) => message
      );

      if (messages.length === 0) {
        room = {
          room: {
            ...dataFromServer.room,
            getAllMessages: "true",
          },
        };
      } else {
        room = {
          room: {
            ...dataFromServer.room,
            messages: [...dataFromServer.room.messages, ...messages],
            newMessages: messages ? messages : [],
            getAllMessages: messages.length < 5 ? "true" : "false",
          },
        };
      }

      dispatch(setRoomDetailChatTab(dataFromServer.room.name, room));
      dispatch(setMoreMessages());
    }
  }, [moreMessageData.loading]);

  useEffect(() => {
    if (newEvent) {
      const room = {
        room: {
          ...dataFromServer.room,
          event: newEvent,
        },
      };

      dispatch(setRoomDetailChatTab(dataFromServer.room.name, room));
    }
  }, [newEvent]);

  useEffect(() => {
    if (newRoomName) {
      const room = {
        room: {
          ...dataFromServer.room,
          name: newRoomName,
        },
      };

      dispatch(setRoomDetailChatTab(dataFromServer.room.name, room));
    }
  }, [newRoomName]);

  useEffect(() => {
    if (updatedMessage) {
      var index = 0;
      var flag = false;
      const updatedMessageArray = dataFromServer.room.messages.filter(
        (message) => {
          if (!flag) {
            index += 1;
          }
          if (updatedMessage._id === message._id) {
            flag = true;
          }
          return updatedMessage._id !== message._id;
        }
      );
      var arr1 = updatedMessageArray.splice(0, index - 1);

      const updatedRoom = {
        room: {
          ...dataFromServer.room,
          messages: [...arr1, updatedMessage, ...updatedMessageArray],
        },
      };

      dispatch(setRoomDetailChatTab(dataFromServer.room.name, updatedRoom));
    }
  }, [updatedMessage]);

  useEffect(() => {
    if (deleteMessage) {
      const updatedMessageArray = dataFromServer.room.messages.filter(
        (message) => message._id !== deleteMessage._id
      );

      const updatedRoom = {
        room: {
          ...dataFromServer.room,
          messages: updatedMessageArray,
        },
      };

      dispatch(setRoomDetailChatTab(deleteMessage.room.name, updatedRoom));
    }
  }, [deleteMessage]);

  useEffect(() => {
    if (newRoomAvatarData) {
      var avatarRoom = newRoomAvatarData;

      const room = {
        room: {
          ...dataFromServer.room,
          avatar: avatarRoom.url,
        },
      };

      dispatch(setRoomDetailChatTab(avatarRoom.room, room));
    }
  }, [newRoomAvatarData]);

  useEffect(() => {
    // dispatch(setLoading(loading));

    if (!loading && data && !dataFromServer) {
      var numberMessage = data.room.messages.filter(message => message).length;
      var room;

      if(numberMessage > 4) {
        room = {
          room: {
            ...data.room,
            getAllMessages: "false",
          }
        }
      } else {
        room = {
          room: {
            ...data.room,
            getAllMessages: "true",
          }
        }
      }
      
      dispatch(setRoomDetailChatTab(chosenRoom, room));
    }
  }, [loading]);

  useEffect(() => {
    if (avatarRoom) {
      const room = {
        room: {
          ...dataFromServer.room,
          avatar: avatarRoom.url,
        },
      };

      dispatch(setRoomDetailChatTab(avatarRoom.room, room));
    }
  }, [avatarRoom]);

  useEffect(() => {
    if (deletedRoom) {
      setCloseChatContentWhenRoomDeleted(true);

      closeSlidebar();

      closeChatContent();

      dispatch(setDeletedRoom());
    }
  }, [deletedRoom]);

  useEffect(() => {
    if (newUsers) {
      try {
        const newData = {
          room: {
            ...dataFromServer.room,
            users: [],
          },
        };

        newData.room.users = newUsers;
        dispatch(setRoomDetailChatTab(chosenRoom, newData));
        setNewUsers();
      } catch (error) {}
    }
  }, [newUsers]);

  useEffect(() => {
    if (deletedUserData) {
      if (dataFromServer.room.name === deletedUserData.room) {
        const newData = {
          room: {
            ...dataFromServer.room,
            users: deletedUserData.users,
          },
        };

        dispatch(setRoomDetailChatTab(chosenRoom, newData));
        dispatch(setDeletedUser(null));
      }
    }
  }, [deletedUserData]);

  useEffect(() => {
    if (newMessage !== null && dataFromServer) {
      var newMessageArray = [];

      for (var i = dataFromServer.room.messages.length - 1; i >= 0; i--) {
        newMessageArray.push(dataFromServer.room.messages[i]);
      }

      newMessageArray.push(newMessage);

      const updatedData = {
        room: {
          ...dataFromServer.room,
          messages: newMessageArray.reverse(),
        },
      };

      if (localStorage.getItem("createRoom") !== "true") {
        dispatch(setRoomDetailChatTab(chosenRoom, updatedData));
      } else {
        closeSlidebar();
        setCloseChatContentWhenRoomDeleted(true);
        localStorage.setItem("createRoom", null);
      }
    }
  }, [newMessage]);

  useEffect(() => {
    if (chosenRoom !== "" && !dataFromServer) {
      //Set to open chat content
      setCloseChatContentWhenRoomDeleted(false);

      dispatch(setRoomDetailChatTab(chosenRoom, data));

      closeSlidebar();
    }
  }, [chosenRoom]);

  const openChatContent = () => {
    const chatContent = document.getElementById("affect");

    chatContent.className = chatContent.className + " show_chat";

    dispatch(setCloseChatMobile());
  };

  const closeChatContent = () => {
    try {
      const chatContent = document.getElementById("affect");

      chatContent.className = chatContent.className.slice(0, 23);

      dispatch(setCloseChatMobile(true));
    } catch (error) {}
  };

  const openSlidebar = () => {
    const sidebar = document.getElementsByClassName("sidebar");
    const width_100 = document.getElementsByClassName("width_100");

    try {
      sidebar[0].style.display = "block";
      sidebar[0].style.height = "120vh";
      width_100[0].style.width = "100%";
    } catch (error) {}
  };

  const closeSlidebar = () => {
    try {
      const sidebar = document.getElementsByClassName("sidebar");
      const width_100 = document.getElementsByClassName("width_100");

      sidebar[0].style.display = "none";
      width_100[0].style.width = "100%";
    } catch (error) {}
  };

  return (
    <div className="chat_container">
      {chosenRoom !== "" ||
        dataFromServer ||
        (!closeChatContentWhenRoomDeleted && <ReactTooltip />)}
      <div className="chat_info_container">
        <div className="chat_navigation">
          <div className="app_icon">
            <img src={app_icon} />
          </div>
          <NavigationTabs />
          <NavigationAvatar />
        </div>
        <div className="chat_info">
          <SwitchTab openChatContent={openChatContent} />
        </div>
      </div>
      <div className="chat_content_container" id="affect">
        <div className="flex">
          <div className="width_100">
            {!closeChatContentWhenRoomDeleted && (
              <>
                {chosenRoom !== "" && dataFromServer ? (
                  <>
                    <ChatHeader
                      openSlidebar={openSlidebar}
                      closeChatContent={closeChatContent}
                      roomDetails={dataFromServer.room}
                    />
                    <ChatArea roomDetails={dataFromServer.room} />
                    <ChatInput roomDetails={dataFromServer.room} />
                  </>
                ) : (
                  <>
                    {chosenRoom !== "" && (
                      <>
                        <ChatHeader />
                        <ChatArea />
                        <ChatInput />
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {dataFromServer && classFromServer.data && (
            <div className="sidebar">
              <GroupInfor
                closeSlidebar={closeSlidebar}
                roomDetails={dataFromServer && dataFromServer.room}
                classFromServer={classFromServer.data.class}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
