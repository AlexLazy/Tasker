import gql from 'graphql-tag';

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject($title: String!) {
    createProject(title: $title) {
      title
    }
  }
`;

export const ADD_USER_TO_PROJECT = gql`
  mutation AddUserToProject($project_id: Int!, $user_id: Int!) {
    addUserToProject(project_id: $project_id, user_id: $user_id) {
      users {
        id
        name
        email
        avatar
        role
      }
    }
  }
`;

export const REMOVE_USER_TO_PROJECT = gql`
  mutation RemoveUserToProject($project_id: Int!, $user_id: Int!) {
    removeUserFromProject(project_id: $project_id, user_id: $user_id) {
      title
    }
  }
`;
