import React, { useContext } from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import PrimaryGrid from './components/PrimaryGrid';
import Header from './components/Header';
import Register from './components/forms/Register';
import Footer from './components/Footer';
import Login from './components/forms/Login';
import Logout from './components/Logout';
import ConfirmUser from './components/ConfirmUser';
import About from './components/About';
import ChangePassword from './components/forms/ChangePassword';
import ResendConfirmation from './components/forms/ResendConfirmation';
import ForgotPassword from './components/forms/ForgotPassword';
import { useMyMediaQueries } from './util/util';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

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
    link
  ]),
  cache: new InMemoryCache()
});

export const MediaQueryContext = React.createContext({
  isSmall: true,
  isMedium: false,
  isLarge: false
});

const SiteContent = () => {
  return (
    <Container>
      <Header />
      <Content>
        <Route exact path="/" component={PrimaryGrid} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/about" component={About} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/resend-confirmation" component={ResendConfirmation} />
        <Route path="/confirm-user/:token" component={ConfirmUser} />
        <Route path="/change-password/:token" component={ChangePassword} />
      </Content>
      <Footer />
    </Container>
  );
};

const App = () => {
  const { isSmall, isMedium, isLarge } = useMyMediaQueries();
  return (
    <MediaQueryContext.Provider value={{ isSmall, isMedium, isLarge }}>
      <ApolloHooksProvider client={client}>
        <Router>
          <SiteContent />
        </Router>
      </ApolloHooksProvider>
    </MediaQueryContext.Provider>
  );
};

export default hot(App);
