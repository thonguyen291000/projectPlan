import React, { useEffect, useState } from "react";
//Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError, notifySuccess } from "../../../utils/toast";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setDeletedUser,
  setDeletedRoom,
  setRoomDetailChatTab,
} from "../../../redux/actions/dataAction";
//Const
import {
  DELETE_USER_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
} from "../../../const/string";

const DELETE_ROOM = gql`
  mutation($name: String!, $whoDeleted: String!) {
    deleteRoom(name: $name, whoDeleted: $whoDeleted)
  }
`;

const REMOVE_USERS_FROM_ROOM = gql`
  mutation($room: String!, $users: [String!]!) {
    removeUsersFromRoom(room: $room, users: $users) {
      users {
        _id
        email
        avatar
      }
    }
  }
`;

const DELETE_MESSAGE = gql`
  mutation($message: ID!) {
    deleteMessage(message: $message)
  }
`;

const Delete = ({ deleteData, closeModal }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  //Apollo
  const [deleteRoom, deleteRoomProps] = useMutation(DELETE_ROOM, {
    onCompleted(data) {
      notifySuccess(data.deleteRoom);

      dispatch(setDeletedRoom(deleteData.name));

      dispatch(setRoomDetailChatTab(deleteData.name, null));

      closeModal();
    },
    onError(err) {
      console.log(err);
      notifyError(err.message);
    },
  });

  const [removeUsersFromRoom, removeUsersFromRoomProps] = useMutation(
    REMOVE_USERS_FROM_ROOM,
    {
      onCompleted(data) {
        notifySuccess(DELETE_USER_SUCCESS);

        dispatch(
          setDeletedUser({
            room: deleteData.room,
            users: data.removeUsersFromRoom.users,
          })
        );

        closeModal();
      },
      onError(err) {
        console.log(err);
        notifyError(err.message);
      },
    }
  );

  const [deleteMessage, deleteMessageProps] = useMutation(DELETE_MESSAGE, {
    onCompleted(data) {
      notifySuccess(DELETE_MESSAGE_SUCCESS);

      closeModal();
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  //Methods
  useEffect(() => {
    dispatch(setLoading(deleteMessageProps.loading));
  }, [deleteMessageProps.loading]);

  useEffect(() => {
    dispatch(setLoading(deleteRoomProps.loading));
  }, [deleteRoomProps.loading]);

  useEffect(() => {
    dispatch(setLoading(removeUsersFromRoomProps.loading));
  }, [removeUsersFromRoomProps.loading]);

  const handleYes = (e) => {
    e.preventDefault();
    if (deleteData.target === "room") {
      deleteRoom({ variables: { name: deleteData.name, whoDeleted: email } });
    } else if (deleteData.target === "message") {
      deleteMessage({ variables: { message: deleteData.messageId } });
    } else {
      removeUsersFromRoom({
        variables: {
          room: deleteData.room,
          users: deleteData.users,
        },
      });
    }
  };

  const handleNo = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div>
      <div className="button_group">
        <button type="button" className="btn_yes" onClick={handleYes}>
          Yes
        </button>
        <button type="button" className="btn_no" onClick={handleNo}>
          No
        </button>
      </div>
    </div>
  );
};

export default Delete;
