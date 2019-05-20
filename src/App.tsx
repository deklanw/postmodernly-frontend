import React from 'react';
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import PrimaryGrid from './components/PrimaryGrid';
import Header from './components/Header';
import Register from './components/Register';
import Footer from './components/Footer';
import Login from './components/Login';
import Logout from './components/Logout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1;
`;

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'include'
    })
  ]),
  cache: new InMemoryCache()
});

const LoggedInContainer = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Route exact path="/" component={PrimaryGrid} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
      </Content>
      <Footer />
    </Container>
  );
};

const App = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Router>
            <LoggedInContainer />
          </Router>
        </ApolloHooksProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
