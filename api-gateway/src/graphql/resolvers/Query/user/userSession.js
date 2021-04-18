import {UNSUPPORTED_ARGUMENT} from "../../../../const/errors";

const userSessionResolver = async (obj, args, context) => {
  if (args.me !== true) throw new Error(UNSUPPORTED_ARGUMENT);
  return context.user
};

export default userSessionResolver;
