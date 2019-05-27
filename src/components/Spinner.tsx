import React from 'react';
import { styled } from 'linaria/react';

type ExpandAndContractProps = {
  dimension: number;
  margin: number;
};

const ExpandAndContract = styled.div<ExpandAndContractProps>`
  width: ${({ dimension }) => dimension}px;
  height: ${({ dimension }) => dimension}px;

  position: relative;
  margin: ${({ margin }) => margin}px auto;

  & > :first-of-type,
  & > :last-of-type {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;

    animation: bounce 2s infinite ease-in-out;

    @keyframes bounce {
      0%,
      100% {
        transform: scale(0);
      }
      50% {
        transform: scale(1);
      }
    }
  }

  & > :last-of-type {
    animation-delay: -1s;
  }
`;

export const ExpandAndContractSpinner: React.FC<ExpandAndContractProps> = ({
  dimension,
  margin
}) => (
  <ExpandAndContract dimension={dimension} margin={margin}>
    <div />
    <div />
  </ExpandAndContract>
);

export const CircleExpandAndDisappear = styled.div<{ dimension: number }>`
  width: ${({ dimension }) => dimension}px;
  height: ${({ dimension }) => dimension}px;
  margin: 100px auto;
  background-color: #333;

  border-radius: 100%;
  animation: expandAndDisappear 1.5s infinite ease-in-out;

  @keyframes expandAndDisappear {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
