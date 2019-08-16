import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { BrowserRouter } from 'react-router-dom';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useApolloClient, useQuery } from '@apollo/react-hooks';
import { GET_CURRENT_USER, IS_LOGGED_IN } from './gql/queries';
import { resolvers, typeDefs } from './resolvers';

import { FullPageLoading } from './components';
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

const IsLoggedIn = () => {
  const client = useApolloClient();
  const { data: login } = useQuery(IS_LOGGED_IN);
  const { data, loading } = useQuery(GET_CURRENT_USER);

  if (loading) return <FullPageLoading />;
  if (data && data.me) {
    client.writeData({
      data: {
        me: data.me,
        isLoggedIn: true
      }
    });
  }
  return login.isLoggedIn ? <Pages /> : <Login />;
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <IsLoggedIn />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
);
