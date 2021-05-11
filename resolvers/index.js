import GraphQLDateTime from "graphql-iso-date";
import userResolvers from "./user.js";
import tasksResolvers from "./tasks.js";

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  userResolvers,
  tasksResolvers,
  customDateScalarResolver,
];
