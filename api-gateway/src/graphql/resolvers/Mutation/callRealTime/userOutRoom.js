const userOutRoomResolver = async (root, args, { pubsub }) => {
  await pubsub.publish("OUT_ROOM", {
    outRoom: {
      room: args.room,
      userId: args.userId,
    },
  });

  return "String";
};

export default userOutRoomResolver;
