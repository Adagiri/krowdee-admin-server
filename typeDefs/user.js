import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    user: User!
  }

  extend type Mutation {
    login(input: loginInput): LoginOutput
  }

  input loginInput {
    username: String!
    password: String!
  }

  type LoginOutput {
    user: User!
    token: String!
  }

  type User {
    _id: ID!
    username: String!
  }
`;
