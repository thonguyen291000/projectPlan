import {
  SET_TAB_NAVIGATION,
  SET_SELECTED_GROUP,
  SET_LOADING,
  SET_CLASSES_IN_CHAT_TAB,
  SET_NEW_MESSAGE,
  SET_TYPING,
  SET_CHOSEN_CLASS,
  SET_ROOM_DETAIL_CHAT_TAB,
  SET_DELETED_USER,
  SET_DELETED_ROOM,
  UPDATE_ROOM_AVATAR,
  SET_SEEN_ROOMS,
  SET_SEEN_MESSAGE,
  SET_FILES_PROFILE_TAB,
  SET_SEARCH_DATA,
  SET_STAFF_DATA,
  SET_NEW_USER_STAFF,
  SET_USER_ONLINE,
  SET_NEW_ROOM,
  SET_CALL_VIDEO,
  SET_MORE_MESSAGE,
  SET_CLASS_SHOW_COLLAPSE,
  SET_MORE_ROOMS,
  SET_REPLY_TO_MESSAGE,
  UPDATE_LIST_ROOM,
} from "../types";

var initialState = {
  tab: "Profile",
  group: "",
  loading: false,
  newMessage: null,
  typing: null,
  class: "",
  callVideoState: [],
  roomDetailsChatTab: null,
  deletedUserData: null,
  searchData: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TAB_NAVIGATION:
      return {
        ...state,
        tab: action.payload,
      };
    case SET_SELECTED_GROUP:
      return {
        ...state,
        group: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_CLASSES_IN_CHAT_TAB:
      return {
        ...state,
        classesInChatTab: action.payload,
      };
    case SET_NEW_MESSAGE:
      return {
        ...state,
        newMessage: action.payload,
      };
    case SET_TYPING:
      return {
        ...state,
        typing: action.payload,
      };
    case SET_CHOSEN_CLASS:
      return {
        ...state,
        class: action.payload,
      };
    case SET_DELETED_USER:
      return {
        ...state,
        deletedUserData: action.payload,
      };
    case SET_ROOM_DETAIL_CHAT_TAB:
      const room = action.payload.room;

      var newState = state;

      newState[`${room}`] = action.payload.data;

      return newState;
    case SET_DELETED_ROOM:
      return {
        ...state,
        deletedRoom: action.payload,
      };
    case UPDATE_ROOM_AVATAR:
      return {
        ...state,
        avatarRoom: action.payload,
      };
    case SET_SEEN_ROOMS:
      return {
        ...state,
        seenRooms: action.payload,
      };
    case SET_SEEN_MESSAGE:
      return {
        ...state,
        usersSeenMessage: action.payload,
      };
    case SET_FILES_PROFILE_TAB:
      return {
        ...state,
        files: action.payload,
      };
    case SET_SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload,
      };
    case SET_STAFF_DATA:
      return {
        ...state,
        staffData: action.payload,
      };
    case SET_NEW_USER_STAFF:
      return {
        ...state,
        newUser: action.payload,
      };
    case SET_USER_ONLINE:
      return {
        ...state,
        userOnline: action.payload,
      };
    case SET_NEW_ROOM:
      return {
        ...state,
        newRoom: action.payload,
      };
    case SET_CALL_VIDEO:
      if (state.callVideoState.length > 0) {
        //Check room have been in the array and remove it from array
        const roomArray = state.callVideoState.filter(
          (item) => item.room !== action.payload.room
        );

        return {
          ...state,
          callVideoState: [...roomArray, action.payload],
        };
      } else {
        return {
          ...state,
          callVideoState: [action.payload],
        };
      }
    case SET_MORE_MESSAGE:
      return {
        ...state,
        moreMessages: action.payload,
      };
    case SET_CLASS_SHOW_COLLAPSE:
      return {
        ...state,
        classShowCollapse: action.payload,
      };
    case SET_MORE_ROOMS:
      return {
        ...state,
        moreRooms: action.payload,
      };
    case SET_REPLY_TO_MESSAGE:
      return {
        ...state,
        replyToMessage: action.payload,
      };
    case UPDATE_LIST_ROOM:
      return {
        ...state,
        updateListRoom: action.payload,
      };
    default:
      return state;
  }
}
