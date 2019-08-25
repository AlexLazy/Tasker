import gql from 'graphql-tag';

export const IS_NEW_ACCOUNT_OPEN = gql`
  query IsNewAccountOpen {
    isNewAccountOpen @client
  }
`;

export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export const GET_LOCAL_CURRENT_USER = gql`
  query GetLocalCurrentUser {
    me @client {
      name
      email
      avatar
      role
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      avatar
      role
    }
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
  query GetUserProjects {
    me {
      role
      projects {
        id
        title
        users {
          id
          name
          email
          avatar
        }
        tasks {
          price
          price_total
        }
      }
    }
  }
`;

export const GET_USER_TASKS = gql`
  query GetUserTasks {
    me {
      projects {
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
  }
`;
