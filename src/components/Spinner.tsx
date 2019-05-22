import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

const expandAndDisappear = keyframes`
  0% { 
    transform: scale(0);
  } 100% {
    transform: scale(1.0);
    opacity: 0;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(0.0)
  }
  50% {
    transform: scale(1.0)
  }
`;

const ExpandAndContract = styled.div<{ dimension: number }>`
  width: ${({ dimension }) => dimension}px;
  height: ${({ dimension }) => dimension}px;

  position: relative;
  margin: 100px auto;

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

    animation: ${bounce} 2s infinite ease-in-out;
  }

  & > :last-of-type {
    animation-delay: -1s;
  }
`;

export const ExpandAndContractSpinner = ({
  dimension
}: {
  dimension: number;
}) => (
  <ExpandAndContract dimension={dimension}>
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
  animation: ${expandAndDisappear} 1.5s infinite ease-in-out;
`;
