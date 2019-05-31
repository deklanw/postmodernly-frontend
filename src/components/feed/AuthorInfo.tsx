import React from 'react';
import { styled } from 'linaria/react';

import { whichBookToColor } from '../../util/util';
import ExitBox from '../shared/ExitBox';
import { TBooksInfo } from '../shared/types';

const AuthorInfoContainer = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};

  position: absolute;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  left: 50px;
  top: 30px;
  width: 350px;
  height: 350px;
  background: white;
  filter: drop-shadow(9px 6px 20px rgba(0, 0, 0, 0.2));
  z-index: 2;

  font-family: 'Spectral';
  font-size: 14px;
  color: #161616;
  line-height: 1.5;
  text-align: justify;
`;

const PortmanHeader = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  font-size: 24px;
  font-family: 'Spectral';
  font-weight: bold;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const AuthorAndBookBlock = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const AuthorAndBook = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;
const AuthorsName = styled.span<{ whichBook: boolean }>`
  font-size: 18px;
  font-family: 'Spectral';
  font-weight: normal;
  background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
`;
const BookName = styled.div`
  font-size: 16px;
  font-family: 'Spectral';
  font-weight: light;
  font-style: italic;
  display: inline-block;
  word-wrap: break-word;
  text-align: center;
  width: 75%;
  white-space: normal;
`;

type AuthorInfoProps = {
  authorInfoVisible: boolean;
  setAuthorInfoVisible: (b: boolean) => void;
  portman: string;
  booksInfo: TBooksInfo;
};

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  authorInfoVisible,
  setAuthorInfoVisible,
  portman,
  booksInfo
}) => (
  <AuthorInfoContainer visible={authorInfoVisible}>
    <ExitBox onClick={() => setAuthorInfoVisible(false)}>&#xd7;</ExitBox>
    <PortmanHeader>{portman}</PortmanHeader>
    <AuthorAndBookBlock>
      <AuthorAndBook>
        <AuthorsName whichBook>{booksInfo.book1Info.author}</AuthorsName>
        <BookName>{booksInfo.book1Info.title}</BookName>
      </AuthorAndBook>
      <AuthorAndBook>
        <AuthorsName whichBook={false}>
          {booksInfo.book2Info.author}
        </AuthorsName>
        <BookName>{booksInfo.book2Info.title}</BookName>
      </AuthorAndBook>
    </AuthorAndBookBlock>
  </AuthorInfoContainer>
);

export default AuthorInfo;
