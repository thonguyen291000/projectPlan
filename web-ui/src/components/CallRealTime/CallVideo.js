import React, { useEffect, useState } from "react";
//Apollo
import { gql, useMutation, useSubscription } from "@apollo/client";
//Library
import Peer from "peerjs";
//Const
import {
  CALLING_VIDEO,
  STOP_CALL_VIDEO,
  CALLING_VOICE,
  STOP_CALL_VOICE,
} from "../../const/string";
//Toast
import { notifyError } from "../../utils/toast";
//Redux
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUpdateListRoom } from "../../redux/actions/dataAction";

const USER_JOIN_ROOM = gql`
  mutation($room: String, $userId: String) {
    userJoinRoom(room: $room, userId: $userId)
  }
`;

const USER_OUT_ROOM = gql`
  mutation($room: String, $userId: String) {
    userOutRoom(room: $room, userId: $userId)
  }
`;

const JOIN_ROOM = gql`
  subscription {
    joinRoom {
      room
      userId
    }
  }
`;
const OUT_ROOM = gql`
  subscription {
    outRoom {
      room
      userId
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

var peers = {};
var numberUser = [];

const myVideo = document.createElement("video");
myVideo.controls = true;
myVideo.id = "own";

const CallVideo = ({ roomName, close, type }) => {
  //Redux
  const dispatch = useDispatch();
  const callVideoState = useSelector((state) => state.data.callVideoState);
  //Apollo
  const [createMessage, createMessageProps] = useMutation(CREATE_MESSAGE, {
    onError(err) {
      close();
      notifyError(err.message);
    },
  });

  const [userJoinRoom, props] = useMutation(USER_JOIN_ROOM, {
    onCompleted() {
      if (
        typeof callVideoState === "object" &&
        callVideoState.length !== undefined
      ) {
        if (callVideoState.length > 0) {
          const roomIsCalling = callVideoState.filter(
            (item) => item.room === roomName
          );

          //Check whether that user is operating the call video
          if (roomIsCalling.length === 0 || !roomIsCalling[0].callState) {
            console.log("whether grid");
            createMessage({
              variables: {
                room: roomName,
                content: type === "voice" ? CALLING_VOICE : CALLING_VIDEO,
              },
            });
            dispatch(setUpdateListRoom(true));
          }
        } else {
          console.log("operating grid");
          createMessage({
            variables: {
              room: roomName,
              content: type === "voice" ? CALLING_VOICE : CALLING_VIDEO,
            },
          });
          dispatch(setUpdateListRoom(true));
        }
      }
    },
    onError(err) {
      console.log(err.message);
    },
  });
  const [userOutRoom, props1] = useMutation(USER_OUT_ROOM, {
    onError(err) {
      console.log(err.message);
    },
  });

  useSubscription(JOIN_ROOM, {
    onSubscriptionData(data) {
      console.log("user join room", data);
      if (stream) {
        const id = data.subscriptionData.data.joinRoom.userId;

        // localStorage.setItem("lastUser", true);
        connectToNewUser(id, stream);
      }
    },
  });

  useSubscription(OUT_ROOM, {
    onSubscriptionData(data) {
      try {
        const userId = data.subscriptionData.data.outRoom.userId;
        console.log("User out room", userId);

        numberUser.shift();

        if (peers[userId]) peers[userId].close();
        calUsersJoin();
      } catch (error) {
        console.log(error);
      }
    },
  });
  //Variables
  const [stream, setStream] = useState();
  const [myPeer, setMyPeer] = useState();
  const [numberOfUser, setNumberOfUser] = useState(0);
  //Methods
  useEffect(() => {
    dispatch(setLoading(createMessageProps.loading));
  }, [createMessageProps.loading]);
  console.log(numberUser);
  useEffect(() => {
    var peer = new Peer();
    setMyPeer(peer);

    peers = {};
    numberUser = [];

    dispatch(setUpdateListRoom());

    return () => {
      try {
        const userId = localStorage.getItem("userId");
        // const lastUser = localStorage.getItem("lastUser");

        // if (numberUser.length === 1 || numberUser.length === 0) {
        //   // localStorage.setItem("lastUser", true);
        //   numberUser = [];
        // } else {
        //   numberUser = numberUser.filter((item) => item !== userId);
        // }

        //If no video in grid
        if (numberUser.length === 0 || numberUser.length === 1) {
          console.log("No grid");
          createMessage({
            variables: {
              room: roomName,
              content: type === "voice" ? STOP_CALL_VOICE : STOP_CALL_VIDEO,
            },
          });
          dispatch(setUpdateListRoom(true));
        }

        userOutRoom({ variables: { userId, room: roomName } });
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  useEffect(() => {
    if (myPeer) {
      myPeer.on("open", (id) => {
        userJoinRoom({
          variables: { room: roomName, userId: id },
        });

        localStorage.setItem("userId", id);
      });

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((newStream) => {
          if (myVideo.srcObject !== null) {
            myVideo.srcObject = null;
          }

          if (type === "voice") {
            // Stop only video
            newStream.getVideoTracks()[0].enabled = false;
          } else {
            // Stop video and voice
            myVideo.addEventListener("pause", () => {
              newStream.getTracks().forEach((track) => (track.enabled = false));
            });

            // Continue video and voice
            myVideo.addEventListener("play", () => {
              newStream.getTracks().forEach((track) => (track.enabled = true));
            });
          }

          myVideo.addEventListener("volumechange", (e) => {
            if (!myVideo.muted) {
              newStream
                .getAudioTracks()
                .forEach((track) => (track.enabled = true));
            } else {
              newStream
                .getAudioTracks()
                .forEach((track) => (track.enabled = false));
            }
          });

          addVideoStream(myVideo, newStream);
          calUsersJoin();
          console.log("add my video");

          myPeer.on("call", (call) => {
            console.log("peer on call");
            call.answer(newStream);
            const video = document.createElement("video");
            video.id = call.peer;

            call.on("stream", (userVideoStream) => {
              console.log("on stream on call", userVideoStream);
              // localStorage.setItem("lastUser", false);
              addVideoStream(video, userVideoStream);
              if (numberUser.indexOf(userVideoStream.id) === -1) {
                numberUser.push(userVideoStream.id);
              }
              calUsersJoin();
            });
          });

          setStream(newStream);
        });
    }
  }, [myPeer]);

  const connectToNewUser = (userId, stream) => {
    console.log("call", stream);
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    video.id = userId;
    call.on("stream", (userVideoStream) => {
      console.log("on stream call", userVideoStream);
      addVideoStream(video, userVideoStream);
      if (numberUser.indexOf(userVideoStream.id) === -1) {
        numberUser.push(userVideoStream.id);
      }
      // localStorage.setItem("lastUser", false);
      calUsersJoin();
    });
    call.on("close", () => {
      console.log("close");
      video.remove();
    });

    peers[userId] = call;
  };

  const addVideoStream = (video, stream) => {
    const videoGrid = document.getElementById("video-grid");

    if (video.srcObject === null) {
      const userId = localStorage.getItem("userId");

      if (userId !== video.id) {
        console.log("create video");
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
        videoGrid.append(video);
      }
    }
  };

  const calUsersJoin = () => {
    const videoElements = document.getElementsByTagName("video");

    setNumberOfUser(videoElements.length);
  };

  return (
    <div className="video_container">
      <div className="class_name">{roomName.split("|")[0]}</div>
      <div className="amount">{numberOfUser} Joined</div>
      <div className="stop_call">
        <button onClick={() => close()}>Stop call</button>
      </div>
      <div id="video-grid"></div>
    </div>
  );
};

export default CallVideo;
