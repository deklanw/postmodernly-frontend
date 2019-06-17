import { StructError } from 'superstruct';
import {
  useRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect
} from 'react';
import { HIGHLIGHT_COLOR_1, HIGHLIGHT_COLOR_2, mediaQ } from './style';

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

export const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(mediaQuery).matches
  );

  // should be useEffect instead? test.
  useLayoutEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQueryList.addListener(listener);
    return () => mediaQueryList.removeListener(listener);
  }, [mediaQuery]);

  return matches;
};

export const useMyMediaQueries = () => {
  const isSmall = useMediaQuery(mediaQ.small);
  const isMedium = useMediaQuery(mediaQ.medium);
  const isLarge = useMediaQuery(mediaQ.large);

  return { isSmall, isMedium, isLarge };
};

export const useOutsideClick = (close: () => void) => {
  const node = useRef<any>();
  const handleClick = useCallback(
    (e: any) => {
      if (node.current && node.current.contains(e.target)) {
        // clicked inside
        return;
      }
      // clicked outside
      close();
    },
    [node, close]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick]);

  return node;
};
