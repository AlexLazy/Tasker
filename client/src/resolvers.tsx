import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    me: User!
    isLoggedIn: Boolean!
    isNewAccountOpen: Boolean!
    error: Error!
  }

  extend type Error {
    open: Boolean!
    text: String!
  }
`;

export const resolvers = {};
