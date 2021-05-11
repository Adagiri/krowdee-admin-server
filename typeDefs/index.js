import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import tasksTypeDefs from "./tasks.js";

const typeDefs = gql`
  scalar Date

  type Query {
    _: Int
  }

  type Mutation {
    _: Int
  }
`;

export default [
  typeDefs,
  userTypeDefs,
  tasksTypeDefs
];
