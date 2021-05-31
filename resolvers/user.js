import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { admin } from "../database/utils/injector.js";
import { getSignedUrl } from "../aws/index.js";

export default {
  Query: {
    user: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        try {
          const user = await admin.findOne({ _id: ObjectID(userId) });

          if (!user) {
            throw new Error("user not found");
          }

          return user;
        } catch (error) {
          throw error;
        }
      }
    ),

  
  },

  Mutation: {
    login: async (_, { input },{response}) => {
      const { username, password } = input;
      try {
        const user = await admin.findOne({ username });
        if (!user) {
          throw new Error("user does not exist");
        }
        if (user.password !== password) {
          throw new Error("incorrect password");
        }

        const secret = process.env.JWT_SECRET || "syrupsibridserver";
        const token = await jwt.sign({ userId: user._id }, secret, {
          expiresIn: "7d",
        });

        response.cookie('httptoken', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          
        });
        return { token, user };
      } catch (error) {
        throw error;
      }
    },
  },
};
