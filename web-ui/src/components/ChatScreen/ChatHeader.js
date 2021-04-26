import React, { useEffect, useState } from "react";
//Library
import ReactTooltip from "react-tooltip";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
//Images
import user_avatar from "../../assets/imgs/user_avatar.jpg";
//Icons
import online from "../../assets/icons/online.png";
import phone from "../../assets/icons/phone.png";
import video_call from "../../assets/icons/video_call.png";
import back from "../../assets/icons/back.png";
import event from "../../assets/icons/event_header.png";
import avatar_skeleton from "../../assets/icons/avatar_skeleton.png";
//Components
import CallVideo from "../CallRealTime/CallVideo";
import VoiceCall from "../CallRealTime/VoiceCall";
//Redux
import { useSelector } from "react-redux";

const ChatHeader = ({ openSlidebar, closeChatContent, roomDetails }) => {
  //Redux
  const callVideoState = useSelector((state) => state.data.callVideoState);
  //Variables
  const [isCallingVideo, setIsCallingVideo] = useState(false);
  //Methods
  useEffect(() => {
    if (roomDetails && callVideoState.length > 0) {
      const thatRoom = callVideoState.filter(
        (item) => item.room === roomDetails.name
      );

      if (thatRoom.length > 0) {
        setIsCallingVideo({
          type: thatRoom[0].type,
          state: thatRoom[0].callState,
        });
      }
    }
  }, [callVideoState]);

  const skeleton = () => {
    return (
      <>
        <div className="avatar skeleton">
          <img src={avatar_skeleton} />
        </div>
        <div className="name skeleton">
          <h5>
            <a href="#" className="skeleton">
              Nguyen Tho
            </a>
            <img src={avatar_skeleton} className="status_icon" />
          </h5>
        </div>
      </>
    );
  };

  return (
    <div className="header_session">
      <ReactTooltip />
      <div>
        <div className="group_avatar">
          <div className="wrapper">
            <div className="back">
              <a onClick={closeChatContent}>
                <img src={back} />
              </a>
            </div>
            {roomDetails ? (
              <>
                <div className="avatar">
                  <img src={roomDetails.avatar} />
                </div>
                <div className="name">
                  <h5>
                    <a href="#" onClick={openSlidebar}>
                      {roomDetails.name.split("|")[0]}
                    </a>
                    <img src={online} className="status_icon" />
                  </h5>
                </div>
              </>
            ) : (
              skeleton()
            )}
          </div>
          {roomDetails?.event &&
            new Date(roomDetails.event.split("-")[1]).getTime() >
              new Date().getTime() && (
              <div className="event_wrapper" data-tip="Event">
                <div className="event_icon">
                  <img src={event} />
                </div>
                <div className="event_content">
                  {roomDetails.event.split("-")[0]} -{" "}
                  {new Date(roomDetails.event.split("-")[1]).toLocaleString(
                    "en-US"
                  )}
                </div>
              </div>
            )}
        </div>
        <div className="action">
          <ul>
            <li>
              {!roomDetails ? (
                <button data-tip="Voice call" disabled>
                  <img src={phone} />
                </button>
              ) : (
                <>
                  {isCallingVideo.type === "video" && isCallingVideo.state ? (
                    <button data-tip="Voice call" disabled>
                      <img src={phone} />
                    </button>
                  ) : (
                    <Popup
                      trigger={
                        <button data-tip="Voice call">
                          <img src={phone} />
                          {isCallingVideo.type === "voice" &&
                            isCallingVideo.state && (
                              <img src={online} className="status_icon" />
                            )}
                        </button>
                      }
                      position="right center"
                      modal
                      nested
                    >
                      {(close) => (
                        <CallVideo
                          roomName={roomDetails.name}
                          close={close}
                          type="voice"
                        />
                      )}
                    </Popup>
                  )}
                </>
              )}
            </li>
            <li>
              {!roomDetails ? (
                <button data-tip="Video call" disabled>
                  <img src={video_call} />
                </button>
              ) : (
                <>
                  {isCallingVideo.type === "voice" && isCallingVideo.state ? (
                    <button data-tip="Video call" disabled>
                      <img src={video_call} />
                    </button>
                  ) : (
                    <Popup
                      trigger={
                        <button data-tip="Video call">
                          <img src={video_call} />
                          {isCallingVideo.type === "video" &&
                            isCallingVideo.state && (
                              <img src={online} className="status_icon" />
                            )}
                        </button>
                      }
                      position="right center"
                      modal
                      nested
                    >
                      {(close) => (
                        <CallVideo
                          roomName={roomDetails.name}
                          close={close}
                          type="video"
                        />
                      )}
                    </Popup>
                  )}
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
