import React from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import PrimaryGrid from './components/PrimaryGrid';
import Header from './components/Header';
import Register from './components/Register';
import Footer from './components/Footer';
import Login from './components/Login';

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
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

const App = () => {
  return (
    <>
      <Global
        styles={css`
          @font-face {
            font-family: 'Domaine Text Light Italic';
            src: url('/fonts/Domaine Text Light Italic.otf');
          }
          @font-face {
            font-family: 'Domaine Text Light';
            src: url('/fonts/Domaine Text Light.otf');
          }
          @font-face {
            font-family: 'Domaine Text Regular';
            src: url('/fonts/Domaine Text Regular.otf');
          }
          @font-face {
            font-family: 'Domaine Text Medium';
            src: url('/fonts/Domaine Text Medium.otf');
          }
          body {
            margin: 0;
          }
          html {
            box-sizing: border-box;
          }
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }
        `}
      />
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Router>
            <Container>
              <Header />
              <Content>
                <Route exact path="/" component={PrimaryGrid} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </Content>
              <Footer />
            </Container>
          </Router>
        </ApolloHooksProvider>
      </ApolloProvider>
    </>
  );
};

export default App;
