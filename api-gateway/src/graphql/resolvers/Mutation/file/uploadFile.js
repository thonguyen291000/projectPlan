import ChatService from "../../../../adapters/chatService";
import UsersService from "../../../../adapters/usersService";
import { UNAUTHENTICATED } from "../../../../const/errors";
// import aws from "aws-sdk";
import { bucketName } from "../../../../configAWS/credentials.json";

const uploadFileResolver = async (obj, args, context) => {
  const updateMessageOrUser = args.messageOrUser;
  var result;
  var filename;
  var mimetype;
  var file;  

  if (!args.gif) {
    file = await args.file;
    const { createReadStream } = file;
    filename = file.filename;
    mimetype = file.mimetype;
    const fileStream = createReadStream();

    const uploadParams = {
      Bucket: bucketName,
      Key: filename,
      Body: fileStream,
    };
    //Here stream it to S3
    result = await context.s3.upload(uploadParams).promise();

  }
  var resultUploadDB = false;

  if (updateMessageOrUser === "message") {
    var type;
    var newMessage;
    if (args.gif) {
      type = "image";

      newMessage = await ChatService.createMessage({
        content: "",
        filename: "GIF",
        url: args.gif,
        type,
        user: args.idOrEmail,
        room: args.room,
        size: args.size,
        replyToMessage: args.replyToMessage ? args.replyToMessage : null
      });
    } else {
      if (mimetype.includes("image")) {
        type = "image";
      } else if (mimetype.includes("video")) {
        type = "video";
      } else {
        type = "file";
      }

      newMessage = await ChatService.createMessage({
        content: "",
        filename: filename,
        mimetype: mimetype,
        encoding: file.encoding,
        url: result.Location,
        type,
        user: args.idOrEmail,
        room: args.room,
        size: args.size,
        replyToMessage: args.replyToMessage ? args.replyToMessage : null
      });
    }

    await ChatService.updateMessageToRoom({
      room: args.room,
      message: newMessage._id,
    });

    await UsersService.updateMessageToUser({
      user: args.idOrEmail,
      messageId: newMessage._id,
    });

    if (typeof resultUpdate !== "string") {
      resultUploadDB = true;
    }

    // Notification new message real-time
    context.pubsub.publish("NEW_MESSAGE", { newMessage: newMessage });
    context.pubsub.publish("NEW_MESSAGE_FOR_CHAT", { newMessage: newMessage });
  } else if (updateMessageOrUser === "user") {
    const resultUpdate = await UsersService.updateUser({
      email: args.idOrEmail,
      name: "",
      password: "",
      avatar: result.Location,
    });

    context.pubsub.publish("NEW_USER_AVATAR", {
      newUserAvatar: resultUpdate
    });

    if (typeof resultUpdate !== "string") {
      resultUploadDB = true;
    }
  } else if (updateMessageOrUser === "room") {
    const resultUpdate = await ChatService.updateRoom({
      room: args.idOrEmail,
      name: "",
      description: "",
      status: "",
      avatar: result.Location,
    });

    await context.pubsub.publish("NEW_ROOM_AVATAR", {
      newRoomAvatar: {
        room: args.idOrEmail,
        url: result.Location,
        user: args.user,
      },
    });

    if (typeof resultUpdate !== "string") {
      resultUploadDB = true;
    }
  }

  const returnedFile = {
    filename: filename,
    mimetype: mimetype,
    encoding: args.gif ? "" : file.encoding,
    url: !args.gif ? result.Location : "",
    success: resultUploadDB,
  };

  return returnedFile;
};

export default uploadFileResolver;
