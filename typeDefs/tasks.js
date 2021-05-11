// add tasks
// delete tasks
// edit tasks
// list tasks
// search tasks
// filter tasks
// editTask(input: editTaskInput): Boolean!
// deleteTask(input: deleteTaskInput): Boolean!
import { gql } from "apollo-server-express";

export default gql`
  extend type Mutation {
    addTask(input: addTaskInput): AddTaskResponse!
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

// input editTaskInput {
//     _id: Int!
//     name: String
//     num: Int!
//     txt: String
//     img: String
//     opts: OptionInput
//     valid: String
//   }

//   input deleteTaskInput {
//     _id: Int!
//     num: Int!
//   }
