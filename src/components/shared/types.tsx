export type TOptionFragment = {
  fragmentText: string;
  fragmentId: number;
  bookId: number;
  whichBook: boolean;
  order: number;
};

export type TPostFragment = {
  fragmentText: string;
  fragmentId: number;
  bookId: number;
  order: number;
  context: string;
};

export type TBooksInfo = {
  book1Info: TBookInfo;
  book2Info: TBookInfo;
};

export type TBookInfo = {
  id: number;
  title: string;
  author: string;
};

export type TClosePopup = React.MutableRefObject<() => void>;
