import React, { useState, useEffect } from "react";
//Library
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError, notifySuccess } from "../../../utils/toast";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/actions/dataAction";
//Const
import {
  ADD_USER_SUCCESS,
  FIELD_REQUIRED,
  UPDATE_ROOM_SUCCESS,
} from "../../../const/string";

const ADD_USERS_TO_ROOM = gql`
  mutation($name: String!, $rootRoom: String!, $users: [String!]!) {
    addUsersToRoom(name: $name, rootRoom: $rootRoom, users: $users) {
      _id
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation(
    $room: String!
    $name: String!
    $avatar: String
    $description: String!
    $event: String
  ) {
    updateRoom(
      room: $room
      name: $name
      avatar: $avatar
      description: $description
      event: $event
    ) {
      name
      event
    }
  }
`;

const CREATE_MESSAGE = gql`
  mutation($content: String!, $room: String!) {
    createMessage(content: $content, room: $room) {
      _id
      content
      createdAt
    }
  }
`;

const Update = ({ object, roomDetails, usersOutRoom, closeModal }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  //Apollo mutation
  const [addUsersToRoom, addUsersToRoomProps] = useMutation(ADD_USERS_TO_ROOM, {
    onCompleted(data) {
      notifySuccess(ADD_USER_SUCCESS);

      closeModal();
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [updateRoom, updateRoomProps] = useMutation(UPDATE_ROOM, {
    onCompleted(data) {
      notifySuccess(UPDATE_ROOM_SUCCESS);

      if (object === "room") {
        setTimeout(() => {
          createMessage({
            variables: {
              room: data.updateRoom.name,
              content: `I change the room name to ${data.updateRoom.name.split("|")[0]}`,
            },
          });
        }, 1000);
      }

      closeModal();
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [createMessage, createMessageProps] = useMutation(CREATE_MESSAGE, {
    onError(err) {
      notifyError(err.message);
    },
  });
  //Variables
  const [date, setDate] = useState(new Date());
  //Methods
  useEffect(() => {
    dispatch(setLoading(addUsersToRoomProps.loading));
  }, [addUsersToRoomProps.loading]);

  useEffect(() => {
    dispatch(setLoading(updateRoomProps.loading));
  }, [updateRoomProps.loading]);

  const handleAddUser = (e) => {
    e.preventDefault();

    const list_students = document
      .getElementsByClassName("list_students")[0]
      .value.trim();

    if (usersOutRoom) {
      const newUsers = [];

      var arrayUsersInput = list_students.split(" ");

      //Filter to get unique email
      for (var i = 0; i < arrayUsersInput.length; i++) {
        if (newUsers.indexOf(arrayUsersInput[i]) === -1) {
          newUsers.push(arrayUsersInput[i]);
        }
      }

      //Update
      addUsersToRoom({
        variables: {
          name: roomDetails.name,
          rootRoom: roomDetails.rootRoom.name,
          users: newUsers,
        },
      });
    } else {
      notifyError(FIELD_REQUIRED);
    }
  };

  const handleKeyPressListEmail = (e) => {
    //Prevent all key from inputting in field, except of space
    if (e.key !== " ") {
      e.preventDefault();
    }
  };

  const handleSetName = (e) => {
    const input_room_name = document.getElementById("set_name_room");

    updateRoom({
      variables: {
        room: roomDetails.name,
        name: input_room_name.value + "|" + roomDetails.rootRoom.name,
        avatar: "",
        description: "",
      },
    });
  };

  const handleSetEvent = (e) => {
    const set_name_event = document.getElementById("set_name_event");

    const data = set_name_event.value + "-" + date.toUTCString();

    updateRoom({
      variables: {
        room: roomDetails.name,
        name: "",
        avatar: "",
        description: "",
        event: data,
      },
    });
  };

  const handleKeyPressName = (e) => {
    if (e.key === "|") {
      e.preventDefault();
    }
  };

  if (object === "user") {
    return (
      <div className="update_container">
        <form
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        >
          <div className="group_members">
            <label htmlFor="group_members">Available student list</label>
            <TextInput
              placeholder="Type space to show list"
              trigger=" "
              options={usersOutRoom && usersOutRoom}
              className="list_students"
              spacer=""
              id="group_members"
              onKeyPress={handleKeyPressListEmail}
              maxOptions={usersOutRoom.length}
            />
          </div>
          <button type="button" onClick={handleAddUser}>
            Add
          </button>
        </form>
      </div>
    );
  } else if (object === "room") {
    return (
      <div className="update_container">
        <form
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        >
          <div className="group_set_name">
            <label htmlFor="group_set_name">New name</label>
            <input
              type="text"
              placeholder={roomDetails.name.split("|")[0]}
              id="set_name_room"
              onKeyPress={handleKeyPressName}
            />
          </div>
          <button type="button" onClick={handleSetName}>
            Update
          </button>
        </form>
      </div>
    );
  } else if (object === "event") {
    return (
      <div className="update_container">
        <form
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
        >
          <div className="group_set_name">
            <label htmlFor="group_set_name">Event</label>
            <input
              type="text"
              placeholder={
                roomDetails.event
                  ? roomDetails.event.split("-")[0]
                  : "Event name"
              }
              id="set_name_event"
            />
          </div>
          <div className="group_set_time">
            <label htmlFor="group_set_time">Date Time</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              showTimeSelect
              dateFormat="Pp"
            />
          </div>
          <button type="button" onClick={handleSetEvent}>
            Update
          </button>
        </form>
      </div>
    );
  }
};

export default Update;
