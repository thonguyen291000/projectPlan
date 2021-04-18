import React, { useState } from "react";
//Library

//Icons
import clock from "../../../assets/icons/clock.png";
import three_dots from "../../../assets/icons/three_dot_skeleton.png";
import clock_black from "../../../assets/icons/clock_black.png";
import avatar_skeleton from "../../../assets/icons/avatar_skeleton.png";

const MessageSkeleton = ({ position }) => {
  return (
    <div className="conversation">
      <div className="user_avatar">
        <img src={avatar_skeleton} />
      </div>
      <div className="message">
        <div className="message_wrapper">
          <div className="skeleton message_content_skeleton">
            <p>ThoThoThoThoThoThoTho</p>
            <p className="time skeleton">
              <span>10:03AM</span>
            </p>
          </div>
          <div className="dropdown">
            <a href="#">
              <img src={three_dots} />
            </a>
          </div>
        </div>
        <div className="user_name skeleton">Nguyen Tho</div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
