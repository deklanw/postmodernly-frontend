import React from 'react';
import { styled } from 'linaria/react';
import PostCreator from './creator/PostCreator';
import PostFeed from './feed/PostFeed';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  align-self: center;
  margin-top: 30px;
  align-items: start;

  grid-template-columns: repeat(24, 46px);
  grid-template-rows: 1fr;
  grid-column-gap: 12px;
`;

const PostCreatorContainer = styled.div`
  grid-column-start: 17;
  grid-column-end: span 8;
`;

const PrimaryGrid = () => {
  return (
    <Container>
      <Grid>
        <PostFeed />
        <PostCreatorContainer>
          <PostCreator />
        </PostCreatorContainer>
      </Grid>
    </Container>
  );
};

export default PrimaryGrid;
