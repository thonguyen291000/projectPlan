import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  EDIT_USER_NAME,
  UPDATE_AVATAR,
} from "../types";
import jwtDecode from "jwt-decode";

var initialState = {
  authenticated: false,
  loading: false,
  info: {},
};

const userState = JSON.parse(localStorage.getItem("user"));
if (userState) {
  const decodedToken = jwtDecode(userState.token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    localStorage.removeItem("user");
  } else {
    initialState = {
      authenticated: true,
      loading: false,
      info: {
        email: userState.email,
        name: userState.name,
        role: userState.role,
        avatar: userState.avatar,
      },
    };
  }
} else console.log("No token found");

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        info: action.payload,
      };
    case EDIT_USER_NAME:
      return {
        ...state,
        info: {
          ...state.info,
          name: action.payload,
        },
      };
    case UPDATE_AVATAR:
      return {
        ...state,
        info: {
          ...state.info,
          avatar: action.payload,
        },
      };
    default:
      return state;
  }
}
