import React, { useContext } from 'react';
import { styled } from 'linaria/react';
import { atMediaQ } from '../util/style';
import { MediaQueryContext } from '../App';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* margin-top: auto; */
  font-weight: 300;

  ${atMediaQ.small} {
    padding: 15px;
    padding-top: 30px;
    font-size: 10px;
  }
  ${atMediaQ.medium} {
    padding: 30px;
    padding-top: 60px;
    font-size: 12px;
  }
  ${atMediaQ.large} {
    padding: 30px;
    padding-top: 60px;
    font-size: 12px;
  }
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContactLeft = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-right: 15px;
`;

const ContactRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  const { isSmall } = useContext(MediaQueryContext);
  return (
    <Container>
      {!isSmall && (
        <ContactContainer>
          <ContactLeft>
            <span>Deklan Webster</span>
            <span>deklanw@gmail.com</span>
          </ContactLeft>
          <ContactRight>
            <a href="https://github.com/deklanw">
              <img
                height="32"
                width="32"
                alt="Github logo"
                src="https://unpkg.com/simple-icons@latest/icons/github.svg"
              />
            </a>
          </ContactRight>
        </ContactContainer>
      )}
    </Container>
  );
};

export default Footer;
