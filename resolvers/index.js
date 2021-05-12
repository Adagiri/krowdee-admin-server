import GraphQLDateTime from "graphql-iso-date";
import userResolvers from "./user.js";
import tasksResolvers from "./tasks.js";
import hostingResolvers from "./hosting.js";

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  userResolvers,
  tasksResolvers,
  hostingResolvers,
  customDateScalarResolver,
];
