import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: center;
  align-items: center;
  margin: 30px 30px;
`;

const Footer = () => {
  return (
    <Container>
      <div>Stuff goes here</div>
    </Container>
  );
};

export default Footer;
