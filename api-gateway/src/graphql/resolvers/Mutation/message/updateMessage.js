import ChatService from "../../../../adapters/chatService";
import { UNAUTHENTICATED } from "../../../../const/errors";

const updateMessageResolver = async (
  obj,
  { message, content, seen, usersSeenMessage, reacts },
  context
) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const result = await ChatService.updateMessage({
    message,
    content,
    seen,
    usersSeenMessage,
    fileName: "",
    mimetype: "",
    encoding: "",
    url: "",
    type: "",
    reacts
  });

  if (!usersSeenMessage) {
    // Notification updated message real-time
    context.pubsub.publish("UPDATE_MESSAGE", { updateMessage: result });
  }

  return result;
};

export default updateMessageResolver;
