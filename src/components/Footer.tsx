import React from 'react';
import { styled } from 'linaria/react';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: center;
  align-items: center;
  margin: 80px 30px;
`;

const Footer = () => {
  return <Container />;
};

export default Footer;
