import { StructError } from 'superstruct';
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
