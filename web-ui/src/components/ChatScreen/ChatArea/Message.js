import React, { useState } from "react";
//Library
import useOnclickOutside from "react-cool-onclickoutside";
import { Lightbox } from "react-modal-image";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReactTooltip from "react-tooltip";
//Icons
import clock from "../../../assets/icons/clock.png";
import three_dots from "../../../assets/icons/three_dots_purple.png";
import copy from "../../../assets/icons/copy.png";
import clock_black from "../../../assets/icons/clock_black.png";
import file_icon from "../../../assets/icons/file_purple.png";
import download_icon from "../../../assets/icons/download.png";
import video_icon from "../../../assets/icons/video_purple.png";
import trash from "../../../assets/icons/trash_black.png";
import replyToMessageIcon from "../../../assets/icons/replyToMessage.png";
//Images
import user_avatar from "../../../assets/imgs/user_avatar.jpg";
//Logic
import { decode, encode } from "../../../funcs/utf8";
import { fileSizeCal } from "../../../funcs/fileSizeCal";
//Redux
import { useDispatch } from "react-redux";
import {
  setReplyToMessage,
  setLoading,
} from "../../../redux/actions/dataAction";
//Components
import EditGroupsModal from "../../EditGroupsModal/EditGroupsModal";
// Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError } from "../../../utils/toast";

const UPDATE_MESSAGE = gql`
  mutation(
    $message: ID!
    $content: String
    $seen: String
    $fileName: String
    $mimetype: String
    $encoding: String
    $url: String
    $usersSeenMessage: [String]
    $reacts: [String]
  ) {
    updateMessage(
      message: $message
      content: $content
      seen: $seen
      fileName: $fileName
      mimetype: $mimetype
      encoding: $encoding
      url: $url
      usersSeenMessage: $usersSeenMessage
      reacts: $reacts
    ) {
      _id
    }
  }
`;

const Message = ({
  content,
  time,
  type,
  date,
  position,
  filename,
  fileUrl,
  user,
  size,
  userAvatar,
  messageId,
  replyToMessage,
  reacts,
}) => {
  //Redux
  const dispatch = useDispatch();
  //Variables
  const [show, setShow] = useState(false);
  const [lightBox, setLightBox] = useState(false);
  const [showReacts, setShowReacts] = useState(false);
  //Apollo
  const [updateMessage, updateUserSeenMessagesProps] = useMutation(
    UPDATE_MESSAGE,
    {
      onCompleted(data) {},
      onError(err) {
        notifyError(err.message);
      },
    }
  );
  //Methods
  React.useEffect(() => {
    dispatch(setLoading(updateUserSeenMessagesProps.loading));
  }, [updateUserSeenMessagesProps.loading]);

  const ref = useOnclickOutside(() => {
    setShow(false);
  });

  const refReacts = useOnclickOutside(() => {
    setShowReacts(false);
  });

  const handleOpenDropdownMenu = (e) => {
    e.preventDefault();

    setShow(true);
  };

  const handleVideoDownload = () => {
    const video_download = document.getElementById("video_download");

    video_download.click();
  };

  const handleFileDownload = () => {
    const file_download = document.getElementById("file_download");

    file_download.click();
  };

  const handleDeleteMessage = (e) => {
    e.preventDefault();
  };

  const closeLightbox = () => {
    const sendButton = document.getElementById("btn_send");
    sendButton.style.opacity = ".5";
    sendButton.disabled = true;

    setLightBox(false);
  };

  const openLightBox = () => {
    const sendButton = document.getElementById("btn_send");
    sendButton.style.opacity = "1";
    sendButton.disabled = true;

    setLightBox(true);
  };

  const handleReplyOn = () => {
    dispatch(
      setReplyToMessage({
        content,
        fileUrl,
        messageId,
        type,
      })
    );
  };

  const handleReact = (react) => {
    var reactsArray = [];
    var newReact;

    if (reacts && reacts.length !== 0) {
      for (let index = 0; index < reacts.length; index++) {
        const element = reacts[index];
        var reactName = element?.split("-")[0];
        var reactNumber = Number(element?.split("-")[1]);

        if (decode(reactName) === react) {
          reactNumber += 1;

          newReact = reactName + "-" + reactNumber;
          console.log(newReact);
          break;
        }
      }
      reactsArray = reacts.filter(
        (item) => decode(item?.split("-")[0]) !== react
      );

      reactsArray.push(newReact);
    } else {
      var array = ["😍", "🤣", "😢", "👍", "❤️"];
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element === react) {
          reactsArray.push(encode(react) + "-1");
        } else {
          reactsArray.push(encode(element) + "-0");
        }
      }
    }

    updateMessage({
      variables: {
        message: messageId,
        content: "",
        fileName: "",
        mimetype: "",
        encoding: "",
        url: "",
        reacts: reactsArray,
        seen: "",
        usersSeenMessage: null,
      },
    });
  };

  const reactsSection = () => {
    return (
      <div className="dropdown_reacts">
        <div
          className={showReacts ? `dropdown_menu show` : "dropdown_menu"}
          ref={refReacts}
        >
          <div>
            <span data-tip="Love" onClick={() => handleReact("😍")}>
              😍
            </span>
            <span data-tip="Fun" onClick={() => handleReact("🤣")}>
              🤣
            </span>
            <span data-tip="Sad" onClick={() => handleReact("😢")}>
              😢
            </span>
            <span data-tip="Like" onClick={() => handleReact("👍")}>
              👍
            </span>
            <span data-tip="Heart" onClick={() => handleReact("❤️")}>
              ❤️
            </span>
          </div>
        </div>
      </div>
    );
  };

  const showReactItem = (react, number) => {
    return (
      <div
        className="react_container"
        style={{
          backgroundColor: "bisque",
          width: "30px",
          borderRadius: "50%",
          marginLeft: "10px",
        }}
      >
        <span style={{}}>{react}</span>
        <span style={{ color: "red" }}>{number}</span>
      </div>
    );
  };

  const showReactSection = () => {
    if (reacts && reacts?.length > 0) {
      return (
        <div style={{ display: "flex" }}>
          {reacts.map((react) => {
            const reactName = react.split("-")[0];
            const reactNumber = react.split("-")[1];
            if (reactNumber > 0) {
              return showReactItem(decode(reactName), reactNumber);
            } else return <></>;
          })}
        </div>
      );
    } else {
      return <></>;
    }
  };

  const dropdownSection = () => {
    return (
      <div className="dropdown">
        <a href="#" onClick={handleOpenDropdownMenu}>
          <img src={three_dots} />
        </a>
        <div
          className={show ? `dropdown_menu show ${position}` : "dropdown_menu"}
          ref={ref}
        >
          <div className="item" onClick={handleReplyOn}>
            Reply on
            <img src={replyToMessageIcon} />
          </div>
          {position === "left" && (
            <Popup
              trigger={
                <div className="item">
                  Delete
                  <img src={trash} />
                </div>
              }
              position="right center"
              modal
              nested
            >
              {(close) => (
                <EditGroupsModal
                  type="delete"
                  closeModal={close}
                  deleteData={{
                    target: "message",
                    messageId,
                  }}
                />
              )}
            </Popup>
          )}
        </div>
      </div>
    );
  };

  const checkTypeReplyOn = () => {
    switch (true) {
      case replyToMessage?.content !== "":
        return decode(replyToMessage.content).length > 20
          ? `${decode(replyToMessage.content).slice(0, 20)}...`
          : decode(replyToMessage.content);
      case replyToMessage?.filename !== "":
        return replyToMessage.filename;
      default:
        break;
    }
  };

  const checkReplyToMessageSection = () => {
    if (replyToMessage) {
      return (
        <>
          <h7>
            <i>
              <b>Reply to: {checkTypeReplyOn()}</b>
            </i>
          </h7>{" "}
          <hr />
          <p>{decode(content)}</p>
        </>
      );
    } else {
      return <p>{decode(content)}</p>;
    }
  };

  const checkMessage = () => {
    switch (type) {
      case "text":
        return (
          <div
            className="conversation"
            onDoubleClick={() => setShowReacts(true)}
          >
            <div className="user_avatar">
              <img src={userAvatar} />
            </div>
            <div className="message">
              <div className="message_wrapper">
                <div className="message_content">
                  {checkReplyToMessageSection()}
                  <p className="time">
                    <img src={position === "left" ? clock : clock_black} />
                    <span>
                      {time} - {date}
                    </span>
                  </p>
                </div>
                {dropdownSection()}
              </div>
              {showReactSection()}
              <div className="user_name">{user && user}</div>
            </div>
          </div>
        );
      case "file":
        return (
          <div className="conversation">
            <div className="user_avatar">
              <img src={userAvatar} />
            </div>
            <div className="message">
              <div className="message_wrapper">
                <div className="message_content">
                  {checkReplyToMessageSection()}
                  <p>File</p>
                  <div className="card">
                    <div className="card_content">
                      <div className="file_icon">
                        <div className="file_icon_wrapper">
                          <img className="icon" src={file_icon} />
                        </div>
                      </div>
                      <div className="info">
                        <div className="info_wrapper">
                          <h5 className="file_name">{filename}</h5>
                          <p className="storage">{fileSizeCal(size)}</p>
                        </div>
                      </div>
                      <div className="action">
                        <ul className="action_list">
                          <li className="item">
                            <a>
                              <img
                                src={download_icon}
                                onClick={handleFileDownload}
                              />
                              <a href={fileUrl} disabled id="file_download"></a>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="time">
                    <img src={clock} />
                    <span>
                      {time} - {date}
                    </span>
                  </p>
                </div>
                {dropdownSection()}
              </div>
              <div className="user_name">{user && user}</div>
            </div>
          </div>
        );
      case "image":
        return (
          <div className="conversation">
            <div className="user_avatar">
              <img src={userAvatar} />
            </div>
            <div className="message">
              <div className="message_wrapper">
                <div className="message_content">
                  {checkReplyToMessageSection()}
                  <p>
                    <img src={fileUrl} width="400" onClick={openLightBox} />
                    {lightBox && (
                      <Lightbox
                        small={fileUrl}
                        large={fileUrl}
                        alt={filename}
                        onClose={closeLightbox}
                      />
                    )}
                  </p>
                  <p className="time">
                    <img src={position === "left" ? clock : clock_black} />
                    <span>
                      {time} - {date}
                    </span>
                  </p>
                </div>
                {dropdownSection()}
              </div>
              <div className="user_name">{user && user}</div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="conversation">
            <div className="user_avatar">
              <img src={userAvatar} />
            </div>
            <div className="message">
              <div className="message_wrapper">
                <div className="message_content">
                  {checkReplyToMessageSection()}
                  <p>
                    <video width="320" height="240" controls>
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <p className="time">
                    <img src={position === "left" ? clock : clock_black} />
                    <span>
                      {time} - {date}
                    </span>
                  </p>
                  {/* <p>Video</p>
                  <div className="card">
                    <div className="card_content">
                      <div className="file_icon">
                        <div className="file_icon_wrapper">
                          <img className="icon" src={video_icon} />
                        </div>
                      </div>
                      <div className="info">
                        <div className="info_wrapper">
                          <h5 className="file_name">{filename}</h5>
                          <p className="storage">{fileSizeCal(size)}</p>
                        </div>
                      </div>
                      <div className="action">
                        <ul className="action_list">
                          <li className="item">
                            <a>
                              <img
                                src={download_icon}
                                onClick={handleVideoDownload}
                              />
                              <a
                                href={fileUrl}
                                disabled
                                id="video_download"
                              ></a>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p className="time">
                    <img src={clock} />
                    <span>
                      {time} - {date}
                    </span>
                  </p> */}
                </div>
                {dropdownSection()}
              </div>
              <div className="user_name">{user && user}</div>
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {/* <ReactTooltip /> */}
      {checkMessage()}
      {reactsSection()}
    </>
  );
};

export default Message;
