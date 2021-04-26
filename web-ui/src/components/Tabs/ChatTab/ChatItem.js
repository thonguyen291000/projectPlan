import React from "react";
//Library
import useSound from "use-sound";
//sound
import ping from "../../../assets/sound/event_ping.mp3";
//Icons
import image from "../../../assets/icons/image.png";
import video from "../../../assets/icons/video.png";
import file from "../../../assets/icons/file.png";
import event from "../../../assets/icons/calendar.png";
//Logic
import { getHourAndMinute } from "../../../funcs/formatDate";
import { decode } from "../../../funcs/utf8";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { setUpdateListRoom } from "../../../redux/actions/dataAction";
//String
import {
  CALLING_VIDEO,
  CALLING_VOICE,
  STOP_CALL_VIDEO,
  STOP_CALL_VOICE,
  EVENT_COMING,
} from "../../../const/string";
//Toast
import { notifyInfo } from "../../../utils/toast";

var flagForNotiEvent = 1;

const ChatItem = ({ item, newRoomNameData, numberGroup }) => {
  //Sound
  const [play] = useSound(ping);
  //Redux
  const dispatch = useDispatch();
  const typing = useSelector((state) => state.data.typing);
  const updateListRoom = useSelector((state) => state.data.updateListRoom);

  //Methods
  React.useEffect(() => {
    if (item && flagForNotiEvent <= numberGroup) {
      if (item.event) {
        if (
          new Date(item.event.split("-")[1]).getTime() >= new Date().getTime()
        ) {
          setTimeout(() => {
            if (updateListRoom) dispatch(setUpdateListRoom());
            setTimeout(() => dispatch(setUpdateListRoom(true)), 100);
            play();
            notifyInfo(EVENT_COMING + " " + item.name);
          }, Math.abs(new Date(item.event.split("-")[1]) - new Date()));
        }
      }

      flagForNotiEvent += 1;
    }
  }, [item?.event]);

  const checkStatus = () => {
    switch (item.status) {
      case "online":
        return <span className="status online"></span>;
      case "offline":
        return <span className="status offline"></span>;
      case "busy":
        return <span className="status busy"></span>;
      default:
        return <span className="status online"></span>;
    }
  };

  const checkTypeMessage = () => {
    const newMessage = item.messages[0];

    if (newMessage) {
      if (typing) {
        if (typing.typing && typing.room === item.name) {
          return (
            <p className="message typing">
              typing
              <span className="typing_animation">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </p>
          );
        } else {
          switch (newMessage.type) {
            case "text":
              switch (decode(newMessage.content)) {
                case CALLING_VIDEO:
                  return (
                    <p className="message">
                      <i className="material-icons">video_call</i>{" "}
                      {decode(newMessage.content)}
                    </p>
                  );
                case CALLING_VOICE:
                  return (
                    <p className="message">
                      <i className="material-icons">mic</i>{" "}
                      {decode(newMessage.content)}
                    </p>
                  );
                case STOP_CALL_VIDEO:
                  return (
                    <p className="message">
                      <i className="material-icons">missed_video_call</i>{" "}
                      {decode(newMessage.content)}
                    </p>
                  );
                case STOP_CALL_VOICE:
                  return (
                    <p className="message">
                      <i className="material-icons">mic_off</i>{" "}
                      {decode(newMessage.content)}
                    </p>
                  );
                default:
                  return (
                    <p className="message"> {decode(newMessage.content)}</p>
                  );
              }
            case "image":
              return (
                <p className="message">
                  <img className="media_icon" src={image} />
                  {newMessage.filename}
                </p>
              );
            case "video":
              return (
                <p className="message">
                  <img className="media_icon" src={video} />
                  {newMessage.filename}
                </p>
              );
            case "file":
              return (
                <p className="message">
                  <img className="media_icon" src={file} />
                  {newMessage.filename}
                </p>
              );
            default:
              return <></>;
          }
        }
      } else {
        switch (newMessage.type) {
          case "text":
            switch (decode(newMessage.content)) {
              case CALLING_VIDEO:
                return (
                  <p className="message">
                    <span className="material-icons">video_call</span>{" "}
                    {decode(newMessage.content)}
                  </p>
                );
              case CALLING_VOICE:
                return (
                  <p className="message">
                    <span className="material-icons">mic</span>{" "}
                    {decode(newMessage.content)}
                  </p>
                );
              case STOP_CALL_VIDEO:
                return (
                  <p className="message">
                    <span className="material-icons">missed_video_call</span>{" "}
                    {decode(newMessage.content)}
                  </p>
                );
              case STOP_CALL_VOICE:
                return (
                  <p className="message">
                    <span className="material-icons">mic_off</span>{" "}
                    {decode(newMessage.content)}
                  </p>
                );
              default:
                return <p className="message"> {decode(newMessage.content)}</p>;
            }
          case "image":
            return (
              <p className="message">
                <img className="media_icon" src={image} />
                {newMessage.filename}
              </p>
            );
          case "video":
            return (
              <p className="message">
                <img className="media_icon" src={video} />
                {newMessage.filename}
              </p>
            );
          case "file":
            return (
              <p className="message">
                <img className="media_icon" src={file} />
                {newMessage.filename}
              </p>
            );
          default:
            return <></>;
        }
      }
    } else return <></>;
  };

  return (
    <a href="#">
      <div className="item">
        <div className="user">
          <img className="user_avatar" src={item.avatar} />
          {checkStatus()}
        </div>
        <div className="body">
          <h5 className="user_name">{item.name.split("|")[0]}</h5>
          {checkTypeMessage()}
        </div>
        <div className="time">
          {item.event &&
            new Date(item.event.split("-")[1]).getTime() >
              new Date().getTime() && (
              <img src={event} width="15px" data-tip="Event" />
            )}
          {item.messages[0] && getHourAndMinute(item.messages[0].createdAt)}
        </div>
        {item.unreadMessages ? (
          <div className="unread_message">
            <span className="badge_unread">
              {item.unreadMessages && "Unread"}
            </span>
          </div>
        ) : (
          <>
            {!item.seen && (
              <div className="unread_message">
                <span className="badge_unread">
                  New {newRoomNameData && "name"}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </a>
  );
};

export default ChatItem;
