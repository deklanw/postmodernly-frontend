import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: space-between;
  align-items: center;
  margin: 15px 30px;
`;

const Footer = () => {
  return <Container>Stuff goes here</Container>;
};

export default Footer;
