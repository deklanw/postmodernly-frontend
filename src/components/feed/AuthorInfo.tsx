import React from 'react';
import { styled } from 'linaria/react';

import { whichBookToColor, useOutsideClick } from '../../util/util';
import ExitBox from '../shared/ExitBox';
import { TBooksInfo } from '../shared/types';
import { atMediaQ } from '../../util/style';

const AuthorInfoContainer = styled.div<{ visible: boolean; ref: any }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};

  position: absolute;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  top: 0;
  left: 40px;
  background: white;
  box-shadow: 9px 6px 20px rgba(0, 0, 0, 0.2);
  z-index: 2;

  color: #161616;
  text-align: justify;

  ${atMediaQ.small} {
    width: 250px;
    height: 250px;
    line-height: 1.3;
  }
  ${atMediaQ.medium} {
    width: 350px;
    height: 350px;
    line-height: 1.5;
  }
  ${atMediaQ.large} {
    width: 350px;
    height: 350px;
    line-height: 1.5;
  }
`;

const PortmanHeader = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  font-size: 24px;
  font-weight: 500;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  ${atMediaQ.small} {
    font-size: 20px;
  }
  ${atMediaQ.medium} {
    font-size: 24px;
  }
  ${atMediaQ.large} {
    font-size: 24px;
  }
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
  font-weight: normal;
  background-color: ${({ whichBook }) => whichBookToColor(whichBook)};

  ${atMediaQ.small} {
    font-size: 14px;
  }
  ${atMediaQ.medium} {
    font-size: 18px;
  }
  ${atMediaQ.large} {
    font-size: 18px;
  }
`;
const BookName = styled.div`
  font-weight: 300;
  font-style: italic;
  display: inline-block;
  word-wrap: break-word;
  text-align: center;
  width: 75%;
  white-space: normal;

  ${atMediaQ.small} {
    font-size: 14px;
  }
  ${atMediaQ.medium} {
    font-size: 16px;
  }
  ${atMediaQ.large} {
    font-size: 16px;
  }
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
}) => {
  const close = () => setAuthorInfoVisible(false);
  const node = useOutsideClick(close);

  return (
    <AuthorInfoContainer visible={authorInfoVisible} ref={node}>
      <ExitBox onClick={close}>&#xd7;</ExitBox>
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
};

export default AuthorInfo;
