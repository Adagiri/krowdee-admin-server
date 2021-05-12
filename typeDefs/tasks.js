import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getTasks(input: getTasksInput): [Task!]

    searchTasks(input: searchTasksInput): [Task!]
  }

  extend type Mutation {
    addTask(input: addTaskInput): AddTaskResponse!
    editTask(input: editTaskInput): AddTaskResponse!
    deleteTask(input: deleteTaskInput): Boolean!
  }

  input getTasksInput {
    cat: String
    lvl: String
    cursor: Int
    limit: Int
  }

  input searchTasksInput {
    txt: String!
    cat: String
    lvl: String
    cursor: Int
    limit: Int
  }

  input addTaskInput {
    txt: String!
    img: String
    opts: [optionInput]!
    valid: String!
    cat: String!
    lvl: String
    force: Boolean
  }

  input optionInput {
    _id: String!
    opt: String!
  }

  input editTaskInput {
    _id: ID!
    txt: String
    img: String
    opts: optionInput
    valid: String
    cat: String
    lvl: String
    force: Boolean
  }

  input deleteTaskInput {
    _id: ID!
  }

  type Task {
    _id: ID!
    txt: String!
    img: String
    opts: [Option]!
    valid: String!
    cat: String!
    lvl: String
  }

  type AddTaskResponse {
    taskToAdd: Task
    taskExist: [Task!]
    success: Boolean!
  }

  type Option {
    _id: String!
    opt: String!
  }
`;

//   input deleteTaskInput {
//     _id: Int!
//     num: Int!
//   }
