import React from 'react';
import { styled } from 'linaria/react';

import { Fragment, BooksInfo } from './shared/types';
import { BOOK1_BLUE, BOOK2_YELLOW } from '../util/constants';
import StyledButtonsBox from '../StyledButtonsBox';
import { ExpandAndContractSpinner } from './Spinner';

const FragmentOption = styled.span<{ whichBook: boolean }>`
  background-color: ${props => (props.whichBook ? BOOK1_BLUE : BOOK2_YELLOW)};
  font-family: 'Spectral';
  font-size: 14px;
  color: black;
  display: inline-block;
  margin: 4px 6px;
  padding: 1px;
  cursor: pointer;
`;
const StyledOptionsBox = styled.div`
  padding: 20px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
`;

const StyledAuthorsInfoBox = styled.div`
  position: relative;
  margin: auto 0 0 auto;

  font-family: 'Spectral';
  font-size: 12px;

  &::before {
    position: absolute;
    content: '*';
    font-family: 'Spectral';
    font-size: 29px;

    top: -10px;
    left: -10px;
  }
`;

const AuthorInfo = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
`;

const AuthorCircle = styled.div<{ color: string }>`
  display: inline-block;
  margin-left: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const FragmentsBox = styled.div`
  margin: 30px 0;
`;

type Props = {
  orderedFragments: Fragment[];
  selectedFragments: Fragment[];
  bookInfo: BooksInfo | undefined;
  addFragmentSelection: (f: Fragment) => void;
  clearSelectedFragments: () => void;
  getNewFragmentOptions: () => void;
  shuffleFragments: () => void;
  loading: boolean;
};

const OptionsBox: React.FC<Props> = ({
  getNewFragmentOptions,
  shuffleFragments,
  orderedFragments,
  selectedFragments,
  clearSelectedFragments,
  bookInfo,
  addFragmentSelection,
  loading
}) => {
  const authorsBox = bookInfo ? (
    <StyledAuthorsInfoBox>
      <AuthorInfo>
        {bookInfo.book1Info.author}
        <AuthorCircle color={BOOK1_BLUE} />
      </AuthorInfo>
      <AuthorInfo>
        {bookInfo.book2Info.author}
        <AuthorCircle color={BOOK2_YELLOW} />
      </AuthorInfo>
    </StyledAuthorsInfoBox>
  ) : null;

  const refresh = () => {
    clearSelectedFragments();
    getNewFragmentOptions();
  };

  let content = null;

  if (loading) {
    content = <ExpandAndContractSpinner dimension={75} margin={50} />;
  } else {
    content = (
      <>
        <FragmentsBox>
          {orderedFragments
            .filter(el => !selectedFragments.includes(el))
            .map(el => {
              return (
                <FragmentOption
                  whichBook={el.whichBook}
                  key={el.fragmentId}
                  onClick={() => addFragmentSelection(el)}
                >
                  {el.fragmentText}
                </FragmentOption>
              );
            })}
        </FragmentsBox>
        {authorsBox}
      </>
    );
  }

  return (
    <StyledOptionsBox>
      <StyledButtonsBox>
        <button type="submit" onClick={shuffleFragments} disabled={loading}>
          Shuffle
        </button>
        <button type="submit" onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </StyledButtonsBox>
      {content}
    </StyledOptionsBox>
  );
};

export default OptionsBox;
