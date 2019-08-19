import gql from 'graphql-tag';

export const GET_PROJECT_AUTHOR = gql`
  query GetProjectAuthor($id: ID!) {
    project(id: $id) {
      author {
        id
      }
    }
  }
`;
