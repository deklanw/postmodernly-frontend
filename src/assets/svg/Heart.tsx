import React from 'react';
import { styled } from 'linaria/react';

const MyPath = styled.path`
  text-indent: 0;
  text-transform: none;
  direction: ltr;
  block-progression: tb;
  baseline-shift: baseline;
  color: #000000;
  enable-background: accumulate;
`;

const Heart: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 125"
      fill="black"
    >
      <g transform="translate(0,-952.36218)">
        <MyPath
          d="m 29.216701,964.37418 c -5.9464,0 -11.8793,2.2939 -16.406301,6.84375 -9.0540001,9.09969 -9.0428001,23.83151 0,32.93747 l 35.031301,35.3125 a 3.0003,3.0003 0 0 0 4.25,0 c 11.6944,-11.7533 23.3994,-23.4966 35.0937,-35.25 9.054,-9.09965 9.054,-23.86904 0,-32.96872 -9.0539,-9.09968 -23.7896,-9.09977 -32.8437,0 l -4.3126,4.375 -4.375,-4.40625 c -4.527,-4.54984 -10.4911,-6.84375 -16.4374,-6.84375 z m 0,5.9375 c 4.3875,0 8.7961,1.71652 12.1874,5.125 l 6.5,6.53125 a 3.0003,3.0003 0 0 0 4.25,0 l 6.4376,-6.5 c 6.7828,-6.81709 17.561,-6.81696 24.3437,0 6.7828,6.81696 6.7828,17.68304 0,24.5 -10.9881,11.04357 -21.9806,22.11267 -32.9687,33.15627 l -32.9063,-33.18752 c -6.778601,-6.82605 -6.782801,-17.68305 0,-24.5 3.3913,-3.40847 7.7687,-5.125 12.1563,-5.125 z"
          fillOpacity="1"
          stroke="none"
          marker="none"
          visibility="visible"
          display="inline"
          overflow="visible"
        />
      </g>
    </svg>
  );
};

export default Heart;
