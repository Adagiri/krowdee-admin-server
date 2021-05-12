import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { admin, discussions, notifications, open, users } from "../database/utils/injector.js";

export default {
  Query: {},

  Mutation: {
    host: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { start } = input;
        const _id = ObjectID();

        try {
          const promises = [
            open.insertOne({
              _id,
              ...input,
              host: { name: "Krowdee", _id: "krowdeeadmin" },
              discussion: true,
              type: "open",
            }),
            discussions.insertOne({ contestId: _id, start }),
          ];
          // HOST THE open CONTEST, OPEN DISCUSSION & UPDATE USER DOC
          await Promise.all(promises);
          return true;
        } catch (error) {
          throw error;
        }
      }
    ),

    unHost: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { reason, name, _id } = input;
        try {
          const contest = await open.findOne({ _id: ObjectID(_id) });
          if (!contest) {
            throw new Error("contest not found");
          }

          if (contest.start < new Date()) {
            throw new Error("Contest already started");
          } else {
            if (!contest.participants || contest.participants.length === 0) {
              const promises = [
                open.deleteOne({ _id: ObjectID(_id) }),
                discussions.deleteOne({ contestId: ObjectID(_id) }),
              ];
              await Promise.all(promises);
            } else {
              const participants = contest.participants.map(
                (participant) => participant._id
              );
              // HOST THE open CONTEST, OPEN DISCUSSION & UPDATE USER DOC
              const promises = [
                notifications.insertOne({
                  to: participants,
                  message: reason
                    ? `${name} was cancelled because ${reason}`
                    : `${name} was cancelled`,
                  ref: null,
                  date: new Date(),
                }),

                users.updateMany(
                  { _id: { $in: participants } },
                  {
                    $inc: { notify: 1 },
                    $pull: { joined: { _id: ObjectID(_id) } },
                  }
                ),

                open.deleteOne({ _id: ObjectID(_id) }),
                discussions.deleteOne({ contestId: ObjectID(_id) }),
              ];

              await Promise.all(promises);
            }
          }

          return true;
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
