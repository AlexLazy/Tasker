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

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      title
      tasks {
        id
        content
        price_total
        price
        status
        updated_at
      }
    }
  }
`;
