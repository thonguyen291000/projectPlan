import React from "react";
//Library
import Skeleton from "@material-ui/lab/Skeleton";
//Icons
import avatar_skeleton from "../../../assets/icons/avatar_skeleton.png";

const ChatItemSkeleton = () => {
  return (
    <a href="#">
      <div className="item">
        <div className="user">
          <Skeleton
            variant="circle"
            width={0}
            height={0}
          />
          <img className="user_avatar" src={avatar_skeleton} />
          <span className="status busy skeleton"></span>
        </div>
        <div className="body skeleton">
          <h5 className="user_name skeleton">Nguyen Tho</h5>
          <p className="message skeleton">Tho Tho Tho Tho Tho Tho</p>
        </div>
        <div className="time skeleton">10:30AM</div>
        <div className="unread_message skeleton">
          <span className="badge_unread skeleton">New</span>
        </div>
      </div>
    </a>
  );
};

export default ChatItemSkeleton;
