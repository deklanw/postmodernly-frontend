import React from 'react';

type Props = {
  color?: string;
  size: string;
};

const HeartOpenBook = ({ color, size }: Props) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 -36 464 464"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="m456 344h-212.640625c18.871094-19.351562 57.878906-32 100.640625-32 36 0 70.246094 9.058594 91.511719 24.214844l9.289062-13.015625c-24.234375-17.285157-60.96875-27.199219-100.800781-27.199219-15.246094-.027344-30.453125 1.507812-45.382812 4.578125 11.664062-4.796875 23.742187-8.527344 36.078124-11.144531 35.257813-7.488282 70.601563-5.738282 94.550782 4.664062l6.402344-14.671875c-27.296876-11.863281-65.296876-13.921875-104.257813-5.601562-44.191406 9.375-81.300781 30.410156-99.390625 55.425781-18.089844-25.015625-55.199219-46.074219-99.367188-55.464844-38.96875-8.289062-76.96875-6.222656-104.257812 5.597656l6.402344 14.675782c24-10.402344 59.3125-12.152344 94.550781-4.664063 12.339844 2.617188 24.414063 6.347657 36.078125 11.140625-14.941406-3.058594-30.15625-4.578125-45.40625-4.535156-39.832031 0-76.566406 9.914062-100.800781 27.199219l9.289062 13.027343c21.265625-15.167968 55.511719-24.226562 91.511719-24.226562 42.761719 0 81.769531 12.648438 100.640625 32h-212.640625c-4.417969 0-8 3.582031-8 8v32c0 4.417969 3.582031 8 8 8h448c4.417969 0 8-3.582031 8-8v-32c0-4.417969-3.582031-8-8-8zm-440 16h208v16h-208zm432 16h-208v-16h208zm0 0"
      />
      <path
        fill={color}
        d="m228.273438 255.082031c2.328124 1.226563 5.117187 1.226563 7.445312 0 6.386719-3.359375 156.28125-83.21875 156.28125-167.082031-.058594-48.578125-39.421875-87.9414062-88-88-28.710938-.113281-55.636719 13.90625-72 37.496094-16.363281-23.589844-43.289062-37.609375-72-37.496094-48.578125.0585938-87.941406 39.421875-88 88 0 83.863281 149.886719 163.722656 156.273438 167.082031zm-68.273438-239.082031c27.675781-.085938 52.917969 15.804688 64.800781 40.800781 1.488281 2.566407 4.234375 4.144531 7.199219 4.144531s5.710938-1.578124 7.199219-4.144531c14.550781-30.269531 48.105469-46.445312 80.847656-38.976562s55.964844 36.59375 55.953125 70.175781c0 67.542969-121.039062 138.113281-144 150.878906-22.984375-12.765625-144-83.277344-144-150.878906.046875-39.742188 32.253906-71.949219 72-72zm0 0"
      />
    </svg>
  );
};

export default HeartOpenBook;
