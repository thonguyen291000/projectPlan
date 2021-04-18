import React, { useEffect, useState } from "react";
//Library
import useSound from "use-sound";
import ping from "../../../assets/sound/ping.mp3";
//Icons
import search_icon from "../../../assets/icons/search.png";
//Components
import ChatDropDown from "./ChatDropDown";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedGroup,
  setLoading,
  setClassesInChatTab,
  setNewMessage,
  setClasses,
  setDeletedRoom,
  updateRoomAvatar,
  setSeenMessage,
  setSeenRooms,
  setFilesProfileTab,
  setSearchData,
  setClassShowCollapse,
  setMoreRooms,
  setUpdateListRoom,
} from "../../../redux/actions/dataAction";
// Apollo
import { gql, useQuery, useSubscription } from "@apollo/client";
import { notifyError } from "../../../utils/toast";

const GET_CLASSES = gql`
  query($email: String!) {
    user(email: $email) {
      _id
      classes {
        _id
        name
      }
      seenRooms
    }
  }
`;

const GET_ROOMS_IN_CLASS = gql`
  query($email: String!, $className: String, $limit: Int, $offset: String) {
    user(email: $email) {
      _id
      rooms(rootRoom: $className, offset: $offset, limit: $limit) {
        _id
        name
        event
        avatar
        rootRoom {
          _id
          name
        }
        newestMessage {
          _id
          createdAt
          usersSeenMessage
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
        }
      }
    }
  }
`;

const NEW_ROOM = gql`
  subscription {
    newRoom {
      _id
      name
      avatar
      event
      rootRoom {
        _id
        name
      }
      newestMessage {
        _id
        createdAt
        usersSeenMessage
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
      }
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription {
    newMessage {
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
    }
  }
`;

const NEW_USER_ADDED = gql`
  subscription {
    newUsersJoinRoom {
      _id
      name
      avatar
      rootRoom {
        _id
        name
      }
      newestMessage {
        _id
        createdAt
        usersSeenMessage
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

const REMOVE_USERS_FROM_ROOM = gql`
  subscription {
    removeUsersFromRoom {
      room
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

const ChatTab = ({ openChatContent }) => {
  //Sound
  const [play] = useSound(ping);
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const classesInChatTab = useSelector((state) => state.data.classesInChatTab);
  const avatarRoom = useSelector((state) => state.data.avatarRoom);
  const seenRooms = useSelector((state) => state.data.seenRooms);
  const usersSeenMessage = useSelector((state) => state.data.usersSeenMessage);
  const classShowCollapse = useSelector(
    (state) => state.data.classShowCollapse
  );
  const moreRooms = useSelector((state) => state.data.moreRooms);
  //Variables
  const [classes, setClasses] = useState();
  const [newRoomAvatarData, setNewRoomAvatarData] = useState();
  const [dataFromServer, setDataFromServer] = useState();
  const [newRoomAdded, setNewRoomAdded] = useState();
  const [removedRoom, setRemovedRoom] = useState();
  const [newRoomNameData, setNewRoomNameData] = useState();
  const [newEvent, setNewEvent] = useState();
  //Apollo query
  var { loading, error, data } = useQuery(GET_CLASSES, {
    variables: { email: email },
    skip: classesInChatTab ? true : false,
    onError(err) {
      notifyError(err.message);
    },
  });

  var getRoomsInClass = useQuery(GET_ROOMS_IN_CLASS, {
    variables: {
      email: email,
      className: classShowCollapse ? classShowCollapse : moreRooms?.className,
      limit: 4,
      offset: moreRooms?.offset,
    },
    skip: classShowCollapse || moreRooms ? false : true,
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
    onError(err) {
      notifyError(err.message);
    },
  });

  //Apollo subscription
  const dataNewRoom = useSubscription(NEW_ROOM, {
    onSubscriptionData(data) {
      //Set to when reset list room, it not match any room
      localStorage.setItem("selectedRoom", JSON.stringify({ name: null }));
      dispatch(setUpdateListRoom());
      setTimeout(() => {
        dispatch(setUpdateListRoom(true));
      }, 500);
    },
  });
  const dataNewMessage = useSubscription(NEW_MESSAGE, {
    onSubscriptionData(data) {
      if (data.subscriptionData.data.newMessage.user.email !== email) {
        play();
      }
    },
  });

  useSubscription(NEW_ROOM_AVATAR, {
    onSubscriptionData(data) {
      setNewRoomAvatarData(data.subscriptionData.data.newRoomAvatar);
    },
  });

  useSubscription(NEW_USER_ADDED, {
    onSubscriptionData({ subscriptionData }) {
      setNewRoomAdded(subscriptionData.data.newUsersJoinRoom);
    },
  });

  useSubscription(REMOVE_USERS_FROM_ROOM, {
    onSubscriptionData({ subscriptionData }) {
      setRemovedRoom(subscriptionData.data.removeUsersFromRoom);
    },
  });

  useSubscription(UPDATE_ROOM, {
    onSubscriptionData({ subscriptionData }) {
      const room = subscriptionData.data.updateRoom;

      if (room.event) {
        setNewEvent(room);
      } else {
        setNewRoomNameData(room);
      }

      dispatch(setUpdateListRoom(true));
    },
  });

  useEffect(() => {
    if (dataNewRoom.data?.newRoom) {
      const newRoom = dataNewRoom.data.newRoom;
      if (!newRoom.messages || !newRoom.newMessages) {
        newRoom.messages = [];
      }

      const newCache = {
        user: {
          ...dataFromServer?.user,
          rooms: [newRoom, ...dataFromServer?.user.rooms],
        },
      };

      dispatch(setClassesInChatTab(newCache));
      setNewRoomNameData();
    }
  }, [dataNewRoom.data?.newRoom]);

  useEffect(() => {
    if (dataNewMessage.data?.newMessage) {
      const newMessage = dataNewMessage.data.newMessage;

      var newRoomArray = [];

      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name === newMessage.room.name) {
          newRoomArray.push({
            ...dataFromServer?.user.rooms[i],
            messages: [newMessage, ...dataFromServer?.user.rooms[i].messages],
          });
        } else {
          newRoomArray.push(dataFromServer?.user.rooms[i]);
        }
      }

      const newCache = {
        user: {
          ...dataFromServer?.user,
          rooms: newRoomArray,
        },
      };

      dispatch(setNewMessage(newMessage));
      dispatch(setClassesInChatTab(newCache));
    }
  }, [dataNewMessage.data?.newMessage]);

  useEffect(() => {
    if (newRoomAdded) {
      const fileredRooms = dataFromServer?.user.rooms.filter(
        (room) => room.name === newRoomAdded.name
      );

      newRoomAdded.messages = [newRoomAdded.newestMessage];

      //Add new room when this user is added
      if (fileredRooms.length === 0) {
        var newRoomArray = [];

        for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
          newRoomArray.push(dataFromServer?.user.rooms[i]);
        }

        newRoomArray.unshift(newRoomAdded);

        const newCache = {
          user: {
            ...dataFromServer?.user,
            rooms: newRoomArray,
          },
        };

        dispatch(setClassesInChatTab(newCache));
      }
    }
  }, [newRoomAdded]);

  useEffect(() => {
    //Reset rooms when user is removed
    if (removedRoom) {
      var newRoomArray = [];

      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name !== removedRoom.room) {
          newRoomArray.push(dataFromServer?.user.rooms[i]);
        }
      }

      const newCache = {
        user: {
          ...dataFromServer?.user,
          rooms: newRoomArray,
        },
      };

      dispatch(setClassesInChatTab(newCache));
      dispatch(setDeletedRoom(true));
    }
  }, [removedRoom]);

  // useEffect(() => {
  //   if (newMessage !== null) {
  //     var newRoomArray = [];

  //     for (var i = 0; i < dataFromServer.user.rooms.length; i++) {
  //       if (dataFromServer.user.rooms[i].name === newMessage.room.name) {
  //         newRoomArray.push({
  //           ...dataFromServer.user.rooms[i],
  //           messages: [newMessage, ...dataFromServer.user.rooms[i].messages],
  //         });
  //       } else {
  //         newRoomArray.push(dataFromServer.user.rooms[i]);
  //       }
  //     }

  //     const newCache = {
  //       user: {
  //         ...dataFromServer.user,
  //         rooms: newRoomArray,
  //       },
  //     };

  //     setDataFromServer(newCache)
  //   }
  // }, [newMessage]);
  //Methods
  useEffect(() => {
    if (usersSeenMessage) {
      const roomsWithSeenMessage = [];

      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        var newMessages = [];
        if (dataFromServer?.user.rooms[i].name === usersSeenMessage.room.name) {
          for (
            var j = 0;
            j < dataFromServer?.user.rooms[i].messages.length;
            j++
          ) {
            if (
              dataFromServer?.user.rooms[i].messages[j]._id ===
              usersSeenMessage._id
            ) {
              newMessages.push({
                ...dataFromServer?.user.rooms[i].messages[j],
                usersSeenMessage: usersSeenMessage.usersSeenMessage,
              });
            } else {
              newMessages.push(dataFromServer?.user.rooms[i].messages[j]);
            }
          }

          roomsWithSeenMessage.push({
            ...dataFromServer?.user.rooms[i],
            messages: newMessages,
          });
        } else {
          roomsWithSeenMessage.push(dataFromServer?.user.rooms[i]);
        }
      }

      const newUserData = {
        user: {
          ...dataFromServer?.user,
          rooms: roomsWithSeenMessage,
        },
      };

      dispatch(setSeenMessage());
      dispatch(setClassesInChatTab(newUserData));
    }
  }, [usersSeenMessage]);

  useEffect(() => {
    if (seenRooms) {
      const newUserData = {
        user: {
          ...dataFromServer?.user,
          seenRooms,
        },
      };

      dispatch(setSeenRooms());
      dispatch(setClassesInChatTab(newUserData));
    }
  }, [seenRooms]);

  useEffect(() => {
    if (newRoomAvatarData) {
      var avatarRoom = newRoomAvatarData;

      var newRooms = [];
      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name === avatarRoom.room) {
          const newRoomWithNewAvatar = {
            ...dataFromServer?.user.rooms[i],
            avatar: avatarRoom.url,
          };

          newRooms.push(newRoomWithNewAvatar);
        } else {
          newRooms.push(dataFromServer?.user.rooms[i]);
        }
      }

      const classes = {
        user: {
          ...dataFromServer?.user,
          rooms: newRooms,
        },
      };

      dispatch(setClassesInChatTab(classes));
    }
  }, [newRoomAvatarData]);

  useEffect(() => {
    if (newEvent) {
      var data = newEvent;

      var newRooms = [];
      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name === data.name) {
          const newRoomWithNewEvent = {
            ...dataFromServer?.user.rooms[i],
            event: data.event,
          };

          newRooms.push(newRoomWithNewEvent);
        } else {
          newRooms.push(dataFromServer?.user.rooms[i]);
        }
      }

      const classes = {
        user: {
          ...dataFromServer?.user,
          rooms: newRooms,
        },
      };

      dispatch(setClassesInChatTab(classes));
      setNewEvent();
    }
  }, [newEvent]);

  useEffect(() => {
    if (newRoomNameData) {
      var data = newRoomNameData;

      var newRooms = [];
      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name === data.oldName) {
          const newRoomWithNewAvatar = {
            ...dataFromServer?.user.rooms[i],
            name: data.name,
          };

          newRooms.push(newRoomWithNewAvatar);
        } else {
          newRooms.push(dataFromServer?.user.rooms[i]);
        }
      }

      const classes = {
        user: {
          ...dataFromServer?.user,
          rooms: newRooms,
        },
      };

      dispatch(setClassesInChatTab(classes));
    }
  }, [newRoomNameData]);

  useEffect(() => {
    if (avatarRoom) {
      var newRooms = [];
      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        if (dataFromServer?.user.rooms[i].name === avatarRoom.room) {
          const newRoomWithNewAvatar = {
            ...dataFromServer?.user.rooms[i],
            avatar: avatarRoom.url,
          };

          newRooms.push(newRoomWithNewAvatar);
        } else {
          newRooms.push(dataFromServer?.user.rooms[i]);
        }
      }

      const classes = {
        user: {
          ...dataFromServer?.user,
          rooms: newRooms,
        },
      };

      dispatch(setClassesInChatTab(classes));
      setTimeout(() => {
        dispatch(updateRoomAvatar());
      }, 500);
    }
  }, [avatarRoom]);

  // Set data from api to redux
  useEffect(() => {
    dispatch(setLoading(loading));

    if (!loading && data && !classesInChatTab) {
      var newRoomArray = [];
      var formatedData;

      if (data.user.rooms) {
        for (let index = 0; index < data.user.rooms.length; index++) {
          const element = data.user.rooms[index];
          if (element && element?.newestMessage) {
            newRoomArray.push({
              ...element,
              messages: [element.newestMessage],
            });
          } else {
            newRoomArray.push({
              ...element,
              messages: [],
            });
          }
        }
        formatedData = {
          _id: data.user._id,
          classes: data.user.classes,
          seenRooms: data.user.seenRooms,
          rooms: newRoomArray,
        };
      } else {
        formatedData = {
          _id: data.user._id,
          classes: data.user.classes,
          seenRooms: data.user.seenRooms,
          rooms: [],
        };
      }

      dispatch(setClassesInChatTab({ user: formatedData }));
    }
  }, [loading]);

  useEffect(() => {
    if (classShowCollapse) {
      if (!getRoomsInClass.loading && getRoomsInClass.data) {
        var data = getRoomsInClass.data;
        var newRoomArray = [];

        if (data.user.rooms) {
          for (let index = 0; index < data.user.rooms.length; index++) {
            const element = data.user.rooms[index];
            if (element && element?.newestMessage) {
              newRoomArray.push({
                ...element,
                messages: [element.newestMessage],
              });
            } else {
              newRoomArray.push({
                ...element,
                messages: [],
              });
            }
          }

          const formatedData = {
            _id: dataFromServer.user._id,
            classes: dataFromServer.user.classes,
            seenRooms: dataFromServer.user.seenRooms,
            rooms: newRoomArray,
            initialRooms: data.user.rooms,
          };

          dispatch(setClassesInChatTab({ user: formatedData }));
          dispatch(setClassShowCollapse());
        }
      }
    } else if (moreRooms) {
      dispatch(setLoading(getRoomsInClass.loading));

      if (!getRoomsInClass.loading && getRoomsInClass.data) {
        var data = getRoomsInClass.data;
        var newRoomArray = [];

        if (data.user.rooms) {
          for (let index = 0; index < data.user.rooms.length; index++) {
            const element = data.user.rooms[index];
            if (element) {
              if (element.newestMessage) {
                newRoomArray.push({
                  ...element,
                  messages: [element.newestMessage],
                });
              } else {
                newRoomArray.push({
                  ...element,
                  messages: [],
                });
              }
            } else {
              break;
            }
          }

          var formatedData;

          if (newRoomArray.length > 0) {
            formatedData = {
              _id: dataFromServer.user._id,
              classes: dataFromServer.user.classes,
              seenRooms: dataFromServer.user.seenRooms,
              rooms: [...dataFromServer.user.rooms, ...newRoomArray],
              newGroups: getRoomsInClass.data.user.rooms,
              initialRooms: data.user.rooms,
            };
          } else {
            formatedData = {
              ...dataFromServer.user,
              newGroups: [],
              initialRooms: data.user.rooms,
            };
          }
          dispatch(setClassesInChatTab({ user: formatedData }));
          dispatch(setMoreRooms());
        }
      }
    }
  }, [getRoomsInClass.loading]);

  useEffect(() => {
    if (moreRooms) {
      getRoomsInClass.fetchMore({
        variables: {
          email: email,
          className: moreRooms.className,
          offset: moreRooms.offset,
          limit: 4,
        },
      });
    }
  }, [moreRooms]);

  useEffect(() => {
    if (classShowCollapse) {
      getRoomsInClass.fetchMore({
        variables: { email: email, className: classShowCollapse, limit: 4 },
      });
    }
  }, [classShowCollapse]);

  useEffect(() => {
    if (classesInChatTab) {
      setDataFromServer(classesInChatTab);
    }
  }, [classesInChatTab]);

  useEffect(() => {
    //Rearrange data
    if (dataFromServer) {
      var classes = [];

      for (var i = 0; i < dataFromServer?.user.classes.length; i++) {
        classes.push({
          name: dataFromServer?.user.classes[i].name,
          rooms: [],
        });
      }

      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        for (var j = 0; j < classes.length; j++) {
          if (
            dataFromServer?.user.rooms[i].rootRoom?.name === classes[j]?.name
          ) {
            classes[j].rooms.push({
              ...dataFromServer?.user.rooms[i],
            });
            break;
          }
        }
      }

      //Check room is seen or not in each class
      for (var i = 0; i < classes.length; i++) {
        for (var j = 0; j < classes[i].rooms.length; j++) {
          if (
            dataFromServer?.user.seenRooms?.indexOf(
              classes[i].rooms[j]?.name
            ) !== -1
          ) {
            classes[i].rooms[j].seen = true;
          } else {
            classes[i].rooms[j].seen = false;
          }

          //Check message is seen or not in each room
          for (var k = 0; k < classes[i].rooms[j].messages.length; k++) {
            if (
              classes[i].rooms[j].messages[k].usersSeenMessage?.indexOf(
                email
              ) === -1
            ) {
              if (!classes[i].rooms[j].unreadMessages) {
                classes[i].rooms[j].unreadMessages = 1;
              }

              if (classes[i].unreadMessages) {
                classes[i].unreadMessages += 1;
              } else {
                classes[i].unreadMessages = 1;
              }
            }
          }
        }
      }

      //Check message is seen or not in each room

      //Sort rooms depended on newest message
      for (var i = 0; i < classes.length; i++) {
        var roomsHaveMessage = [];
        var roomsNoMessage = [];

        for (var j = 0; j < classes[i].rooms.length; j++) {
          if (classes[i].rooms[j].messages.length === 0) {
            roomsNoMessage.push(classes[i].rooms[j]);
          } else {
            roomsHaveMessage.push(classes[i].rooms[j]);
          }
        }

        roomsHaveMessage.sort((firstRoom, secondRoom) =>
          firstRoom.messages[0]._id < secondRoom.messages[0]._id ? 1 : -1
        );

        roomsNoMessage.sort((firstRoom, secondRoom) =>
          firstRoom.createdAt < secondRoom.createdAt ? 1 : -1
        );

        classes[i].rooms = roomsHaveMessage.concat(roomsNoMessage);
      }

      //Get file for profile tab
      const files = [];

      for (var i = 0; i < dataFromServer?.user.rooms.length; i++) {
        for (
          var j = 0;
          j < dataFromServer?.user.rooms[i]?.messages.length;
          j++
        ) {
          if (
            dataFromServer?.user.rooms[i].messages[j].url &&
            dataFromServer?.user.rooms[i].messages[j].url !== "" &&
            dataFromServer?.user.rooms[i].messages[j].user.email === email
          ) {
            files.push({
              filename: dataFromServer?.user.rooms[i].messages[j].filename,
              type: dataFromServer?.user.rooms[i].messages[j].type,
              url: dataFromServer?.user.rooms[i].messages[j].url,
              size: dataFromServer?.user.rooms[i].messages[j].size
                ? dataFromServer?.user.rooms[i].messages[j].size
                : 0,
            });
          }
        }
      }
      dispatch(setFilesProfileTab(files));
      dispatch(setUpdateListRoom(true));
      dispatch(setClassesInChatTab(classes));
      setClasses(classes);
    }
  }, [dataFromServer]);

  const handleSearch = (e) => {
    dispatch(setSearchData(e.target.value.trim()));
  };

  return (
    <div className="tab_content">
      <div className="tab_content_header chat">
        <h4>Chats</h4>
      </div>
      <div className="search_chat_tab">
        <div className="search">
          <div className="icon_search">
            <img src={search_icon} />
          </div>
          <input
            className="form_search"
            onChange={handleSearch}
            placeholder="Search room"
          />
        </div>
      </div>

      <div className="list_groups">
        <h5 className="brief_title">Recent</h5>
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
                      {classes &&
                        classes.map((classObj, index) => {
                          return (
                            <div key={index}>
                              <ChatDropDown
                                className={classObj.name}
                                groups={classObj.rooms}
                                openChatContent={openChatContent}
                                index={index}
                                unreadMessages={classObj.unreadMessages}
                                seenRooms={dataFromServer?.user.seenRooms}
                                newGroups={dataFromServer?.user.newGroups}
                                newRoomNameData={newRoomNameData}
                                initialRooms={dataFromServer?.user.initialRooms}
                              />
                            </div>
                          );
                        })}
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

export default ChatTab;
