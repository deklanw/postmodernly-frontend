import React from 'react';
import { styled } from 'linaria/react';
import { useMemo, useState } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { whichBookToColor } from '../../util/util';
import { TClosePopup } from '../shared/types';
import ExitBox from '../shared/ExitBox';

const splitStringIntoThree = (text: string, search: string) => {
  const i = text.indexOf(search);

  if (i === -1) {
    console.log(text, search);
    throw Error('Fragment not contained in context');
  }

  const pre = text.slice(0, i);
  const middle = text.slice(i, i + search.length);
  const post = text.slice(i + search.length, text.length);

  return { pre, middle, post };
};

const Context = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};

  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 55px;
  left: 100%;
  top: 100%;
  width: 500px;
  background: white;
  filter: drop-shadow(9px 6px 20px rgba(0, 0, 0, 0.2));
  z-index: 2;

  font-family: 'Spectral';
  font-size: 14px;
  color: #161616;
  line-height: 1.5;
  text-align: justify;

  &:before {
    font-size: 65px;
    content: '“';
    position: absolute;
    left: 20px;
    top: 20px;
    color: #5d5d5d;
  }
`;

const HighlightedOccurrence = styled.span<{ whichBook: boolean }>`
  background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
`;

const QuoteBlock = styled.div``;
const ByAuthorBook = styled.div`
  position: absolute;
  bottom: 25px;
  right: 50px;
  font-size: 15px;
  text-align: right;
  line-height: 1.3;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 400px;
`;
const Author = styled.span`
  position: relative;
  &:before {
    content: '‒';
    font-size: 60px;
    color: #5d5d5d;
    position: absolute;
    top: -32px;
    left: -40px;
  }
  font-family: 'Spectral';
  font-weight: light;
`;
const Book = styled.div`
  font-family: 'Spectral';
  font-weight: light;
  font-style: italic;
  word-wrap: break-word;
`;

const Frag = styled.span`
  cursor: pointer;
`;

const FragmentText = styled.span<{
  whichBook: boolean;
}>`
  position: relative;
  font-family: 'Spectral';
  font-weight: normal;
  font-size: 16px;
  color: #161616;
  overflow-wrap: normal;
  &:hover {
    background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
  }
`;

type FragmentUIProps = {
  fragmentText: string;
  context: string;
  info: any;
  whichBook: boolean;
  closePopup: TClosePopup;
};

const PostFragment: React.FC<FragmentUIProps> = ({
  fragmentText,
  info,
  context,
  whichBook,
  closePopup
}) => {
  const { pre, middle, post } = useMemo(
    () => splitStringIntoThree(context, fragmentText),
    [context, fragmentText]
  );
  const [visible, setVisible] = useState(false);

  const displayPopup = () => {
    closePopup.current();
    closePopup.current = () => setVisible(false);
    setVisible(true);
  };

  return (
    <FragmentText whichBook={whichBook}>
      <Frag onClick={displayPopup}>{fragmentText} </Frag>
      <Context visible={visible}>
        <ExitBox onClick={() => setVisible(false)}>&#xd7;</ExitBox>
        <QuoteBlock>
          {pre}
          <HighlightedOccurrence whichBook={whichBook}>
            {middle}
          </HighlightedOccurrence>
          {post}
        </QuoteBlock>
        <ByAuthorBook>
          <Author>{info.author}</Author>
          <Book>{info.title}</Book>
        </ByAuthorBook>
      </Context>
    </FragmentText>
  );
};

export default PostFragment;
