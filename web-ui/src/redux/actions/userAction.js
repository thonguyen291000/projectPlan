import {SET_UNAUTHENTICATED, SET_USER, EDIT_USER_NAME, UPDATE_AVATAR} from "../types";

export const setUserData = (data) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: data,
  });
};

export const editUserName = (name) => (dispatch) => {
  dispatch({
    type: EDIT_USER_NAME,
    payload:name
  })
}

export const updateAvatar = (avatar) => (dispatch) => {
  dispatch({
    type: UPDATE_AVATAR,
    payload: avatar
  })
}

export const setLogout = () => (dispatch) => {
    dispatch({
        type: SET_UNAUTHENTICATED
    })
}
