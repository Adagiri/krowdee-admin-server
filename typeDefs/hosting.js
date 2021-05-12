import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    hosted: Boolean
  }

  extend type Mutation {
    host(input: hostInput): Boolean!
    unHost(input: unHostInput): Boolean!
  }

  input hostInput {
    name: String!
    summary: String
    img: String
    tags: [String!]
    cat: String!
    mode: String!
    time: Int
    tasks: [tasksInput!]!
    totalTasks: Int!
    limit: Int!
    start: String!
    end: String!
    valids: [validsInput]
    ranked: Boolean!
    lvl: String!
  }

  input tasksInput {
    num: Int!
    txt: String!
    img: String
    opts: [optionInput!]
    time: String
  }

  input validsInput {
    num: Int!
    _id: String!
  }

  input unHostInput {
    _id: ID!
    name: String!
    reason: String
  }
`;
