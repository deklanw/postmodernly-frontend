import React, { useMemo, useState } from 'react';
import { styled } from 'linaria/react';

import { whichBookToColor, useOutsideClick } from '../../util/util';
import { TClosePopup } from '../shared/types';
import ExitBox from '../shared/ExitBox';
import { atMediaQ } from '../../util/style';

const splitStringIntoThree = (text: string, search: string) => {
  const i = text.indexOf(search);

  if (i === -1) {
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
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  box-shadow: 0 15px 35px hsla(0, 0%, 0%, 0.2);
  z-index: 2;

  color: #161616;
  text-align: justify;

  &:before {
    content: '“';
    position: absolute;
    color: #5d5d5d;
    ${atMediaQ.small} {
      left: 20px;
      top: 20px;
      font-size: 50px;
    }
    ${atMediaQ.medium} {
      left: 20px;
      top: 20px;
      font-size: 65px;
    }
    ${atMediaQ.large} {
      left: 20px;
      top: 20px;
      font-size: 65px;
    }
  }

  ${atMediaQ.small} {
    padding: 60px 50px;
    width: 100%;
    max-width: 500px;
    font-size: 13px;
    line-height: 1.5;
  }
  ${atMediaQ.medium} {
    padding: 80px 55px;
    width: 500px;
    font-size: 14px;
    line-height: 1.5;
  }
  ${atMediaQ.large} {
    padding: 80px 55px;
    width: 500px;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const HighlightedOccurrence = styled.span<{ whichBook: boolean }>`
  background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
`;

const QuoteBlock = styled.div``;
const ByAuthorBook = styled.div`
  position: absolute;
  text-align: right;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  ${atMediaQ.small} {
    font-size: 13px;
    line-height: 1.2;
    bottom: 20px;
    right: 50px;
    width: 400px;
  }
  ${atMediaQ.medium} {
    font-size: 15px;
    line-height: 1.3;
    bottom: 25px;
    right: 50px;
    width: 400px;
  }
  ${atMediaQ.large} {
    font-size: 15px;
    line-height: 1.3;
    bottom: 25px;
    right: 50px;
    width: 400px;
  }
`;
const Author = styled.span`
  position: relative;
  &:before {
    content: '‒';
    color: #5d5d5d;
    position: absolute;
    ${atMediaQ.small} {
      font-size: 50px;
      top: -22px;
      left: -40px;
    }
    ${atMediaQ.medium} {
      font-size: 60px;
      top: -32px;
      left: -40px;
    }
    ${atMediaQ.large} {
      font-size: 60px;
      top: -32px;
      left: -40px;
    }
  }
  font-weight: 300;
`;

const Book = styled.div`
  font-weight: 300;
  font-style: italic;
  word-wrap: break-word;
`;

const Frag = styled.span<{ whichBook: boolean }>`
  cursor: pointer;

  &:hover {
    background-color: ${({ whichBook }) => whichBookToColor(whichBook)};
  }
`;

const FragmentText = styled.span<{
  whichBook: boolean;
  ref: any;
}>`
  font-weight: normal;
  color: #161616;
  overflow-wrap: normal;
  ${atMediaQ.small} {
    font-size: 13px;
  }
  ${atMediaQ.medium} {
    font-size: 16px;
  }
  ${atMediaQ.large} {
    font-size: 16px;
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

  const node = useOutsideClick(() => setVisible(false));

  return (
    <FragmentText ref={node}>
      <>
        <Frag whichBook={whichBook} onClick={displayPopup}>
          {fragmentText}
        </Frag>{' '}
      </>
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
