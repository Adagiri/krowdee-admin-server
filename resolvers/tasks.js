import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { admin, templateTasks } from "../database/utils/injector.js";

export default {
  Query: {},

  Mutation: {
    addTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        let { force, ...rest } = input;

        let taskExist = [];
        try {
          if (!force) {
            taskExist = await templateTasks
              .find({ $text: { $search: `\"${input.txt}\"` } })
              .toArray();
          }
          //search if question has not been added before

          if (taskExist.length > 0) {
            return { taskToAdd: { ...rest }, taskExist, success: false };
          }
          //add question

          const newTask = await templateTasks.insertOne({ ...rest });
          if (newTask.result.ok === 1) {
            return { success: true };
          }
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
