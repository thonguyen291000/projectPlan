import * as Query from "./Query";
import * as Mutation from "./Mutation";
import * as Subscription from "./Subscription";
import UserSession from "./UserSession";
import Subject from "./Subject";
import Term from "./Term";
import Class from "./Class";
import User from "./User";
import Message from "./Message";
import Room from "./Room";
import RootRoom from "./RootRoom";

const resolvers = {
  Query,
  Mutation,
  Subscription,
  UserSession,
  Subject,
  Term,
  Class,
  User,
  Message,
  Room,
  RootRoom,
};

export default resolvers;
