import React, { useEffect, useState } from "react";
//Library
import ReactTooltip from "react-tooltip";
import Picker from "emoji-picker-react";
import useOnclickOutside from "react-cool-onclickoutside";
import ReactGiphySearchbox from "react-giphy-searchbox";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
//Logic
import { encode } from "../../funcs/utf8";
//Icons
import plane from "../../assets/icons/plane.png";
import image_purple from "../../assets/icons/image_purple.png";
import attach_purple from "../../assets/icons/attach_purple.png";
import smile from "../../assets/icons/smile.png";
import gif from "../../assets/icons/gif.png";
import closeIcon from "../../assets/icons/close_icon.png";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setReplyToMessage,
  setTypingData,
} from "../../redux/actions/dataAction";
//Apollo
import { gql, useMutation, useSubscription } from "@apollo/client";
//Toast
import { notifyError } from "../../utils/toast";

const CREATE_MESSAGE = gql`
  mutation($content: String!, $room: String!, $replyToMessage: String) {
    createMessage(
      content: $content
      room: $room
      replyToMessage: $replyToMessage
    ) {
      _id
      content
      createdAt
    }
  }
`;

const SET_TYPING = gql`
  mutation($room: String!, $user: String!, $typing: Boolean!) {
    setTyping(room: $room, user: $user, typing: $typing)
  }
`;

const UPLOAD_FILE = gql`
  mutation(
    $file: Upload
    $idOrEmail: String!
    $messageOrUser: String!
    $room: String
    $size: String
    $user: String
    $gif: String
    $replyToMessage: String
  ) {
    uploadFile(
      file: $file
      idOrEmail: $idOrEmail
      messageOrUser: $messageOrUser
      room: $room
      size: $size
      gif: $gif
      replyToMessage: $replyToMessage
      user: $user
    ) {
      filename
    }
  }
`;

const TYPING = gql`
  subscription {
    typing {
      room
      user
      typing
    }
  }
`;

const ChatInput = ({ roomDetails }) => {
  //Redux
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.info.email);
  const typing = useSelector((state) => state.data.typing);
  const callVideoState = useSelector((state) => state.data.callVideoState);
  const replyToMessage = useSelector((state) => state.data.replyToMessage);
  //Variables
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [show, setShow] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const [fileUpload, setFileUpload] = useState();
  const [isCallingVideo, setIsCallingVideo] = useState(false);
  //Apollo mutation
  const [createMessage, createMessageProps] = useMutation(CREATE_MESSAGE, {
    update(_, res) {},
    onCompleted(data) {
      const input_message = document.getElementById("input_message");

      input_message.value = "";

      setContentMessage("");
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [uploadFile, uploadFileProps] = useMutation(UPLOAD_FILE, {
    update(_, res) {},
    onCompleted(data) {
      setFileUpload();
    },
    onError(err) {
      notifyError(err.message);
    },
  });

  const [setTyping, setTypingProps] = useMutation(SET_TYPING, {
    onCompleted(data) {},
    onError(err) {
      notifyError(err.message);
    },
  });

  const typingSub = useSubscription(TYPING);

  //Methods
  useEffect(() => {
    checkCallState();
  });

  useEffect(() => {
    checkCallState();
  }, [callVideoState]);

  const checkCallState = () => {
    if (roomDetails && callVideoState.length > 0) {
      const thatRoom = callVideoState.filter(
        (item) => item.room === roomDetails.name
      );

      if (thatRoom.length > 0) {
        setIsCallingVideo(thatRoom[0].callState);
      } else {
        setIsCallingVideo(false);
      }
    } else {
      setIsCallingVideo(false);
    }
  };

  useEffect(() => {
    dispatch(setLoading(createMessageProps.loading));
  }, [createMessageProps.loading]);

  useEffect(() => {
    dispatch(setLoading(uploadFileProps.loading));
  }, [uploadFileProps.loading]);

  useEffect(() => {
    if (chosenEmoji) {
      const input_message = document.getElementById("input_message");

      input_message.value += chosenEmoji.emoji;

      setContentMessage(contentMessage + chosenEmoji.emoji);
    }
  }, [chosenEmoji]);

  useEffect(() => {
    if (fileUpload) {
      if (replyToMessage) {
        uploadFile({
          variables: {
            file: fileUpload,
            idOrEmail: email,
            messageOrUser: "message",
            room: roomDetails.name,
            size: fileUpload.size.toString(),
            replyToMessage: replyToMessage.messageId,
          },
        });
      } else {
        uploadFile({
          variables: {
            file: fileUpload,
            idOrEmail: email,
            messageOrUser: "message",
            room: roomDetails.name,
            size: fileUpload.size.toString(),
          },
        });
      }
    }
  }, [fileUpload]);

  useEffect(() => {
    const sendButton = document.getElementById("btn_send");
    if (contentMessage === "") {
      sendButton.style.opacity = ".5";
      sendButton.disabled = true;
    } else {
      sendButton.style.opacity = "1";
      sendButton.disabled = false;
    }
  }, [contentMessage]);

  useEffect(() => {
    if (typingSub.data) {
      dispatch(setTypingData(typingSub.data.typing));
    }
  }, [typingSub.data]);

  useEffect(() => {
    if (replyToMessage) {
    }
  }, [replyToMessage]);

  const ref = useOnclickOutside(() => {
    setShow(false);
  });

  const handleOpenDropdownMenu = () => {
    setShow(true);
  };
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  const handleContentMessage = (e) => {
    setContentMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (contentMessage !== "") {
      setTyping({
        variables: { room: roomDetails.name, user: email, typing: false },
      });

      var encodeContentMessage = encode(contentMessage);
      if (replyToMessage) {
        createMessage({
          variables: {
            content: encodeContentMessage,
            room: roomDetails.name,
            replyToMessage: replyToMessage.messageId,
          },
        });

        dispatch(setReplyToMessage());
      } else {
        createMessage({
          variables: { content: encodeContentMessage, room: roomDetails.name },
        });
      }
    }
  };

  const handleChangeUpload = (e) => {
    if (e.target.validity.valid) {
      setFileUpload(e.target.files[0]);
    }
  };

  const handleTyping = (e) => {
    setTyping({
      variables: { room: roomDetails.name, user: email, typing: true },
    });
  };

  const handleHideTyping = (e) => {
    setTyping({
      variables: { room: roomDetails.name, user: email, typing: false },
    });
  };

  const handleSelectGif = (close, gifUrl, size) => {
    close();

    uploadFile({
      variables: {
        idOrEmail: email,
        messageOrUser: "message",
        room: roomDetails.name,
        size,
        gif: gifUrl,
      },
    });
  };

  const checkTypeReplyOn = (type) => {
    switch (type) {
      case "text":
        return replyToMessage?.content;
      case "file":
        return "A file";
      case "image":
        return "An image";
      case "video":
        return "A video";
      default:
        break;
    }
  };

  return (
    <div className="chat_input_container">
      <ReactTooltip />
      {typing && (
        <>
          {typing.typing && (
            <div className="typing">
              <h6>
                <i>{typing.user} is typing ...</i>
              </h6>
            </div>
          )}
        </>
      )}
      {replyToMessage && (
        <div className="reply_message_container">
          <div className="message">
            <h6>Reply to:</h6>
            <h6>
              <b>{checkTypeReplyOn(replyToMessage.type)}</b>
            </h6>
          </div>
          <div className="close" onClick={() => dispatch(setReplyToMessage())}>
            <img src={closeIcon} />
          </div>
        </div>
      )}
      <form>
        <div className="form_wrapper">
          <div className="input_container">
            <div>
              {roomDetails ? (
                <>
                  {isCallingVideo ? (
                    <input
                      placeholder="You can not send message because the group is in a call"
                      className="input"
                      id="input_message"
                      autoComplete="off"
                      disabled
                    />
                  ) : (
                    <input
                      placeholder="Enter message..."
                      className="input"
                      id="input_message"
                      autoComplete="off"
                      onChange={handleContentMessage}
                      onFocus={handleTyping}
                      onBlur={handleHideTyping}
                    />
                  )}
                </>
              ) : (
                <input
                  placeholder="Messages are loading..."
                  className="input"
                  id="input_message"
                  autoComplete="off"
                  disabled
                />
              )}
            </div>
          </div>
          <div className="icons">
            <div className="icons_wrapper">
              <ul>
                <li>
                  <label data-tip="Gif">
                    {roomDetails ? (
                      <>
                        {!isCallingVideo ? (
                          <Popup
                            trigger={<img src={gif} className="attach_icon" />}
                            position="center"
                            modal
                            nested
                            contentStyle={{ width: "auto" }}
                          >
                            {(close) => (
                              <ReactGiphySearchbox
                                apiKey="9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7"
                                onSelect={(item) =>
                                  handleSelectGif(
                                    close,
                                    item.images.downsized.url,
                                    item.images.downsized.size
                                  )
                                }
                                masonryConfig={[
                                  { columns: 2, imageWidth: 110, gutter: 5 },
                                  {
                                    mq: "700px",
                                    columns: 3,
                                    imageWidth: 120,
                                    gutter: 5,
                                  },
                                ]}
                              />
                            )}
                          </Popup>
                        ) : (
                          <img src={gif} className="attach_icon" disabled />
                        )}
                      </>
                    ) : (
                      <img src={gif} className="attach_icon" disabled />
                    )}
                  </label>
                </li>
                <li>
                  <div data-tip="Emoji" className="emoji">
                    {roomDetails ? (
                      <>
                        {isCallingVideo ? (
                          <button type="button" disabled>
                            <img src={smile} className="smile_icon" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleOpenDropdownMenu}
                          >
                            <img src={smile} className="smile_icon" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button type="button" disabled>
                        <img src={smile} className="smile_icon" />
                      </button>
                    )}

                    <div
                      className={
                        show ? "emoji_dropdown show_emoji" : "emoji_dropdown"
                      }
                      ref={ref}
                    >
                      <Picker
                        onEmojiClick={onEmojiClick}
                        pickerStyle={{
                          position: "absolute",
                          bottom: "65px",
                          right: "80px",
                          boxShadow: "0 2px 4px #0f223a",
                        }}
                      />
                    </div>
                  </div>
                </li>
                <li>
                  <label data-tip="File">
                    <img src={attach_purple} className="attach_icon" />
                    {roomDetails ? (
                      <>
                        {isCallingVideo ? (
                          <input
                            type="file"
                            className="file_input"
                            name="file_input"
                            onChange={handleChangeUpload}
                            disabled
                          />
                        ) : (
                          <input
                            type="file"
                            className="file_input"
                            name="file_input"
                            onChange={handleChangeUpload}
                          />
                        )}
                      </>
                    ) : (
                      <input
                        type="file"
                        className="file_input"
                        name="file_input"
                        onChange={handleChangeUpload}
                        disabled
                      />
                    )}
                  </label>
                </li>
                <li>
                  <label data-tip="Image">
                    <img src={image_purple} className="image_icon" />
                    {roomDetails ? (
                      <>
                        {isCallingVideo ? (
                          <input
                            accept="image/*"
                            name="fileInput"
                            size="60"
                            type="file"
                            className="file_input"
                            onChange={handleChangeUpload}
                            disabled
                          />
                        ) : (
                          <input
                            accept="image/*"
                            name="fileInput"
                            size="60"
                            type="file"
                            className="file_input"
                            onChange={handleChangeUpload}
                          />
                        )}
                      </>
                    ) : (
                      <input
                        accept="image/*"
                        name="fileInput"
                        size="60"
                        type="file"
                        className="file_input"
                        onChange={handleChangeUpload}
                        disabled
                      />
                    )}
                  </label>
                </li>
                <li data-tip="Send">
                  <button
                    className="btn_send"
                    id="btn_send"
                    onClick={handleSendMessage}
                  >
                    <img src={plane} />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
