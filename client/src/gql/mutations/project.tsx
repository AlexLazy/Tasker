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
