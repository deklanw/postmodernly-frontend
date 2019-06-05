import React, { useEffect, useCallback, useState } from 'react';
import { styled } from 'linaria/react';
import { TransitionGroup } from 'react-transition-group';
import Transition, {
  TransitionStatus
} from 'react-transition-group/Transition';

import { TOptionFragment, TBooksInfo } from '../shared/types';
import {
  BOOK1_BLUE,
  BOOK2_YELLOW,
  OPTION_FRAGMENT_ANIMATION_DURATION,
  ERROR_RED
} from '../../util/constants';
import StyledButtonsBox from '../shared/StyledButtonsBox';
import { ExpandAndContractSpinner } from '../shared/Spinner';
import { Maybe } from '../../generated/graphql';
import BookLover from '../../assets/svg/book_lover.svg';

const ButtonsContainer = styled.div`
  width: 100%;
  margin: auto 0 0 0;
  padding: 0px 6px;
`;

const StyledOptionsBox = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledAuthorsInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  font-family: 'Spectral';
  font-size: 13px;
  height: 30px;
  margin-bottom: 20px;
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

const OverflowBox = styled.div`
  height: 300px;
  overflow-y: scroll;
  width: 100%;
`;

const FragmentOption = styled.span<{
  whichBook: boolean;
  onClick: any;
  transitionStatus: TransitionStatus;
}>`
  background-color: ${props => (props.whichBook ? BOOK1_BLUE : BOOK2_YELLOW)};
  font-family: 'Spectral';
  font-size: 14px;
  color: black;
  display: inline-block;
  margin: 4px 6px;
  padding: 1px;
  cursor: pointer;

  transition: ${OPTION_FRAGMENT_ANIMATION_DURATION}ms;
  transition-timing-function: ease-out;
  opacity: ${({ transitionStatus }) =>
    transitionStatus === 'entered' ? 1 : 0};
`;

const LimitBox = styled.div`
  height: 15px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Spectral';
  font-size: 16px;
`;

const WarningNumber = styled.span`
  margin-right: 4px;
  color: ${ERROR_RED};
`;

const CenteredSvg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  orderedFragments: TOptionFragment[];
  selectedFragments: TOptionFragment[];
  bookInfo: TBooksInfo | undefined;
  addFragmentSelection: (f: TOptionFragment) => void;
  clearSelectedFragments: () => void;
  getNewFragmentOptions: () => Promise<void>;
  shuffleFragments: () => void;
  remainingRefreshes: Maybe<number>;
  remainingSeconds: Maybe<number>;
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
  remainingSeconds,
  remainingRefreshes,
  loading
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = useCallback(async () => {
    setRefreshing(true);
    clearSelectedFragments();
    await getNewFragmentOptions();
    setRefreshing(false);
  }, [clearSelectedFragments, getNewFragmentOptions, setRefreshing]);

  const noOptions =
    orderedFragments.length === 0 && selectedFragments.length === 0;
  const outOfOptionsAndNoRefresh = remainingRefreshes === 0 && noOptions;

  useEffect(() => {
    if (
      remainingSeconds !== null &&
      remainingSeconds <= 0 &&
      outOfOptionsAndNoRefresh &&
      !refreshing
    ) {
      refresh();
    }
  });

  let content = null;

  if (loading) {
    content = (
      <OverflowBox>
        <ExpandAndContractSpinner dimension={100} margin={50} />
      </OverflowBox>
    );
  } else if (outOfOptionsAndNoRefresh) {
    content = (
      <CenteredSvg>
        <img src={BookLover} width="350px" alt="Woman reading" />
      </CenteredSvg>
    );
  } else {
    content = (
      <OverflowBox>
        <TransitionGroup>
          {orderedFragments
            .filter(el => !selectedFragments.includes(el))
            .map(el => {
              return (
                <Transition
                  timeout={OPTION_FRAGMENT_ANIMATION_DURATION}
                  key={el.fragmentId}
                >
                  {transitionStatus => (
                    <FragmentOption
                      whichBook={el.whichBook}
                      onClick={() => addFragmentSelection(el)}
                      transitionStatus={transitionStatus}
                    >
                      {el.fragmentText}
                    </FragmentOption>
                  )}
                </Transition>
              );
            })}
        </TransitionGroup>
      </OverflowBox>
    );
  }

  return (
    <StyledOptionsBox>
      {!outOfOptionsAndNoRefresh && (
        <StyledAuthorsInfoBox>
          {bookInfo && !loading && !outOfOptionsAndNoRefresh ? (
            <>
              <AuthorInfo>
                {bookInfo.book1Info.author}
                <AuthorCircle color={BOOK1_BLUE} />
              </AuthorInfo>
              <AuthorInfo>
                {bookInfo.book2Info.author}
                <AuthorCircle color={BOOK2_YELLOW} />
              </AuthorInfo>
            </>
          ) : null}
        </StyledAuthorsInfoBox>
      )}
      {content}
      <LimitBox>
        {remainingSeconds !== null &&
        remainingSeconds > 0 &&
        remainingRefreshes !== null &&
        remainingRefreshes <= 2 ? (
          <>
            <WarningNumber>{remainingRefreshes}</WarningNumber> refreshes left.
            More available in {remainingSeconds} seconds.
          </>
        ) : null}
      </LimitBox>
      <ButtonsContainer>
        <StyledButtonsBox>
          <button
            type="submit"
            onClick={shuffleFragments}
            disabled={loading || selectedFragments.length === 30 || noOptions}
          >
            Shuffle
          </button>
          <button
            type="submit"
            onClick={refresh}
            disabled={
              loading ||
              (remainingRefreshes === 0 &&
                remainingSeconds !== null &&
                remainingSeconds > 0)
            }
          >
            Get More
          </button>
        </StyledButtonsBox>
      </ButtonsContainer>
    </StyledOptionsBox>
  );
};

export default OptionsBox;
