import styled from '@emotion/styled';

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: ${({ top }: any) => (top ? 'flex-start' : 'flex-end')};

  & button {
    font-family: 'Domaine Text Regular';
    font-size: 14px;
    width: 95px;
    height: 35px;
    border: none;
    border-radius: 2px;

    cursor: pointer;
  }
  /* 
  & button:nth-of-type(1) {
    color: black;
    background-color: white;
  } */

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
