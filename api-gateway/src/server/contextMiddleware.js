import UsersService from "../adapters/usersService";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../const/token";
import { PubSub } from "apollo-server";

const pubsub = new PubSub();

//s3 bucket
import aws from "aws-sdk";
import {
  accessKeyId,
  region,
  secretAccessKey,
} from "../configAWS/credentials.json";

aws.config.update({
  accessKeyId,
  secretAccessKey,
  region,
});

const s3 = new aws.S3({ region });

module.exports = async (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });

    const userObj = await UsersService.getUserByEmail({email: context.user.email});

    context.user = {
      ...context.user,
      ...userObj,
    };
  }

  context.pubsub = pubsub;

  context.s3 = s3;

  return context;
};
