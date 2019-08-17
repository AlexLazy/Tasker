import gql from 'graphql-tag';

export const GET_PROJECT_USERS = gql`
  mutation GetProjectUsers($id: ID!) {
    project(id: $id) {
      users {
        name
        email
        avatar
      }
    }
  }
`;
