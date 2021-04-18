import React, { useEffect, useState } from "react";
//Components
import SelectSession from "./Sessions/SelectSession/SelectSession";
import AdminSession from "./Sessions/AdminSession/AdminSession";
import StaffSession from "./Sessions/StaffSession/StaffSession";
//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setStaffData,
  setNewRoom,
} from "../../redux/actions/dataAction";
//Apollo
import { gql, useQuery, useSubscription } from "@apollo/client";

const GET_DATA = gql`
  query GetData {
    subjects {
      name
      terms {
        name
        classes {
          rootRoom {
            rooms {
              name
              messages {
                content
                createdAt
              }
              users {
                email
                status
                createdAt
              }
              createdAt
              avatar
            }
          }
          name
          users {
            email
            name
            role
            createdAt
            avatar
            status
          }
        }
      }
    }
  }
`;

const USER_ONLINE = gql`
  subscription {
    userOnline {
      email
      status
    }
  }
`;

const USER_OFFLINE = gql`
  subscription {
    userOffline {
      email
      status
    }
  }
`;

const NEW_ROOM = gql`
  subscription {
    newRoom {
      name
      messages {
        content
        createdAt
      }
      users {
        email
        status
        createdAt
      }
      createdAt
      avatar
      rootRoom {
        name
      }
    }
  }
`;

const Sessions = () => {
  //Redux
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.info.role);
  const staffData = useSelector((state) => state.data.staffData);
  const newUser = useSelector((state) => state.data.newUser);
  const newRoom = useSelector((state) => state.data.newRoom);
  //Variables
  const [selectedSubject, setSelectedSubject] = useState();
  const [selectedTerm, setSelectedTerm] = useState();
  const [selectedClass, setSelectedClass] = useState();
  const [classDetails, setClassDetails] = useState();
  const [userChangeStatus, setUserChangeStatus] = useState();
  //Apollo query
  const { loading, error, data } = useQuery(GET_DATA);

  useSubscription(USER_ONLINE, {
    onSubscriptionData(data) {
      setUserChangeStatus(data.subscriptionData.data.userOnline);
    },
  });

  useSubscription(USER_OFFLINE, {
    onSubscriptionData(data) {
      setUserChangeStatus(data.subscriptionData.data.userOffline);
    },
  });

  useSubscription(NEW_ROOM, {
    onSubscriptionData(data) {
      dispatch(setNewRoom(data.subscriptionData.data.newRoom));
    },
  });
  //Methods

  useEffect(() => {
    if (newRoom) {
      const subjectWithNewRoom = [];

      for (var i = 0; i < staffData.subjects?.length; i++) {
        const termWithNewRoom = [];

        for (var j = 0; j < staffData.subjects[i].terms.length; j++) {
          const classWithNewRoom = [];
          for (
            var k = 0;
            k < staffData.subjects[i].terms[j].classes.length;
            k++
          ) {
            if (
              staffData.subjects[i].terms[j].classes[k].name ===
              newRoom.rootRoom.name
            ) {
              classWithNewRoom.push({
                rootRoom: {
                  rooms: [
                    newRoom,
                    ...staffData.subjects[i].terms[j].classes[k].rootRoom.rooms,
                  ],
                },
              });
            } else {
              classWithNewRoom.push(
                staffData.subjects[i].terms[j].classes[k]
              );
            }
          }
          termWithNewRoom.push({
            ...staffData.subjects[i].terms[j],
            classes: classWithNewRoom,
          });
        }

        subjectWithNewRoom.push({
          ...staffData.subjects[i],
          terms: termWithNewRoom,
        });
      }

      dispatch(
        setStaffData({
          subjects: subjectWithNewRoom,
        })
      );
    }
  }, [newRoom]);

  useEffect(() => {
    if (newUser) {
      const subjectWithUserChangeStatus = [];

      for (var i = 0; i < staffData.subjects?.length; i++) {
        const termWithUserChangeStatus = [];

        for (var j = 0; j < staffData.subjects[i].terms.length; j++) {
          const classWithUserChangeStatus = [];
          for (
            var k = 0;
            k < staffData.subjects[i].terms[j].classes.length;
            k++
          ) {
            const usersWithUserChangeStatus = [];
            if (
              newUser.classes.filter(
                (classItem) =>
                  staffData.subjects[i].terms[j].classes[k].name ===
                  classItem.name
              ).length > 0
            ) {
              usersWithUserChangeStatus.push(newUser);
              for (
                var l = 0;
                l < staffData.subjects[i].terms[j].classes[k].users.length;
                l++
              ) {
                usersWithUserChangeStatus.push(
                  staffData.subjects[i].terms[j].classes[k].users[l]
                );
              }
            } else {
              for (
                var l = 0;
                l < staffData.subjects[i].terms[j].classes[k].users.length;
                l++
              ) {
                usersWithUserChangeStatus.push(
                  staffData.subjects[i].terms[j].classes[k].users[l]
                );
              }
            }

            classWithUserChangeStatus.push({
              ...staffData.subjects[i].terms[j].classes[k],
              users: usersWithUserChangeStatus,
            });
          }
          termWithUserChangeStatus.push({
            ...staffData.subjects[i].terms[j],
            classes: classWithUserChangeStatus,
          });
        }

        subjectWithUserChangeStatus.push({
          ...staffData.subjects[i],
          terms: termWithUserChangeStatus,
        });
      }

      dispatch(
        setStaffData({
          subjects: subjectWithUserChangeStatus,
        })
      );
    }
  }, [newUser]);

  useEffect(() => {
    //Update data when user changes status
    if (userChangeStatus && staffData) {
      const subjectWithUserChangeStatus = [];

      for (var i = 0; i < staffData.subjects?.length; i++) {
        const termWithUserChangeStatus = [];

        for (var j = 0; j < staffData.subjects[i].terms.length; j++) {
          const classWithUserChangeStatus = [];
          for (
            var k = 0;
            k < staffData.subjects[i].terms[j].classes.length;
            k++
          ) {
            const usersWithUserChangeStatus = [];
            for (
              var l = 0;
              l < staffData.subjects[i].terms[j].classes[k].users.length;
              l++
            ) {
              if (
                staffData.subjects[i].terms[j].classes[k].users[l].email ===
                userChangeStatus.email
              ) {
                usersWithUserChangeStatus.push({
                  ...staffData.subjects[i].terms[j].classes[k].users[l],
                  status: userChangeStatus.status,
                });
              } else {
                usersWithUserChangeStatus.push(
                  staffData.subjects[i].terms[j].classes[k].users[l]
                );
              }
            }
            classWithUserChangeStatus.push({
              ...staffData.subjects[i].terms[j].classes[k],
              users: usersWithUserChangeStatus,
            });
          }
          termWithUserChangeStatus.push({
            ...staffData.subjects[i].terms[j],
            classes: classWithUserChangeStatus,
          });
        }

        subjectWithUserChangeStatus.push({
          ...staffData.subjects[i],
          terms: termWithUserChangeStatus,
        });
      }

      dispatch(
        setStaffData({
          subjects: subjectWithUserChangeStatus,
        })
      );
    }
  }, [userChangeStatus]);

  useEffect(() => {
    //Set loading to get data
    dispatch(setLoading(loading));

    if (!loading && data) {
      dispatch(setStaffData(data));
    }
  }, [loading]);

  useEffect(() => {
    if (staffData) {
    }
  }, [staffData]);

  const showRightArrow = (object, type) => {
    const right_arrows = document.getElementsByClassName(`right_arrow_${type}`);
    for (var i = 0; i < right_arrows.length; i++) {
      if (right_arrows[i].id === `right_arrow_${object}`) {
        right_arrows[i].className += " show";
      } else {
        right_arrows[i].className = `right_arrow_${type}`;
      }
    }
  };

  const selectSubject = (subject) => {
    if (subject !== selectedSubject) {
      showRightArrow(subject, "subject");

      setSelectedTerm();
      setSelectedClass();
      setSelectedSubject(subject);
    }
  };

  const selectTerm = (term) => {
    if (term !== selectedTerm) {
      showRightArrow(term, "term");
      setSelectedClass();
      setSelectedTerm(term);
    }
  };

  const selectClass = (classItem) => {
    showRightArrow(classItem, "class");
    setSelectedClass(classItem);
  };

  const openClassDetails = (classDetails) => {
    setClassDetails(classDetails);
  };

  return (
    <>
      <SelectSession
        selectedTerm={selectedTerm}
        selectedSubject={selectedSubject}
        data={staffData ? staffData.subjects : []}
        selectedClass={selectedClass}
        selectSubject={selectSubject}
        selectTerm={selectTerm}
        selectClass={selectClass}
        openClassDetails={openClassDetails}
      />
      {role && (
        <>
          {role === "staff" ? (
            <>{classDetails && <StaffSession classDetails={classDetails} />}</>
          ) : (
            <>{classDetails && <AdminSession classDetails={classDetails} />}</>
          )}
        </>
      )}
    </>
  );
};

export default Sessions;
