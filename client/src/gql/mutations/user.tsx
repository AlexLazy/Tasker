import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login($id_token: String!) {
    login(id_token: $id_token)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      email
    }
  }
`;
