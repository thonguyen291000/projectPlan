import { UNAUTHENTICATED } from "../../../../const/errors";

const transferWebRTCResolver = async (obj, { content, room }, context) => {
  if (!context.user) throw new Error(UNAUTHENTICATED);

  const webRTCData = {
    content,
    room,
  };

  // Notification new webRTC real-time
  context.pubsub.publish("NEW_WEBRTC", { data: webRTCData });

  return result;
};

export default transferWebRTCResolver;
