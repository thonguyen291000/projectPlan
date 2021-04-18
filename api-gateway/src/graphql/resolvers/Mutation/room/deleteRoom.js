import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";
import {bucketName} from "../../../../configAWS/credentials.json";

const deleteRoomResolver = async (obj, { name, whoDeleted }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);
  const result = await ChatService.deleteRoom({ name, whoDeleted });

  if (result) {
    await UsersService.deleteRoomFromUser({ room: name, user: whoDeleted });
  }

  var params = { Bucket: bucketName, Key: name };

  context.s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // error
    else console.log(); // deleted
  });

  return result;
};

export default deleteRoomResolver;
