import { styled } from 'linaria/react';
import { atMediaQ } from '../../util/style';

export default styled.div`
  display: flex;
  justify-content: space-between;

  & button {
    font-family: inherit;
    border: none;
    border-radius: 2px;

    cursor: pointer;

    ${atMediaQ.small} {
      font-size: 13px;
      width: 90px;
      height: 25px;
    }
    ${atMediaQ.medium} {
      font-size: 14px;
      width: 110px;
      height: 35px;
    }
    ${atMediaQ.large} {
      font-size: 14px;
      width: 110px;
      height: 35px;
    }
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
