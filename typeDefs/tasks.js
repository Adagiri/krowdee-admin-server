import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getTasks(input: getTasksInput): [Task!]
    getSignedUrl(input: getSignedUrlInput): GetSignedUrlOutput!
  }

  extend type Mutation {
    addTask(input: addTaskInput): AddTaskResponse!
    editTask(input: editTaskInput): AddTaskResponse!
    deleteTask(input: deleteTaskInput): Boolean!
  }

  input getTasksInput {
    cat: String
    cursor: Int
    limit: Int
    txt: String
  }

  input addTaskInput {
    author: String!
    txt: String!
    exp: String
    ref: String
    img: String
    opts: [optionInput]!
    valid: String!
    cat: [String!]!
    force: Boolean
  }

  input optionInput {
    _id: String!
    opt: String!
  }

  input editTaskInput {
    _id: ID!
    author: String
    txt: String
    exp: String
    ref: String
    prevTxt: String!
    img: String
    opts: [optionInput]
    valid: String
    cat: [String!]
    force: Boolean
  }

  input deleteTaskInput {
    _id: ID!
  }

  type Task {
    _id: ID!
    author: String!
    txt: String!
    img: String
    opts: [Option]!
    valid: String!
    cat: [String!]!
    exp: String
    ref: String
    date: String!
  }

  type AddTaskResponse {
    taskExist: [Task!]
    success: Boolean!
    currentTask: Task
  }

  type Option {
    _id: String!
    opt: String!
  }

  input getSignedUrlInput {
    _id: String!
    contentType: String!
  }

  type GetSignedUrlOutput {
    url: String!
    key: String!
  }
`;

//   input deleteTaskInput {
//     _id: Int!
//     num: Int!
//   }
