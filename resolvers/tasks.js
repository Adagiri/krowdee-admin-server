import jwt from "jsonwebtoken";

import mongodb from "mongodb";
const ObjectID = mongodb.ObjectID;

import { combineResolvers } from "graphql-resolvers";
import { isAuthenticated, verifyObjectId } from "./middleware/index.js";
import { admin, library } from "../database/utils/injector.js";
import { getSignedUrl } from "../aws/index.js";

export default {
  Query: {
    getTasks: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { cat = null, txt = null, cursor, limit = 20 } = input;
        let args = {};
        if (cat) args.cat = cat.toLowerCase();

        // console.log(cat.toLowerCase())
        try {
          if (txt) {
            return await library
              .find({ txt: { $regex: `${txt}`, $options: "i" }, ...args, cat })
              .limit(cursor * limit)
              .toArray();
          } else {
            return await library
              .find(args)
              .limit(cursor * limit)
              .toArray();
          }
        } catch (error) {
          throw error;
        }
      }
    ),

    getSignedUrl: combineResolvers(isAuthenticated, async (_, { input }) => {
      const { _id, contentType } = input;
      try {
        const { url, key } = await getSignedUrl(_id, contentType);

        return {
          url,
          key,
        };
      } catch (error) {
        throw error;
      }
    }),
  },

  Mutation: {
    addTask: combineResolvers(
      isAuthenticated,
      async (_, { input }, { userId }) => {
        const { force, cat, ...rest } = input;
        console.log(input);
        let taskExist = [];
        try {
          if (force === false) {
            taskExist = await library
              .find({ $text: { $search: `\"${input.txt}\"` } })
              .toArray();
          }
          //search if question has not been added before

          if (taskExist.length > 0) {
            return {
              taskExist,
              currentTask: input,
              success: false,
            };
          }
          //add question

          const newTask = await library.insertOne({
            ...rest,
            cat: cat.map((cat) => cat.toLowerCase()),
            date: new Date(),
          });
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
        console.log(_id);
        let taskExist = [];
        try {
          if (force === false && input.txt !== input.prevTxt) {
            taskExist = await library
              .find({ $text: { $search: `\"${input.txt}\"` } })
              .toArray();
          }
          //search if question has not been added before
          console.log(taskExist);
          if (taskExist.length > 0) {
            return {
              taskExist,
              currentTask: input,
              success: false,
            };
          }
          //add question

          const editTask = await library.updateOne(
            { _id: ObjectID(_id) },
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
          const deleteTask = await library.deleteOne({
            _id: ObjectID(_id),
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
