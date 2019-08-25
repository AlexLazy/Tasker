import gql from 'graphql-tag';

export const ADD_TASK = gql`
  mutation AddTask(
    $project_id: ID!
    $content: String!
    $price_total: String
    $price: String
  ) {
    createTask(
      project_id: $project_id
      content: $content
      price_total: $price_total
      price: $price
    ) {
      project {
        title
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $content: String!
    $price_total: String
    $price: String
    $status: TaskStatus
  ) {
    updateTask(
      id: $id
      content: $content
      price_total: $price_total
      price: $price
      status: $status
    ) {
      id
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;
