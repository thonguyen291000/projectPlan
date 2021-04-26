import React, { useEffect, useState } from "react";
//Apollo
import { gql, useMutation, useSubscription } from "@apollo/client";
//Library
import Peer from "peerjs";

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

const peers = {};
var numberUser = [];

const myVideo = document.createElement("video");
myVideo.controls = true;
myVideo.id = "own";

const VoiceCall = ({ roomName, close }) => {
  //Apollo
  const [userJoinRoom, props] = useMutation(USER_JOIN_ROOM, {
    onError(err) {
      console.log(err.message);
    },
  });
  const [userOutRoom, props1] = useMutation(USER_OUT_ROOM, {
    onCompleted(data) {
      // console.log(data)
      // if (peers[data.userOutRoom.userId]) peers[data.userOutRoom.userId].close();
    },
    onError(err) {
      console.log(err.message);
    },
  });
  const userJoinRoomData = useSubscription(JOIN_ROOM, {
    onSubscriptionData(data) {
      console.log("user join room", data);
      if (stream) {
        connectToNewUser(data.subscriptionData.data.joinRoom.userId, stream);
      }
    },
  });

  const userOutRoomData = useSubscription(OUT_ROOM, {
    onSubscriptionData(data) {
      try {
        const userId = data.subscriptionData.data.outRoom.userId;
        console.log("User out room", userId);
        
        numberUser.shift();

        if (peers[userId]) peers[userId].close();

        calUsersJoin();
      } catch (error) {}
    },
  });
  //Variables
  const [stream, setStream] = useState();
  const [myPeer, setMyPeer] = useState();
  const [numberOfUser, setNumberOfUser] = useState(0);
  //Methods
  useEffect(() => {
    var peer = new Peer();
    setMyPeer(peer);

    return () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("a user out", userId);
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

          // Stop only video
          newStream.getVideoTracks.forEach((track) => (track.enabled = false));

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
  }, myPeer);

  const connectToNewUser = (userId, stream) => {
    console.log("call", stream);
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    video.id = userId;
    call.on("stream", (userVideoStream) => {
      console.log("on stream call");
      addVideoStream(video, userVideoStream);
      if (numberUser.indexOf(userVideoStream.id) === -1) {
        numberUser.push(userVideoStream.id);
      }
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

  const hasAudio = (video) => {
    return (
      video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks && video.audioTracks.length)
    );
  };

  return (
    <div className="video_container">
      <div className="class_name">{roomName}</div>
      <div className="amount">{numberOfUser} Joined</div>
      <div className="stop_call">
        <button onClick={() => close()}>Stop call</button>
      </div>
      <div id="video-grid"></div>
    </div>
  );
};

export default VoiceCall;
