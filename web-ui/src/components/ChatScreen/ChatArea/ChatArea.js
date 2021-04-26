import React, { useEffect, useRef, useState } from "react";
//Components
import Message from "./Message";
import MessageSkeleton from "./MessageSkeleton";
//Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setCallVideo,
  setMoreMessages,
} from "../../../redux/actions/dataAction";
//Logic
import { getDate, getHourAndMinute } from "../../../funcs/formatDate";
//Const
import {
  CALLING_VIDEO,
  STOP_CALL_VIDEO,
  CALLING_VOICE,
  STOP_CALL_VOICE,
} from "../../../const/string";

const ChatArea = ({ roomDetails }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  // useRef
  const messagesEndRef = useRef(null);
  //Variables
  const [messages, setMessages] = useState();

  //Methods

  // useEffect(() => {
  //   // Auto scroll to end message
  //   console.log(roomDetails.newMessages);
  //   if (messagesEndRef && !roomDetails.newMessages) {
  //     messagesEndRef.current.addEventListener("DOMNodeInserted", (event) => {
  //       const { currentTarget: target } = event;
  //       target.scroll({ top: target.scrollHeight, behavior: "smooth" });
  //     });

  //     setTimeout(() => {
  //       messagesEndRef.current.removeEventListener("DOMNodeInserted", () => {});
  //     }, 300);
  //   }
  // }, [messagesEndRef]);

  useEffect(() => {
    //Sort reverse messages
    if (roomDetails) {
      if (roomDetails.messages.length > 1) {
        var reverseMessages = [];
        for (var i = roomDetails.messages.length - 1; i >= 0; i--) {
          reverseMessages.push(roomDetails.messages[i]);
        }

        //Check message relating to call video
        if (
          reverseMessages[reverseMessages.length - 1].content === CALLING_VIDEO
        ) {
          dispatch(
            setCallVideo({
              room: roomDetails.name,
              callState: true,
              type: "video",
            })
          );
        }

        if (
          reverseMessages[reverseMessages.length - 1].content ===
          STOP_CALL_VIDEO
        ) {
          dispatch(
            setCallVideo({
              room: roomDetails.name,
              callState: false,
              type: "video",
            })
          );
        }

        //Check message relating to call voice
        if (
          reverseMessages[reverseMessages.length - 1].content === CALLING_VOICE
        ) {
          dispatch(
            setCallVideo({
              room: roomDetails.name,
              callState: true,
              type: "voice",
            })
          );
        }

        if (
          reverseMessages[reverseMessages.length - 1].content ===
          STOP_CALL_VOICE
        ) {
          dispatch(
            setCallVideo({
              room: roomDetails.name,
              callState: false,
              type: "voice",
            })
          );
        }

        setMessages(reverseMessages);
      } else {
        setMessages(roomDetails.messages);
      }
    }
  }, [roomDetails]);

  const handleViewMore = (e) => {
    e.preventDefault();

    var offset;

    if (roomDetails.newMessages?.length > 0) {
      offset = roomDetails.newMessages[roomDetails.newMessages.length - 1]._id;
    } else {
      offset = messages[0]._id;
    }

    dispatch(
      setMoreMessages({
        offset,
      })
    );
  };

  return (
    <div className="chat_area_container">
      <div className="wrapper">
        <div className="height_auto_wrapper">
          <div className="height_auto"></div>
        </div>
        <div className="chat_area" ref={messagesEndRef}>
          <div className="offset">
            <div className="content_wrapper">
              <div className="content">
                <ul className="list_conversation">
                  {roomDetails ? (
                    <>
                      {roomDetails?.getAllMessages === "false" && (
                        <li className="btn_view_more">
                          <hr />
                          <button type="button" onClick={handleViewMore}>
                            View more
                          </button>
                        </li>
                      )}
                      {messages && messages.map((message, index) => (
                        <li
                          key={index}
                          className={
                            message.user.email !== email ? "right" : ""
                          }
                        >
                          <Message
                            position={
                              message.user.email !== email ? "right" : "left"
                            }
                            content={message.content}
                            time={getHourAndMinute(message.createdAt)}
                            date={getDate(message.createdAt)}
                            type={message.type}
                            filename={message.filename}
                            user={message.user.email}
                            userAvatar={message.user.avatar}
                            fileUrl={message.url}
                            size={message.size}
                            messageId={message._id}
                            replyToMessage={message.replyToMessage}
                            reacts={message.reacts}
                          />
                        </li>
                      ))}
                    </>
                  ) : (
                    [1, 2, 3, 4, 5].map((item, index) => (
                      <li key={index} className={item % 2 === 0 ? "right" : ""}>
                        <MessageSkeleton
                          position={item % 2 === 0 ? "right" : "left"}
                        />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
