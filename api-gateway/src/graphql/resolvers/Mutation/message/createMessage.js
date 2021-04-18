import UsersService from "../../../../adapters/usersService";
import ChatService from "../../../../adapters/chatService";
import {UNAUTHENTICATED, USER_NOT_IN_ROOM} from "../../../../const/errors"

const createMessageResolver = async (obj, { content, room, replyToMessage }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  if(context.user.rooms.indexOf(room) === -1) throw new Error(USER_NOT_IN_ROOM)

  var newMessage = await ChatService.createMessage({ content, user: context.user.email, room, replyToMessage});

  await ChatService.updateMessageToRoom({
    room: room,
    message: newMessage._id,
  });

  var updateSuccess = false;
  if (newMessage._id) {
    updateSuccess = await UsersService.updateMessageToUser({
      user: context.user.email,
      messageId: newMessage._id,
    });
  }

  // Notification new message real-time
  context.pubsub.publish("NEW_MESSAGE", { newMessage: newMessage });


  if (updateSuccess) return newMessage;
};

// const newMessageSubscribe = {
//   subscribe: () => {
//     return pubsub.asyncIterator(["NEW_MESSAGE"]);
//   },
// };

// module.exports = {
//   createMessageMutation,
//   newMessageSubscribe
// };

export default createMessageResolver;