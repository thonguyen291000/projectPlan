import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Date

  type TypingData {
    room: String!
    user: String!
    typing: Boolean!
  }

  type RootRoom {
    _id: ID!
    name: String!
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    rooms: [Room]
    class: Class!
  }

  type Room {
    _id: ID!
    name: String!
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    users: [User!]
    rootRoom: RootRoom!
    avatar: String
    messages(offset: String, limit: Int): [Message!]
    status: String
    whoCreated: String
    oldName: String
    newestMessage: Message
    event: String
    newUsersAdded: [String]
  }

  type Message {
    _id: ID!
    content: String
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    filename: String
    mimetype: String
    encoding: String
    url: String
    seen: Boolean!
    user: User
    room: Room
    type: String!
    size: String
    usersSeenMessage: [String]
    replyToMessage: Message
    reacts: [String]
  }

  type User {
    email: String!
    _id: ID!
    name: String!
    role: String!
    createdAt: Date!
    updatedAt: Date!
    classes: [Class!]
    rooms(rootRoom: String, offset: String, limit: Int): [Room]
    messages: [Message!]
    token: String
    avatar: String
    status: String
    seenRooms: [String]
  }

  type UserSession {
    id: ID!
    _id: ID!
    user: User!
    expireAt: Date!
  }

  type Subject {
    _id: ID!
    name: String!
    description: String
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    terms: [Term!]
  }

  type Term {
    _id: ID!
    name: String!
    description: String
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    classes: [Class!]
    subject: Subject!
  }

  type Class {
    _id: ID!
    name: String!
    description: String
    createdAt: Date!
    deletedAt: Date!
    updatedAt: Date!
    rootRoom: RootRoom
    users: [User!]
    term: Term!
  }

  type Role {
    _id: ID!
    role: String!
    createdAt: Date!
  }

  type File {
    filename: String
    mimetype: String
    encoding: String
    url: String
    success: String
  }

  type WebRTC {
    content: String!
    room: String!
  }

  type DataJoinRoom {
    room: String
    userId: String
  }

  type NewRoomAvatarData {
    room: String
    url: String
    user: String
  }

  type RemoveUsersFromRoomData {
    room: String
    users: [String]
  }

  type Mutation {
    login(email: String!): User!
    logout(email: String!): User!
    createUser(
      email: String!
      password: String!
      name: String!
      role: String!
      classNames: [String!]
    ): User!
    updateUser(
      email: String!
      name: String!
      password: String!
      avatar: String!
      seenRooms: [String]
    ): User!
    updateUserToClass(email: String!, className: String!): User!
    deleteUser(email: String!): String!

    createUserSession(email: String!, password: String!): UserSession!
    deleteUserSession(sessionId: ID!): Boolean!

    createSubject(name: String!, description: String!): Subject!
    updateSubject(
      subject: String!
      name: String!
      description: String!
    ): Subject!
    deleteSubject(name: String!): String!

    createTerm(name: String!, subject: String!, description: String!): Term!
    updateTerm(term: String!, name: String!, description: String!): Term!
    deleteTerm(name: String!): String!

    createClass(name: String!, term: String!, description: String!): Class!
    updateClass(
      whichClass: String!
      name: String!
      description: String!
    ): Class!
    removeUsersFromClass(whichClass: String!, users: [String!]!): Class!
    deleteClass(name: String!): String!

    createRoom(
      name: String!
      description: String
      rootRoom: String!
      users: [String!]
      avatar: String
      whoCreated: String!
    ): Room
    addUsersToRoom(name: String!, rootRoom: String!, users: [String!]!): Room
    updateRoom(
      room: String!
      name: String!
      avatar: String
      description: String!
      event: String
    ): Room!
    deleteRoom(name: String!, whoDeleted: String!): String!

    createRootRoom(
      name: String!
      description: String
      presentClass: String!
    ): RootRoom!
    updateRootRoom(rootRoom: String!, name: String!): RootRoom!
    removeUsersFromRoom(room: String!, users: [String!]!): Room!
    deleteRootRoom(name: String!): String!

    createMessage(content: String!, room: String!, replyToMessage: String): Message!
    updateMessage(
      message: ID!
      content: String
      seen: String
      fileName: String
      mimetype: String
      encoding: String
      url: String
      usersSeenMessage: [String]
      reacts: [String]
    ): Message!
    deleteMessage(message: ID!): String!
    setTyping(room: String!, user: String!, typing: Boolean!): Boolean!

    uploadFile(
      file: Upload
      idOrEmail: String!
      messageOrUser: String!
      room: String
      size: String
      user: String
      replyToMessage: String
      gif: String
    ): File!

    userJoinRoom(room: String, userId: String): String
    userOutRoom(room: String, userId: String): String
  }

  type Query {
    rootRooms: [RootRoom!]
    rootRoom(name: String!): RootRoom!

    rooms(names: [String!]): [Room!]
    room(name: String!): Room!

    userSession(me: Boolean!): UserSession
    users: [User!]
    user(email: String!): User

    subjects: [Subject!]
    subject(name: String!): Subject

    terms: [Term!]
    term(name: String!): Term

    classes: [Class!]
    class(name: String!): Class

    messages: [Message!]
    messagesForRoom(room: String!): [Message!]
    message(messageId: ID!): Message

    roles: [Role!]
  }

  type Subscription {
    newMessage: Message!
    updateMessage: Message!
    deleteMessage: Message!
    newUserOnline: [String]
    newUsersJoinRoom: Room!
    newRoom: Room! 
    newWebRTC: WebRTC!
    typing: TypingData!
    joinRoom: DataJoinRoom
    outRoom: DataJoinRoom
    newRoomAvatar: NewRoomAvatarData
    removeUsersFromRoom: RemoveUsersFromRoomData
    userOnline: User!
    userOffline: User!
    updateRoom: Room!
    newUserAvatar: User!
  }
`;

export default typeDefs;
