import { styled } from 'linaria/react';

export default styled.div`
  display: flex;
  justify-content: space-between;

  & button {
    font-family: 'Spectral';
    font-size: 14px;
    width: 110px;
    height: 35px;
    border: none;
    border-radius: 2px;

    cursor: pointer;
  }

  & button:disabled {
    opacity: 0.5;
  }

  & button:nth-of-type(1) {
    color: black;
    background-color: white;
    border: 1px solid black;
  }

  & button:nth-of-type(2) {
    color: white;
    background-color: #535353;
  }
`;