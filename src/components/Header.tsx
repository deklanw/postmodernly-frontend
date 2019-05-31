import React from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import { Link } from 'react-router-dom';

import { useMeQuery } from '../generated/graphql';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 30px;
`;

const Logo = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Heading = styled(Link)`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 36px;
  color: #333333;
  text-decoration: none;
`;

const Subheading = styled.span`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 18px;
  color: #4d4d4d;

  margin-left: 5px;
  margin-top: 5px;
`;

const Links = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 400px;
`;

const LinkItem = styled(Link)`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 20px;
  text-decoration: none;
  color: #333333;
`;

const Header = () => {
  const { data, error, loading } = useMeQuery();

  const loggedOut = !(data && data.me);

  let content;

  if (loggedOut && !loading) {
    content = (
      <>
        <LinkItem to="/register">Sign-up</LinkItem>
        <LinkItem to="/login">Login</LinkItem>
      </>
    );
  }
  if (!loggedOut) {
    content = (
      <>
        <LinkItem to="/">{data!.me!.email}</LinkItem>
        <LinkItem to="/logout">Logout</LinkItem>
      </>
    );
  }

  return (
    <Container>
      <Logo>
        <Heading to="/">Postmodernly</Heading>
        <Subheading>Digital cut-ups</Subheading>
      </Logo>
      <Links>
        <LinkItem to="/">About</LinkItem>
        {content}
      </Links>
    </Container>
  );
};

export default hot(Header);
