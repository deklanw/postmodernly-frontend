export type Fragment = {
  fragmentText: string;
  fragmentId: number;
  bookId: number;
  whichBook: boolean;
};

export type BooksInfo = {
  book1Info: BookInfo;
  book2Info: BookInfo;
};

export type BookInfo = {
  id: number;
  title: string;
  author: string;
};
