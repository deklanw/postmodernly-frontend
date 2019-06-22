import React, { useContext } from 'react';
import { styled } from 'linaria/react';

import PostCreator from './creator/PostCreator';
import PostFeed from './feed/PostFeed';
import { atMediaQ } from '../util/style';
import { MediaQueryContext } from '../App';

const Container = styled.div`
  max-width: 1500px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  ${atMediaQ.small} {
    margin: 10px 0;
  }
  ${atMediaQ.medium} {
    margin: 30px 50px;
  }
  ${atMediaQ.large} {
    margin: 40px 50px;
  }
`;
const PrimaryGrid = () => {
  const { isLarge } = useContext(MediaQueryContext);

  return (
    <Container>
      <PostFeed />
      {isLarge ? <PostCreator /> : null}
    </Container>
  );
};

export default PrimaryGrid;
