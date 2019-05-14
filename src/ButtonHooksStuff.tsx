import React, { useState } from 'react';
import styled from '@emotion/styled';

const Button = styled.button<{ fontSize: number }>(
  {
    width: '150px',
    height: '50px',
    backgroundColor: '#F2F2F2',
    color: 'black',
    fontFamily: 'Domaine Text Light'
  },
  ({ fontSize }) => ({
    fontSize
  })
);

const ResetButton = styled.button`
  font-family: 'Domaine Text Medium';
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
