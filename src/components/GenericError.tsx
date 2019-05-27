import React from 'react';
import { styled } from 'linaria/react';

import { ERROR_RED } from '../util/constants';

const Container = styled.div<{}>`
  padding: 50px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Spectral';
  font-size: 16px;
  color: ${ERROR_RED};
`;

const SpanX = styled.span`
  margin-right: 5px;
`;

const GenericError: React.FC<{}> = () => {
  return (
    <Container>
      <SpanX role="img" aria-label="Error">
        😰
      </SpanX>
      An unknown error occurred. Try refreshing.
    </Container>
  );
};

export default GenericError;
