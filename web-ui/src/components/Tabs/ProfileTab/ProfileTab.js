import React, { useEffect, useState } from "react";
//Library
import GridLoader from "react-spinners/GridLoader";
import LoadingOverlay from "react-loading-overlay";
//Icons
import about_icon from "../../../assets/icons/about.png";
import attachment from "../../../assets/icons/paperclip.png";
import open from "../../../assets/icons/right-arrow.png";
import close from "../../../assets/icons/up-arrow.png";
import close_x from "../../../assets/icons/close.png";
import online from "../../../assets/icons/online.png";
//Components
import UploadedFile from "./UploadedFile";
//Redux
import { useSelector } from "react-redux";

const files = [
  {
    name: "File 1",
    size: "12MB",
    type: "file",
  },
  {
    name: "File 2",
    size: "5MB",
    type: "image",
  },
  {
    name: "File 3",
    size: "10MB",
    type: "video",
  },
];

const ProfileTab = ({ closeSlidebar }) => {
  //Redux
  const user = useSelector((state) => {
    return {
      name: state.user.info.name,
      email: state.user.info.email,
      avatar: state.user.info.avatar,
    };
  });
  const files = useSelector((state) => state.data.files);
  //Variables
  const [collapse, setCollapse] = useState({
    first: true,
    second: false,
  });

  //Hook
  useEffect(() => {
    const collapseElements = document.getElementsByClassName("collapse");

    collapseElements[0].className += " show";
  }, []);

  //Methods
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

  return (
    <div className="tab_content">
      <div className="tab_content_header">
        <h4>My Profile</h4>
        <div className="float_right_dropdown">
          <div className="dropdown">
            <a href="#">
              {closeSlidebar && <img src={close_x} onClick={closeSlidebar} />}
            </a>
            <div className="dropdown_menu"></div>
          </div>
        </div>
      </div>
      <div className="user_session">
        <div className="user_session_image">
          <img src={user.avatar} />
        </div>
        <div className="user_session_name">{user.name}</div>
        <div className="user_session_state">
          <img src={online} /> Active
        </div>
      </div>
      <div className="profile_content">
        <div className="description">
          <p>
            If several languages coalesce, the grammar of the resulting language
            is more simple and regular than that of the individual.
          </p>
        </div>
        <div className="accordion">
          <div className="card">
            <a href="#" onClick={handleShowFirstCollapse}>
              <div>
                <div>
                  <img src={about_icon} className="about_icon" />
                  <span>About</span>
                </div>
                <img
                  src={collapse.first ? open : close}
                  className="open_close_icon"
                />
              </div>
            </a>
            <div className="collapse" id="first_collapse">
              <div className="card_body">
                <div>
                  <p>Name</p>
                  <h5>{user.name}</h5>
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
                <div>
                  <img src={attachment} className="attachment" />
                  <span>Uploaded Files</span>
                </div>
                <img
                  src={collapse.second ? open : close}
                  className="open_close_icon"
                />
              </div>
            </a>
            <div className="collapse" id="second_collapse">
              <div className="card_body">
                {files && files.length > 0 ? (
                  files.map((file, index) => (
                    <span key={index}>
                      <UploadedFile file={file} />
                    </span>
                  ))
                ) : (
                  <LoadingOverlay
                    className="loading_overlay_container"
                    active={true}
                    spinner={<GridLoader color="silver" />}
                  ></LoadingOverlay>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
