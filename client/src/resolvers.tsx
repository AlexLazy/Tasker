import gql from 'graphql-tag';

export const typeDefs = gql`
  extend type Query {
    me: User!
    isLoggedIn: Boolean!
  }
`;

export const resolvers = {};
