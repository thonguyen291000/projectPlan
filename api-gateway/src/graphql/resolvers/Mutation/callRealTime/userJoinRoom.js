const userJoinRoomResolver = async (root, args, { pubsub }) => {
    await pubsub.publish("JOIN_ROOM", {
      joinRoom: {
        room: args.room,
        userId: args.userId,
      },
    });

    return "String";
  };

export default userJoinRoomResolver;
