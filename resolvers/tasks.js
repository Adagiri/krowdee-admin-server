import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const argsectID = mongodb.argsectID;
import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { admin, templateTasks } from "../database/utils/injector.js";

export default {
  Query: {
    getTasks: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { cursor=1, limit=20, ...rest } = input;
        let args = {};
        for (const key in rest) {
          if (rest[key] === null) {
            return;
          }
          args[key] = rest[key];
        }
        try {
          return await templateTasks.find({ ...args }).limit(cursor * limit).toArray()
        } catch (error) {
          throw error;
        }
      }
    ),

    searchTasks: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { cursor=1, limit=20, txt, ...rest } = input;
        let args = {};
        for (const key in rest) {
          if (rest[key] === null) {
            return;
          }
          args[key] = rest[key];
        }
        try {
          return await templateTasks.find({ txt: { $regex: `${txt}`, $options: "i" } ,...args }).limit(cursor * limit).toArray()
        } catch (error) {
          throw error;
        }
      }
    ),
  },

  Mutation: {
    addTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { force, ...rest } = input;

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
    editTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        let { force, _id, ...rest } = input;

        let taskExist = [];
        try {
          if (!force && input.txt) {
            taskExist = await templateTasks
              .find({ $text: { $search: `\"${input.txt}\"` } })
              .toArray();
          }
          //search if question has not been added before

          if (taskExist.length > 0) {
            return { taskToAdd: { ...rest }, taskExist, success: false };
          }
          //add question

          const editTask = await templateTasks.updateOne(
            { _id: argsectID(_id) },
            { $set: { ...rest } }
          );
          if (editTask.result.ok === 1) {
            return { success: true };
          }
        } catch (error) {
          throw error;
        }
      }
    ),

    deleteTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        let { _id } = input;
        try {
          const deleteTask = await templateTasks.deleteOne({
            _id: argsectID(_id),
          });
          if (deleteTask.result.ok === 1) {
            return true;
          }
        } catch (error) {
          throw error;
        }
      }
    ),
  },
};
