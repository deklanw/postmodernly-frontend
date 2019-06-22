import React, { useContext, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import { Link } from 'react-router-dom';

import { useMeQuery } from '../generated/graphql';
import { atMediaQ } from '../util/style';
import { MediaQueryContext } from '../App';
import { useOutsideClick } from '../util/util';
import MenuIcon from '../assets/svg/menu.svg';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${atMediaQ.small} {
    margin: 15px;
  }
  ${atMediaQ.medium} {
    margin: 20px 30px;
  }
  ${atMediaQ.large} {
    margin: 20px 30px;
  }
`;

const Logo = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Heading = styled(Link)`
  font-weight: 500;
  color: #333333;
  text-decoration: none;

  ${atMediaQ.small} {
    font-size: 24px;
  }
  ${atMediaQ.medium} {
    font-size: 30px;
  }
  ${atMediaQ.large} {
    font-size: 36px;
  }
`;

const Subheading = styled.span`
  font-weight: 500;
  color: #4d4d4d;

  ${atMediaQ.small} {
    font-size: 12px;
    margin-left: 5px;
    margin-top: 2px;
  }
  ${atMediaQ.medium} {
    font-size: 16px;
    margin-left: 4px;
    margin-top: 4px;
  }
  ${atMediaQ.large} {
    font-size: 18px;
    margin-left: 5px;
    margin-top: 5px;
  }
`;

const Links = styled.span`
  display: flex;
  justify-content: space-between;

  ${atMediaQ.small} {
    height: 250px;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
  }

  ${atMediaQ.medium} {
    flex-direction: row;
    width: 50%;
    max-width: 450px;
  }
  ${atMediaQ.large} {
    flex-direction: row;
    width: 40%;
    max-width: 600px;
  }
`;

const LinkItem = styled(Link)`
  font-weight: 500;
  font-size: 20px;
  text-decoration: none;
  color: #333333;
`;

const SideDrawerContainer = styled.div<{ isOpen: boolean }>`
  height: 100%;
  background: white;
  box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0px;
  width: 60%;
  max-width: 400px;
  min-width: 300px;
  z-index: 200;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateX(0%)' : 'translateX(100%)'};
  transition: transform 0.3s ease-out;
`;

const UnstyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const Header = () => {
  const { data, error, loading } = useMeQuery();
  const { isSmall } = useContext(MediaQueryContext);
  const [isOpen, setIsOpen] = useState(false);
  const node = useOutsideClick(() => setIsOpen(false));
  const swipeHandlers = useSwipeable({
    onSwipedRight: swipeData => {
      setIsOpen(false);
    }
  });

  const flipIsOpen = () => setIsOpen(b => !b);

  const loggedOut = !(data && data.me);

  let content;

  if (loggedOut && !loading) {
    content = (
      <>
        <LinkItem to="/">Home</LinkItem>
        <LinkItem to="/about">About</LinkItem>
        <LinkItem to="/register">Sign-up</LinkItem>
        <LinkItem to="/login">Login</LinkItem>
      </>
    );
  }
  if (!loggedOut) {
    content = (
      <>
        <LinkItem to="/">Home</LinkItem>
        <LinkItem to="/about">About</LinkItem>
        <LinkItem to="/logout">Logout</LinkItem>
      </>
    );
  }

  return (
    <Container>
      <Logo>
        <Heading to="/">Postmodernly</Heading>
        {!isSmall && <Subheading>Digital cut-ups</Subheading>}
      </Logo>
      {!isSmall ? (
        <Links>{content}</Links>
      ) : (
        <>
          <div {...swipeHandlers}>
            <SideDrawerContainer isOpen={isOpen} ref={node}>
              <Links>{content}</Links>
            </SideDrawerContainer>
          </div>
          <UnstyledButton type="button" onClick={flipIsOpen}>
            <img alt="Menu icon" src={MenuIcon} width="30px" />
          </UnstyledButton>
        </>
      )}
    </Container>
  );
};

export default hot(Header);
