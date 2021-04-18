import React from "react";
//Library
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CWidgetProgressIcon,
  CButton,
  CButtonGroup,
  CImg,
  CProgress,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Components
import AdminTableItem from "./AdminTableItem";
import MainChart from "./MainChart";
import PieChart from "./PieChart";
//Icons
import student from "../../../../assets/icons/student.png";
import group from "../../../../assets/icons/chat_group.png";
import online_group from "../../../../assets/icons/online_group.png";
import message from "../../../../assets/icons/message.png";
import download from "../../../../assets/icons/download.png";
import user_avatar from "../../../../assets/icons/user_avatar.png";
//Apollo
import { gql, useSubscription } from "@apollo/client";
//Redux
import { useDispatch } from "react-redux";
import { setUserOnline } from "../../../../redux/actions/dataAction";

const NEW_USER_ONLINE_ROOM = gql`
  subscription {
    newUserOnlineRoom {
      email
    }
  }
`;

const fields = [
  "no",
  "avatar",
  "group name",
  "message rate",
  "type of group",
  "status",
];

const AdminSession = ({ classDetails }) => {
  //Redux
  const dispatch = useDispatch();
  //Apollo
  useSubscription(NEW_USER_ONLINE_ROOM, {
    onSubscriptionData(data) {
      dispatch(setUserOnline(data.subscriptionData.data.newUserOnlineRoom));
    },
  });

  //Methods
  const getNumberOfMessagesAndOnlineRooms = () => {
    var messages = 0;
    var onlineRooms = 0;
    var rooms = classDetails.rootRoom.rooms;
    for (var i = 0; i < rooms.length; i++) {
      messages += rooms[i].messages.length;

      if (rooms[i].status === "online") {
        onlineRooms += 1;
      }
    }

    return {
      messages,
      onlineRooms,
    };
  };

  const numberOfStudents = classDetails.users.length;
  const numberOfRooms = classDetails.rootRoom.rooms.length;
  const numberOfMessagesAndOnlineRooms = getNumberOfMessagesAndOnlineRooms();

  return (
    <div className="admin_session_container">
      <CCard>
        <CCardHeader className="card_header">
          <span className="h3">
            <b>{classDetails.name}</b>
          </span>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol xs="12" sm="6" lg="3">
              <CWidgetProgressIcon
                header={numberOfStudents.toString()}
                text="Students"
                color="gradient-info"
                inverse
              >
                <CImg src={student} height="36" />
              </CWidgetProgressIcon>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
              <CWidgetProgressIcon
                header={numberOfRooms.toString()}
                text="Chat Groups"
                color="gradient-success"
                inverse
              >
                <CImg src={group} height="36" />
              </CWidgetProgressIcon>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
              <CWidgetProgressIcon
                header={numberOfMessagesAndOnlineRooms.messages.toString()}
                text="Message"
                color="gradient-warning"
                inverse
              >
                <CImg src={message} height="36" />
              </CWidgetProgressIcon>
            </CCol>
            <CCol xs="12" sm="6" lg="3">
              <CWidgetProgressIcon
                header={numberOfMessagesAndOnlineRooms.onlineRooms.toString()}
                text="Online Groups"
                color="gradient-primary"
                inverse
              >
                <CImg src={online_group} height="36" />
              </CWidgetProgressIcon>
            </CCol>
          </CRow>

          <CCard>
            <CCardBody>
              <CRow>
                <CCol sm="5">
                  <h4 id="traffic" className="card-title mb-0">
                    Message traffic based on date
                  </h4>
                  {/* <div className="small text-muted">November 2017</div> */}
                </CCol>
                <CCol sm="7" className="d-none d-md-block">
                  {/* <CButton color="primary" className="float-right">
                    <CImg src={download} height="15" />
                  </CButton>
                  <CButtonGroup className="float-right mr-3">
                    {["Month"].map((value) => (
                      <CButton
                        color="outline-secondary"
                        key={value}
                        className="mx-0"
                        active={value === "Month"}
                      >
                        {value}
                      </CButton>
                    ))}
                  </CButtonGroup> */}
                </CCol>
              </CRow>
              <MainChart classDetails={classDetails} />
            </CCardBody>
          </CCard>

          <CCard>
            <CCardHeader>
              <h4 id="class_name" className="card-title mb-0">
                Group chat list
              </h4>
            </CCardHeader>
            {/* <CCardBody>
              <CDataTable
                items={classDetails.users}
                fields={fields}
                hover
                bordered
                size="sm"
                itemsPerPage={10}
                pagination
                responsive
                scopedSlots={{
                  no: (item, index) => (
                    <td>
                      <div>{index}</div>
                    </td>
                  ),
                  avatar: (item) => (
                    <td className="text-center">
                      <div className="c-avatar">
                        <img
                          src={user.avatar}
                          className="c-avatar-img"
                          alt="admin@bootstrapmaster.com"
                        />
                        {roomStatus === "online" ? (
                          <span className="c-avatar-status bg-success"></span>
                        ) : (
                          <span className="c-avatar-status bg-danger"></span>
                        )}
                      </div>
                    </td>
                  ),
                  "group name": (item) => (
                    <td>
                      <div>{item.name}</div>
                      <div className="small text-muted">
                        <span>
                          {compareWithNow(item.createdAt) ? "New" : "Old"}
                        </span>{" "}
                        | Registered:{" "}
                        {new Date(`${item.createdAt}`).toDateString()}
                      </div>
                    </td>
                  ),
                  status: (item) => (
                    <td>
                      {/* <div className="small text-muted">Last active</div>
                    <strong>10 sec ago</strong> */}
                      {/* <CBadge color={getBadge(roomStatus)}>{roomStatus}</CBadge>
                    </td>
                  ),
                  "message rate": (item) => (
                    <td>
                      <div className="clearfix">
                        <div className="float-left">
                          <strong>asd</strong>
                        </div>
                        <div className="float-right">
                          <small className="text-muted">
                            {item.messages.length}/{totalMessage}
                          
                          </small>
                        </div>
                      </div>
                      <CProgress
                        className="progress-xs"
                        color="success"
                        // value={messageRate()}
                      />
                    </td>
                  ),
                  "type of group": (item) => (
                    <td className="text-center">asd</td>
                  ),
                }}
              />
            </CCardBody> */}
            <CCardBody>
              <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                  <tr>
                    <th className="text-center">
                      <img src={user_avatar} height="24" width="24" />
                    </th>
                    <th>Group name</th>
                    <th>Message rate</th>
                    <th className="text-center">Type of group</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classDetails.rootRoom.rooms.map((item, index) => (
                    <AdminTableItem
                      index={index}
                      room={item}
                      totalMessage={numberOfMessagesAndOnlineRooms.messages}
                    />
                  ))}
                </tbody>
              </table>
            </CCardBody>
          </CCard>
          <PieChart classDetails={classDetails} />
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AdminSession;
