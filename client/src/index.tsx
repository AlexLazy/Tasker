import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useApolloClient, useQuery } from '@apollo/react-hooks';
import { GET_CURRENT_USER, IS_LOGGED_IN } from './gql/queries';
import { resolvers, typeDefs } from './resolvers';
import gql from 'graphql-tag';

import Snackbar from '@material-ui/core/Snackbar';

import FullPageLoading from './components/FullPageLoading';
import Pages from './pages';
import Login from './pages/Login';

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:8000/graphql',
    headers: {
      authorization: localStorage.getItem('token') || '',
      'client-name': 'Tasker [web]',
      'client-version': '0.0.1'
    }
  }),
  resolvers,
  typeDefs
});

cache.writeData({
  data: {
    error: {
      __typename: 'error',
      text: '',
      open: false
    }
  }
});

export const IS_ERROR = gql`
  query errorHandle {
    error @client {
      text
      open
      __typename
    }
  }
`;

const IsLoggedIn = () => {
  const client = useApolloClient();
  const { data: error } = useQuery(IS_ERROR);
  const { open, text } = error.error;
  const { data: login } = useQuery(IS_LOGGED_IN);
  const { data, loading } = useQuery(GET_CURRENT_USER);

  const handleClose = () => {
    client.writeData({
      data: {
        error: {
          __typename: 'error',
          text: '',
          open: false
        }
      }
    });
  };

  if (loading) return <FullPageLoading />;
  if (data && data.me) {
    client.writeData({
      data: {
        me: data.me,
        isLoggedIn: true
      }
    });
  }
  return (
    <Fragment>
      {login.isLoggedIn ? <Pages /> : <Login />}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={text}
      />
    </Fragment>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <IsLoggedIn />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);
