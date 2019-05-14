import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

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
  font-family: 'Domaine Text Medium';
  font-size: 32px;
  color: #333333;
  text-decoration: none;
`;

const Subheading = styled.span`
  font-family: 'Domaine Text Medium';
  font-size: 16px;
  color: #4d4d4d;

  margin-left: 5px;
  margin-top: 5px;
`;

const Links = styled.span`
  display: flex;
  flex-direction: horizontal;
  justify-content: space-between;

  width: 400px;
`;

const LinkItem = styled(Link)`
  font-family: 'Domaine Text Medium';
  font-size: 20px;
  text-decoration: none;
  color: #333333;
`;

const Header = () => {
  return (
    <Container>
      <Logo>
        <Heading to="/">Post Postmodernly</Heading>
        <Subheading>Digital cut-ups</Subheading>
      </Logo>
      <Links>
        <LinkItem to="/register">Sign-up</LinkItem>
        <LinkItem to="/login">Login</LinkItem>
        <LinkItem to="/">About</LinkItem>
      </Links>
    </Container>
  );
};

export default Header;
