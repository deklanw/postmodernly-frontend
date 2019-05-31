import React from 'react';
import { styled } from 'linaria/react';

import { TOptionFragment, TBooksInfo } from '../shared/types';
import { BOOK1_BLUE, BOOK2_YELLOW } from '../../util/constants';
import StyledButtonsBox from '../shared/StyledButtonsBox';
import { ExpandAndContractSpinner } from '../shared/Spinner';

const FragmentOption = styled.span<{ whichBook: boolean; onClick: any }>`
  background-color: ${props => (props.whichBook ? BOOK1_BLUE : BOOK2_YELLOW)};
  font-family: 'Spectral';
  font-size: 14px;
  color: black;
  display: inline-block;
  margin: 4px 6px;
  padding: 1px;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  margin: auto 0 0 0;
  padding: 0px 6px;
`;

const StyledOptionsBox = styled.div`
  padding: 20px;
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAuthorsInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  font-family: 'Spectral';
  font-size: 12px;
`;

const AuthorInfo = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 2px 15px;
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
  orderedFragments: TOptionFragment[];
  selectedFragments: TOptionFragment[];
  bookInfo: TBooksInfo | undefined;
  addFragmentSelection: (f: TOptionFragment) => void;
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
        {authorsBox}
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
      </>
    );
  }

  return (
    <StyledOptionsBox>
      {content}
      <ButtonsContainer>
        <StyledButtonsBox>
          <button type="submit" onClick={shuffleFragments} disabled={loading}>
            Shuffle
          </button>
          <button type="submit" onClick={refresh} disabled={loading}>
            Get More
          </button>
        </StyledButtonsBox>
      </ButtonsContainer>
    </StyledOptionsBox>
  );
};

export default OptionsBox;
