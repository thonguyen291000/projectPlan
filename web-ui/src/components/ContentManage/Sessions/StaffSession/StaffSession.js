import React, { useEffect } from "react";
//Library
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CImg,
} from "@coreui/react";
import readXlsxFile from "read-excel-file";
//Logic
import { UpperFirstLetter } from "../../../../funcs/upperFirstLetter";
import { checkEmail, checkRole } from "../../../../funcs/validation";
//Apollo
import { gql, useMutation } from "@apollo/client";
//Toast
import { notifyError } from "../../../../utils/toast";
//Redux
import { useDispatch } from "react-redux";
import {
  setLoading,
  setNewUserStaff,
} from "../../../../redux/actions/dataAction";
//Const
import { EXCEL_NOT_SUITABLE, EXCEL_NOT_SUITABLE_ROLE_EMAIL } from "../../../../const/string";

const CREATE_USER = gql`
  mutation(
    $email: String!
    $password: String!
    $role: String!
    $name: String!
    $classNames: [String!]
  ) {
    createUser(
      email: $email
      password: $password
      role: $role
      name: $name
      classNames: $classNames
    ) {
      email
      name
      role
      createdAt
      avatar
      status
      classes {
        name
      }
    }
  }
`;

const fields = [
  "no",
  "email",
  "name",
  "avatar",
  "registered",
  "role",
  "status",
];

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

const StaffSession = ({ classDetails }) => {
  //Redux
  const dispatch = useDispatch();
  //Apollo
  const [createUser, createUserProps] = useMutation(CREATE_USER, {
    onCompleted(data) {
      dispatch(setNewUserStaff(data.createUser));
    },
    onError(err) {
      notifyError(err.message);
    },
  });
  //Methods
  useEffect(() => {
    dispatch(setLoading(createUserProps.loading));
  }, [createUserProps.loading]);

  const handleUploadFile = () => {
    const input = document.getElementById("file_input");

    input.click();
  };

  const handleChangeFile = () => {
    const input = document.getElementById("file_input");

    readXlsxFile(input.files[0]).then((rows) => {

      const headers = ["email", "name", "role", "classes"];

      //Check headers are suitable
      if (JSON.stringify(headers) === JSON.stringify(rows[0])) {
        //Check validation
        var validEmail = true;
        var validRole = true;
        for (var i = 1; i < rows.length; i++) {
          validEmail = checkEmail(rows[i][0]);
          validRole = checkRole(rows[i][2]);
        }

        if (validEmail && validRole) {
          for (var i = 1; i < rows.length; i++) {
            var classes = rows[i][3].trim().split(", ");

            createUser({
              variables: {
                email: rows[i][0],
                password: "123",
                name: rows[i][1],
                role: rows[i][2],
                classNames: classes,
              },
            });
          }
        } else {
          notifyError(EXCEL_NOT_SUITABLE_ROLE_EMAIL);
        }
      } else {
        notifyError(EXCEL_NOT_SUITABLE);
      }
    });
  };

  return (
    <CRow className="staff_session_container">
      <CCol>
        <CCard>
          <CCardHeader className="card_header">
            <div>
              {" "}
              <h5>{classDetails.name}</h5>
            </div>
            <div>
              {" "}
              <CButton
                block
                variant="outline"
                color="secondary"
                onClick={handleUploadFile}
              >
                Add more students
              </CButton>
            </div>
            <input type="file" id="file_input" onChange={handleChangeFile} />
          </CCardHeader>
          <CCardBody>
            <CDataTable
              items={classDetails.users.filter(user => user.role !== "staff")}
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
                  <td>
                    <CImg src={item.avatar} height="36" width="36" />
                  </td>
                ),
                registered: (item) => (
                  <td>
                    <div>{new Date(`${item.createdAt}`).toDateString()}</div>
                  </td>
                ),
                status: (item) => (
                  <td>
                    <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                  </td>
                ),
                role: (item) => (
                  <td>
                    <div>{UpperFirstLetter(item.role)}</div>
                  </td>
                ),
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default StaffSession;
