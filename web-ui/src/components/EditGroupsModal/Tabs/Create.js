import React, { useEffect, useState } from "react";
//Library
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
//Apollo
import { gql, useQuery, useMutation } from "@apollo/client";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/actions/dataAction";
//Toast
import { notifyError, notifySuccess } from "../../../utils/toast";
//Const
import {
  FIELD_REQUIRED,
  CREATE_ROOM_SUCCESS,
  START_A_NEW_ROOM,
  CREATE_MESSAGE_SUCCESS,
  STUDENT_NOT_SOCIAL_ROOM,
  OWNER_IS_NOT_IN_ROOM,
} from "../../../const/string";
//Logic
import { encode } from "../../../funcs/utf8";

const GET_CLASS = gql`
  query($name: String!) {
    class(name: $name) {
      users {
        email
        role
      }
    }
  }
`;

const UPLOAD_AVATAR = gql`
  mutation($file: Upload!, $idOrEmail: String!, $messageOrUser: String!) {
    uploadFile(
      file: $file
      idOrEmail: $idOrEmail
      messageOrUser: $messageOrUser
    ) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

const CREATE_ROOM = gql`
  mutation(
    $name: String!
    $description: String
    $rootRoom: String!
    $users: [String!]
    $avatar: String
    $whoCreated: String!
  ) {
    createRoom(
      name: $name
      description: $description
      rootRoom: $rootRoom
      users: $users
      avatar: $avatar
      whoCreated: $whoCreated
    ) {
      name
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

const Create = ({ className, closeModal }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const role = useSelector((state) => state.user.info.role);
  //Variables
  const [listStudents, setListStudents] = useState([]);
  const [newRoom, setNewRoom] = useState();
  const [urlAvatar, setUrlAvatar] = useState();
  //Apollo query
  const { loading, error, data } = useQuery(GET_CLASS, {
    variables: { name: className },
  });
  //Apollo mutation
  const [uploadFile, updateAvatarPros] = useMutation(UPLOAD_AVATAR, {
    update(_, res) {},
    onCompleted(data) {
      const avatarUrl = data.uploadFile.url;
      setUrlAvatar(avatarUrl);
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [createMessage, createMessageProps] = useMutation(CREATE_MESSAGE, {
    onCompleted(data) {
      notifySuccess(CREATE_MESSAGE_SUCCESS);
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [createRoom, createRoomPros] = useMutation(CREATE_ROOM, {
    update(_, res) {},
    onCompleted(data) {
      notifySuccess(CREATE_ROOM_SUCCESS);

      createMessage({
        variables: { content: encode(START_A_NEW_ROOM), room: newRoom.name },
      });

      closeModal();
      localStorage.setItem("createRoom", "true");
    },
    onError(err) {
      console.log(err);
      notifyError(err.message);
    },
  });
  //Methods

  useEffect(() => {
    dispatch(setLoading(loading));

    //Set list of student in the class
    if (data) {
      var arrayEmail = [];

      for (var i = 0; i < data.class.users.length; i++) {
        if (
          data.class.users[i].email !== email &&
          data.class.users[i].role !== "staff"
        ) {
          if (data.class.users[i].role === "teacher") {
            arrayEmail.push(data.class.users[i].email + " (Teacher)");
          } else {
            arrayEmail.push(data.class.users[i].email);
          }
        }
      }

      setListStudents(arrayEmail);
    }
  }, [loading]);

  useEffect(() => {
    dispatch(setLoading(updateAvatarPros.loading));
  }, [updateAvatarPros.loading]);

  useEffect(() => {
    dispatch(setLoading(createRoomPros.loading));
  }, [createRoomPros.loading]);

  useEffect(() => {
    //Create room when avatar is uploaded
    if (urlAvatar) {
      createRoom({
        variables: {
          name: newRoom.name,
          description: "",
          rootRoom: className,
          users: newRoom.arrayEmail,
          avatar: urlAvatar,
          whoCreated: newRoom.whoCreated,
        },
      });
    }
  }, [urlAvatar]);

  const handleCreate = (e) => {
    e.preventDefault();

    const list_students = document
      .getElementsByClassName("list_students")[0]
      .value.trim();
    const new_name = document
      .getElementsByClassName("new_name")[0]
      .value.trim();
    const owner = document.getElementById("group_owner").value.trim();

    if (listStudents && new_name && newRoom?.avatar) {
      const userInGroup = [email];

      var arrayUsersInput = list_students.split(" ");

      //Filter to get unique email
      for (var i = 0; i < arrayUsersInput.length; i++) {
        if (userInGroup.indexOf(arrayUsersInput[i]) === -1) {
          userInGroup.push(arrayUsersInput[i]);
        }
      }
      if (role === "student" && userInGroup.length > 2) {
        notifyError(STUDENT_NOT_SOCIAL_ROOM);
      } else {
        if (userInGroup.indexOf(owner) !== -1) {
          setNewRoom({
            ...newRoom,
            name: new_name + "|" + className,
            arrayEmail: userInGroup,
            whoCreated: owner,
          });
          //Upload avatar
          uploadFile({
            variables: {
              file: newRoom.avatar,
              idOrEmail: newRoom.name,
              messageOrUser: "",
            },
          });
        } else {
          notifyError(OWNER_IS_NOT_IN_ROOM);
        }
      }
    } else {
      notifyError(FIELD_REQUIRED);
    }
  };

  const handleAvatar = (e) => {
    setNewRoom({
      avatar: e.target.files[0],
    });
  };

  const handleKeyPressListEmail = (e) => {
    //Prevent all key from inputting in field, except of space
    if (e.key !== " ") {
      e.preventDefault();
    }
  };

  return (
    <div className="create_container">
      <form
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
          }
        }}
      >
        <div className="group_name">
          <label htmlFor="group_name">New group</label>
          <input
            name="group_name"
            type="text"
            placeholder="Your group name"
            className="new_name"
            onKeyPress={(e) => {
              if (e.key === "|") e.preventDefault();
            }}
          />
        </div>
        <div className="group_members">
          <label htmlFor="group_members">Student list</label>
          <TextInput
            placeholder="Type space to show list"
            trigger=" "
            options={listStudents}
            className="list_students"
            spacer=""
            id="group_members"
            onKeyPress={handleKeyPressListEmail}
            maxOptions={listStudents.length}
          />
        </div>
        <div className="group_name">
          <label htmlFor="group_owner">Owner</label>
          <input
            name="group_owner"
            id="group_owner"
            type="text"
            placeholder="Owner email"
            className="new_name"
            defaultValue={email}
            onKeyPress={(e) => {
              if (e.key === "|") e.preventDefault();
            }}
          />
        </div>
        <div className="group_avatar">
          <label htmlFor="avatar">Group avatar</label>
          <input
            type="file"
            accept="image/*"
            id="avatar"
            className="avatar"
            onChange={handleAvatar}
            style={{width: "100%"}}
          />
        </div>
        <button type="button" onClick={handleCreate}>
          Create
        </button>
      </form>
    </div>
  );
};

export default Create;
