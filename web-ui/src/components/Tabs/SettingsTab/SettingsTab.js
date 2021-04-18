import React, { useEffect, useState } from "react";
//Library
import useOnclickOutside from "react-cool-onclickoutside";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FileViewer from "react-file-viewer";
//Word
import term_condition from "../../../assets/word/term_condition.docx";
//Image
import userImage from "../../../assets/imgs/user_avatar.jpg";
//Toast
import { notifyError, notifySuccess } from "../../../utils/toast";
//Icons
import edit_line from "../../../assets/icons/edit_line.png";
import edit_icon from "../../../assets/icons/edit.png";
import open_status from "../../../assets/icons/arrow-pointing-downwards.png";
import open from "../../../assets/icons/right-arrow.png";
import close from "../../../assets/icons/up-arrow.png";
import save from "../../../assets/icons/save.png";
//Redux
import { editUserName, updateAvatar } from "../../../redux/actions/userAction";
import { setLoading } from "../../../redux/actions/dataAction";
import { useSelector, useDispatch } from "react-redux";
// Apollo
import { gql, useMutation } from "@apollo/client";
// Const
import { UPDATE_USER_SUCCESS, UPDATE_AVATAR } from "../../../const/string";

const UPDATE_USER = gql`
  mutation UPDATE_USER(
    $email: String!
    $name: String!
    $password: String!
    $avatar: String!
  ) {
    updateUser(
      email: $email
      name: $name
      password: $password
      avatar: $avatar
    ) {
      name
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

const SettingTab = () => {
  //Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return {
      name: state.user.info.name,
      email: state.user.info.email,
      avatar: state.user.info.avatar,
    };
  });
  // Apollo mutation
  const [updateUser, updateUserPros] = useMutation(UPDATE_USER, {
    update(_, res) {
      const user = JSON.parse(localStorage.getItem("user"));
      user.name = res.data.updateUser.name;
      localStorage.setItem("user", JSON.stringify(user));
      //Edit in redux
      dispatch(editUserName(res.data.updateUser.name));
    },
    onCompleted(data) {
      notifySuccess(UPDATE_USER_SUCCESS);
    },
    onError(err) {
      notifyError(err.message);
    },
  });
  const [uploadFile, updateAvatarPros] = useMutation(UPLOAD_AVATAR, {
    update(_, res) {
      const user = JSON.parse(localStorage.getItem("user"));
      user.avatar = res.data.uploadFile.url;
      localStorage.setItem("user", JSON.stringify(user));
      //Edit in redux
      dispatch(updateAvatar(res.data.uploadFile.url));
    },
    onCompleted(data) {
      notifySuccess(UPDATE_AVATAR);
    },
    onError(err) {
      console.log(err);
      notifyError(err.message);
    },
  });
  //Variables
  const [collapse, setCollapse] = useState({
    first: true,
    second: false,
  });
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState();
  const [uploadedImg, setUploadedImg] = useState(null);
  //Hook
  useEffect(() => {
    const collapseElements = document.getElementsByClassName("collapse");

    collapseElements[0].className += " show";
  }, []);

  //Methods

  useEffect(() => {
    dispatch(setLoading(updateUserPros.loading));
  }, [updateUserPros.loading]);

  useEffect(() => {
    dispatch(setLoading(updateAvatarPros.loading));
  }, [updateAvatarPros.loading]);

  useEffect(() => {
    if (uploadedImg !== null) {
      console.log(uploadedImg);
    }
  }, [uploadedImg]);

  const ref = useOnclickOutside(() => {
    setShow(false);
  });

  const handleOpenDropdownMenu = () => {
    setShow(true);
  };

  const handleShowFirstCollapse = (event) => {
    const collapseElements = document.getElementsByClassName("collapse");

    for (var i = 0; i < collapseElements.length; i++) {
      if (collapseElements[i].id === "first_collapse") {
        if (collapseElements[i].className.includes("show")) {
          collapseElements[i].className = "collapse";
        } else {
          collapseElements[i].className += " show";
        }
      }
      setCollapse({
        ...collapse,
        first: !collapse.first,
      });
    }
  };

  const handleShowSecondCollapse = (event) => {
    const collapseElements = document.getElementsByClassName("collapse");

    for (var i = 0; i < collapseElements.length; i++) {
      if (collapseElements[i].id === "second_collapse") {
        if (collapseElements[i].className.includes("show")) {
          collapseElements[i].className = "collapse";
        } else {
          collapseElements[i].className += " show";
        }
      }

      setCollapse({
        ...collapse,
        second: !collapse.second,
      });
    }
  };

  const handleEditName = () => {
    setIsEdit(true);
  };

  const handleChangeName = (e) => {
    setNewName(e.target.value);
  };

  const handleSaveName = () => {
    if (newName !== user.name) {
      //Update database
      updateUser({
        variables: {
          email: user.email,
          name: newName,
          password: "",
          avatar: user.avatar,
        },
      });
    }
    setIsEdit(false);
  };

  const handleEditAvatar = () => {
    const fileInput = document.getElementById("file_input");
    fileInput.click();
  };

  const handleUploadImage = (e) => {
    const {
      target: {
        validity,
        files: [file],
      },
    } = e;

    if (validity.valid) {
      uploadFile({
        variables: {
          file,
          idOrEmail: user.email,
          messageOrUser: "user",
        },
      });
    }
  };

  return (
    <div className="tab_content">
      <div className="tab_content_header">
        <h4>Settings</h4>
      </div>
      <div className="user_session">
        <div className="user_session_image_settings">
          <img src={user.avatar} />
          <button className="btn_edit_user_avatar" onClick={handleEditAvatar}>
            <img className="edit_icon" src={edit_icon} />
            <input
              type="file"
              name="file_input"
              id="file_input"
              accept="image/*"
              hidden
              onChange={handleUploadImage}
            />
          </button>
        </div>
        <div className="user_session_name">{user.name}</div>
        {/* <div className="user_session_status">
          <a
            href="#"
            className="status_wrapper"
            onClick={handleOpenDropdownMenu}
          >
            Available
            <img src={open_status} className="status_dropdown_open" />
          </a>
          <div
            className={
              show ? "dropdown_status show_dropdown" : "dropdown_status"
            }
            ref={ref}
          >
            <button className="item">Available</button>
            <button className="item">Busy</button>
          </div>
        </div> */}
      </div>

      <div className="settings_content">
        <div className="accordion">
          <div className="card">
            <a href="#" onClick={handleShowFirstCollapse}>
              <div>
                <span>Personal Info</span>
                <img
                  src={collapse.first ? open : close}
                  className="open_close_icon"
                />
              </div>
            </a>
            <div className="collapse" id="first_collapse">
              <div className="card_body">
                <div className="float_right">
                  {!isEdit ? (
                    <button className="btn_edit_name" onClick={handleEditName}>
                      <img src={edit_line} className="icon_edit_name" />
                      Edit
                    </button>
                  ) : (
                    <button className="btn_edit_name" onClick={handleSaveName}>
                      <img src={save} className="icon_edit_name" />
                      Save
                    </button>
                  )}
                </div>
                <div>
                  <p>Name</p>
                  {!isEdit ? (
                    <h5>{user.name}</h5>
                  ) : (
                    <input
                      className="name_input"
                      defaultValue={user.name}
                      type="text"
                      id="name_input"
                      onChange={handleChangeName}
                    />
                  )}
                </div>
                <div>
                  <p>Email</p>
                  <h5>{user.email}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <a href="#" onClick={handleShowSecondCollapse}>
              <div>
                <span>Help</span>
                <img
                  src={collapse.second ? open : close}
                  className="open_close_icon"
                />
              </div>
            </a>
            <div className="collapse" id="second_collapse">
              <div className="card_body">
                <div>
                  <div className="session">
                    <h5>
                      <a href="#">FAQs</a>
                    </h5>
                  </div>
                  <div className="session border_top">
                    <h5>
                      <Popup
                        trigger={<a href="#">Term & Privacy policy</a>}
                        position="right center"
                        modal
                        nested
                      >
                        {(close) => (
                          <div className="term_condition">
                            <FileViewer
                              fileType="docx"
                              filePath={term_condition}
                            />
                          </div>
                        )}
                      </Popup>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingTab;
