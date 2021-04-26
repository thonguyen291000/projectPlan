import React, { useEffect, useState } from "react";
//Library
import {
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModalFooter,
  CButton,
  CCol,
  CFormGroup,
  CInput,
  CInputFile,
  CLabel,
  CRow,
  CImg,
} from "@coreui/react";
//Image
import userImage from "../../assets/imgs/user_avatar.jpg";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { editUserName, updateAvatar } from "../../redux/actions/userAction";
import { setLoading } from "../../redux/actions/dataAction";
//Toast
import { notifyError } from "../../utils/toast";
// Apollo
import { gql, useMutation } from "@apollo/client";
//Const
import { FIELD_REQUIRED, EMAIL_INVALID } from "../../const/string";

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

const ModalProfile = ({ modal, setModal }) => {
  //Redux
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.info);
  // Apollo mutation
  const [updateUser, updateUserPros] = useMutation(UPDATE_USER, {
    update(_, res) {
      const user = JSON.parse(localStorage.getItem("user"));
      user.name = res.data.updateUser.name;
      localStorage.setItem("user", JSON.stringify(user));
      //Edit in redux
      dispatch(editUserName(res.data.updateUser.name));
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
    onError(err) {
      console.log(err);
      notifyError(err.message);
    },
  });
  //Variables
  const [previewAvatar, setPreviewAvatar] = useState();
  const [updateData, setUpdateData] = useState({});
  //Methods

  useEffect(() => {
    dispatch(setLoading(updateUserPros.loading));
  }, [updateUserPros.loading]);

  useEffect(() => {
    dispatch(setLoading(updateAvatarPros.loading));
  }, [updateAvatarPros.loading]);
  // const handleUploadImage = (e) => {
  //   const {
  //     target: {
  //       validity,
  //       files: [file],
  //     },
  //   } = e;

  //   if (validity.valid) {
  //     uploadFile({
  //       variables: {
  //         file,
  //         idOrEmail: user.email,
  //         messageOrUser: "user",
  //       },
  //     });
  //   }
  // };

  const handlePreviewAvatar = (e) => {
    setPreviewAvatar(URL.createObjectURL(e.target.files[0]));

    setUpdateData({
      ...updateData,
      file: e.target.files[0],
    });
  };

  const handleNewName = (e) => {
    if (userData.name !== e.target.value) {
      setUpdateData({
        ...updateData,
        name: e.target.value,
      });
    } else {
      setUpdateData({
        ...updateData,
        name: null,
      });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (updateData.name || updateData.file) {
      if (updateData.name) {
        //Update database
        updateUser({
          variables: {
            email: userData.email,
            name: updateData.name,
            password: "",
            avatar: userData.avatar,
          },
        });
      }

      if (updateData.file) {
        uploadFile({
          variables: {
            file: updateData.file,
            idOrEmail: userData.email,
            messageOrUser: "user",
          },
        });
      }
    } else {
      notifyError(FIELD_REQUIRED);
    }
  };

  return (
    <CModal
      show={modal}
      onClose={() => setModal(!modal)}
      className="modal_profile_container"
    >
      <CModalHeader closeButton>
        <CModalTitle>User Profile</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol xs="12">
            <CFormGroup>
              <CLabel htmlFor="name">Name</CLabel>
              <CInput
                id="name"
                placeholder="Enter your name"
                required
                defaultValue={userData.name}
                onChange={handleNewName}
                autoComplete="off"

              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12">
            <CFormGroup>
              <CLabel htmlFor="role">Email</CLabel>
              <CInput
                id="email"
                required
                defaultValue={userData.email}
                disabled
              />
            </CFormGroup>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs="12">
            <CFormGroup>
              <CLabel htmlFor="role">Role</CLabel>
              <CInput
                id="role"
                required
                defaultValue={userData.role}
                disabled
              />
            </CFormGroup>
          </CCol>
        </CRow>

        <CRow className="row_avatar">
          <CCol xs="8" className="column_avatar_label">
            <CFormGroup>
              <CLabel htmlFor="avatar">Upload avatar</CLabel>
              <CCol xs="12" md="9">
                <CInputFile
                  name="avatar"
                  id="avatar"
                  accept="image/*"
                  onChange={handlePreviewAvatar}
                />
              </CCol>
            </CFormGroup>
          </CCol>
          <CCol xs="4" className="column_avatar">
            <CImg
              src={previewAvatar ? previewAvatar : userData.avatar}
              className="c-avatar-img"
              alt="admin@bootstrapmaster.com"
              width="36"
              height="36"
            />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleUpdate}>
          Update changes
        </CButton>{" "}
        <CButton color="secondary" onClick={() => setModal(false)}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalProfile;
