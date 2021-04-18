import React, { useEffect, useState } from "react";
//Library
import { CBadge, CProgress, CTooltip } from "@coreui/react";
//Icons
import private_group from "../../../../assets/icons/private_group.png";
import public_group from "../../../../assets/icons/public_group.png";
//Logic
import { compareWithNow } from "../../../../funcs/formatDate";
//Redux
import { useSelector } from "react-redux";

const AdminTableItem = ({ room, createdDate, index, totalMessage }) => {
  //Redux
  const user = useSelector((state) => state.user.info);
  const userOnline = useSelector((state) => state.data.userOnline);
  //Variables
  const [roomData, setRoomData] = useState();
  //Methods
  useEffect(() => {
    setRoomData(room);
  }, [room]);

  useEffect(() => {
    if (userOnline && roomData) {
      const newUsers = [];

      for (var i = 0; i < room.users.length; i++) {
        if (room.users[i].email === userOnline.email) {
          newUsers.push({
            ...room.users[i],
            status: "online",
          });
        } else {
          newUsers.push(room.users[i]);
        }
      }

      setRoomData({
        ...roomData,
        users: newUsers,
      });
    }
  }, userOnline);

  const checkTypeOfGroup = () => {
    if (roomData?.users.length > 2) {
      return (
        <CTooltip content="Social room">
          <img src={public_group} width="36" height="36" />
        </CTooltip>
      );
    } else {
      return (
        <CTooltip content="Private room">
          <img src={private_group} width="36" height="36" />
        </CTooltip>
      );
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "secondary";
      default:
        return "primary";
    }
  };

  const messageRate = () => {
    if (totalMessage === 0) {
      return "0";
    } else {
      return (room.messages.length / totalMessage).toString();
    }
  };

  const checkStatusRoom = () => {
    const onlineUsers = roomData?.users.filter(
      (user) => user.status === "online"
    );

    if (onlineUsers) {
      if (onlineUsers.length > 0) {
        return "online";
      } else {
        return "offline";
      }
    }
  };

  const roomStatus = checkStatusRoom();

  return (
    <tr key={index}>
      <td className="text-center">
        <div className="c-avatar">
          <img
            src={room.avatar}
            alt="admin@bootstrapmaster.com"
            width="24"
            height="24"
            style={{ borderRadius: "50%" }}
          />
          {roomStatus === "online" ? (
            <span className="c-avatar-status bg-success"></span>
          ) : (
            <span className="c-avatar-status bg-danger"></span>
          )}
        </div>
      </td>
      <td>
        <div>{roomData?.name}</div>
        <div className="small text-muted">
          <span>{compareWithNow(roomData?.createdAt) ? "New" : "Old"}</span> |
          Registered: {new Date(`${roomData?.createdAt}`).toDateString()}
        </div>
      </td>
      <td>
        <div className="clearfix">
          <div className="float-left">
            <strong>{messageRate()}%</strong>
          </div>
          <div className="float-right">
            <small className="text-muted">
              {roomData?.messages.length}/{totalMessage}
            </small>
          </div>
        </div>
        <CProgress
          className="progress-xs"
          color="success"
          value={messageRate()}
        />
      </td>
      <td className="text-center">{checkTypeOfGroup()}</td>
      <td>
        {/* <div className="small text-muted">Last active</div>
        <strong>10 sec ago</strong> */}
        <CBadge color={getBadge(roomStatus)}>{roomStatus}</CBadge>
      </td>
    </tr>
  );
};

export default AdminTableItem;
