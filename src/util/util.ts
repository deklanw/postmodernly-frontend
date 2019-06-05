import { StructError } from 'superstruct';
import { useRef, useEffect } from 'react';

import { HIGHLIGHT_COLOR_1, HIGHLIGHT_COLOR_2 } from './constants';

export const superstructToFormik = (e: StructError) => {
  const errors: { [key: string]: string } = {};

  e.errors.forEach(err => {
    err.path.forEach(p => {
      errors[p] = err.reason;
    });
  });

  return errors;
};

export const whichBookToColor = (whichBook: boolean) =>
  whichBook ? HIGHLIGHT_COLOR_1 : HIGHLIGHT_COLOR_2;

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current!();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
