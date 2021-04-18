const typingResolver = async (obj, { room, user, typing }, context) => {
  const typingData = {
    room,
    user,
    typing,
  };

  // Notification typing real-time
  context.pubsub.publish("TYPING", { typing: typingData });

  return typing
};

export default typingResolver;
