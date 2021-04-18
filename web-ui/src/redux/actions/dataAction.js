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
  UPDATE_LIST_ROOM
} from "../types";

export const setLoading = (state) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    payload: state,
  });
};

export const setTabNavigation = (tab) => (dispatch) => {
  dispatch({
    type: SET_TAB_NAVIGATION,
    payload: tab,
  });
};

export const setSelectedGroup = (group) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_GROUP,
    payload: group,
  });
};

export const setClassesInChatTab = (classes) => (dispatch) => {
  if (classes.user) {
    dispatch({
      type: SET_CLASSES_IN_CHAT_TAB,
      payload: classes,
    });
  }
};

export const setNewMessage = (newMessage) => (dispatch) => {
  dispatch({
    type: SET_NEW_MESSAGE,
    payload: newMessage,
  });
};

export const setTypingData = (typingData) => (dispatch) => {
  dispatch({
    type: SET_TYPING,
    payload: typingData,
  });
};

export const setChosenClass = (className) => (dispatch) => {
  dispatch({
    type: SET_CHOSEN_CLASS,
    payload: className,
  });
};

export const setDeletedUser = (data) => (dispatch) => {
  dispatch({
    type: SET_DELETED_USER,
    payload: data,
  });
};

export const setRoomDetailChatTab = (room, data) => (dispatch) => {
  dispatch({
    type: SET_ROOM_DETAIL_CHAT_TAB,
    payload: {
      room,
      data,
    },
  });
};

export const setDeletedRoom = (room) => (dispatch) => {
  dispatch({
    type: SET_DELETED_ROOM,
    payload: room,
  });
};

export const updateRoomAvatar = (avatarData) => (dispatch) => {
  dispatch({
    type: UPDATE_ROOM_AVATAR,
    payload: avatarData,
  });
};

export const setSeenRooms = (seenRooms) => (dispatch) => {
  dispatch({
    type: SET_SEEN_ROOMS,
    payload: seenRooms
  })
}

export const setSeenMessage = (usersSeenMessage) => (dispatch) => {
  dispatch({
    type: SET_SEEN_MESSAGE,
    payload: usersSeenMessage
  })
}

export const setFilesProfileTab = (files) => (dispatch) => {
  dispatch({
    type: SET_FILES_PROFILE_TAB,
    payload: files
  })
}

export const setSearchData = (data) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_DATA,
    payload: data
  })
}

export const setStaffData = (data) => (dispatch) => {
  dispatch({
    type: SET_STAFF_DATA,
    payload: data
  })
}

export const setNewUserStaff = (user) => (dispatch) => {
  dispatch({
    type: SET_NEW_USER_STAFF,
    payload: user
  })
}

export const setUserOnline = (user) => (dispatch) => {
  dispatch({
    type: SET_USER_ONLINE,
    payload: user
  })
}

export const setNewRoom = (room) => (dispatch) => {
  dispatch({
    type: SET_NEW_ROOM,
    payload: room
  })
}

export const setCallVideo = (data) => (dispatch) => {
  dispatch({
    type: SET_CALL_VIDEO,
    payload: data
  })
}

export const setMoreMessages = (data) => (dispatch) => {
  dispatch({
    type: SET_MORE_MESSAGE,
    payload: data
  })
}

export const setClassShowCollapse = (className) => (dispatch) => {
  dispatch({
    type: SET_CLASS_SHOW_COLLAPSE,
    payload: className
  })
}

export const setMoreRooms = (data) => (dispatch) => {
  dispatch({
    type: SET_MORE_ROOMS,
    payload: data
  })
}

export const setReplyToMessage = (data) => (dispatch) => {
  dispatch({
    type: SET_REPLY_TO_MESSAGE,
    payload: data
  })
}

export const setUpdateListRoom = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_LIST_ROOM,
    payload: data
  })
}