import React from 'react';
import styled from '@emotion/styled';
import PostCreator from './PostCreator';
import PostFeed from './PostFeed';

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
  justify-content: center;
  margin: 15px 30px;
`;

// factor out 100 margin top?
const Grid = styled.div`
  display: grid;
  align-self: center;
  margin-top: 100px;

  grid-template-columns: repeat(24, 40px);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
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
