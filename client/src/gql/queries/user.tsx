import gql from 'graphql-tag';

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      name
      email
      avatar
      role
    }
  }
`;

export const GET_USER_PROJECTS = gql`
  query GetCurrentUser {
    me {
      projects {
        id
        title
      }
    }
  }
`;
