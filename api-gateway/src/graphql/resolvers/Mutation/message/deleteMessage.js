import UsersService from "../../../../adapters/usersService";
import ChatService from "../../../../adapters/chatService";
import {bucketName} from "../../../../configAWS/credentials.json"
import { DELETE_FAILED, UNAUTHENTICATED } from "../../../../const/errors";

const deleteMessageResolver = async (obj, { message }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const messageObj = await ChatService.getMessageById({ messageId: message });

  const deleteMessageFromUser = await UsersService.removeMessageFromUser({
    message,
    user: messageObj.user,
  });

  if (deleteMessageFromUser._id) {
    const result = await ChatService.deleteMessage({ message });

    var params = { Bucket: bucketName, Key: message };

    context.s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // error
      else console.log(); // deleted
    });

    // Notification delete message real-time
    context.pubsub.publish("DELETE_MESSAGE", { deleteMessage: messageObj });

    return result;
  }

  return DELETE_FAILED;
};

export default deleteMessageResolver;
