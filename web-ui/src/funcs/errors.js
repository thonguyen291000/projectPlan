export const translateErrorMessage = (message) => {
  switch (true) {
    case message.includes("500"):
      return "The server has problems. Please refresh the app!";
    case message.includes("400"):
      return "Something's wrong. Please try it again!";
    case message.includes("failed to fetch"):
      return "Something's wrong. Please try it again!";
    default:
      return message;
  }
};
