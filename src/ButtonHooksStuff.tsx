import React, { useState } from 'react';
import styled from '@emotion/styled';

const Button = styled.button<{ fontSize: number }>`
  width: 150px;
  height: 50px;
  background-color: #f2f2f2;
  color: black;
  font-family: 'Spectral';
  font-weight: 'light';
  font-size: ${({ fontSize }) => fontSize};
`;

const ResetButton = styled.button`
  font-family: 'Spectral';
  font-weight: medium;
  color: black;
  width: 200px;
  height: 50px;
  border-radius: 100px;
`;

const ButtonHookStuff = () => {
  const [count, setCounter] = useState(0);
  const increment = () => setCounter(count + 1);
  const reset = () => setCounter(0);

  return (
    <div>
      <Button type="button" onClick={increment} fontSize={30}>
        Click me
      </Button>
      <span>
        Count:
        {count}
      </span>
      <ResetButton type="button" onClick={reset}>
        Reset
      </ResetButton>
    </div>
  );
};

export default ButtonHookStuff;
