const { gql } = require('apollo-server')

const typeDefs = gql`
  directive @auth on OBJECT

  scalar Date

  enum TaskStatus {
    OPENED
    CHECKING
    CLOSED
  }

  type AuthenticationResult {
    message: String!
    userInfo: User!
    token: String!
  }

  type RemoveResult {
    message: String!
    id: ID!
  }

  type ProjectResult {
    message: String!
    project: Project!
  }

  type TaskResult {
    message: String!
    task: Task!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String!
  }

  type Project {
    id: ID!
    authorId: ID!
    title: String!
    users: [User]
    tasks: [Task]
  }

  type Task {
    id: ID!
    authorId: ID!
    content: String!,
    price: Int,
    priceTotal: Int,
    status: TaskStatus
    updatedAt: Date
  }

  type Query @auth {
    users: [User]
    projects: [Project]
    project(id: ID!): Project
    tasks: [Task]
  }

  type Mutation @auth {
    login(id_token: String!): AuthenticationResult
    addProject(title: String!): ProjectResult
    removeProject(id: ID!): ProjectResult
    addUserToProject(projectId: ID! userId: ID!): ProjectResult
    removeUserFromProject(projectId: ID! userId: ID!): ProjectResult
    addTask(projectId: ID! content: String! price: Int priceTotal: Int): TaskResult
    updateTask(id: ID! content: String! price: Int! priceTotal: Int! status: TaskStatus!): TaskResult
    removeTask(id: ID!): TaskResult
  }
`;

module.exports = {
  typeDefs
}