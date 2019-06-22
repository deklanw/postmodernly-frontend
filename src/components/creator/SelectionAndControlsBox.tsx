import React, { useEffect, useState, useContext, useRef } from 'react';
import { styled } from 'linaria/react';
import Transition, {
  TransitionStatus
} from 'react-transition-group/Transition';
import { TransitionGroup } from 'react-transition-group';

import StyledButtonsBox from '../shared/StyledButtonsBox';
import {
  MAX_POST_LENGTH,
  OPTION_FRAGMENT_ANIMATION_DURATION
} from '../../util/constants';
import { TOptionFragment } from '../shared/types';
import { ExpandAndContractSpinner } from '../shared/Spinner';
import {
  BOOK1_BLUE,
  BOOK2_YELLOW,
  ERROR_RED,
  atMediaQ
} from '../../util/style';
import { MediaQueryContext } from '../../App';

const SelectedOption = styled.span<{
  whichBook: boolean;
  onClick: any;
  transitionStatus: TransitionStatus;
}>`
  background-color: ${props => (props.whichBook ? BOOK1_BLUE : BOOK2_YELLOW)};
  cursor: pointer;
  margin-right: 7px;

  transition: ${OPTION_FRAGMENT_ANIMATION_DURATION}ms;
  transition-timing-function: ease-in;
  opacity: ${({ transitionStatus }) =>
    transitionStatus === 'entered' ? 1 : 0};

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

const SelectionBox = styled.div`
  margin-bottom: 20px;
`;

const OverflowBox = styled.div`
  overflow-y: scroll;

  ${atMediaQ.small} {
    height: 19vh;
  }
  ${atMediaQ.medium} {
    height: 150px;
  }
  ${atMediaQ.large} {
    height: 150px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  ${atMediaQ.small} {
    padding: 15px;
  }
  ${atMediaQ.medium} {
    padding: 20px;
  }
  ${atMediaQ.large} {
    padding: 20px;
  }

  border-bottom: 1px solid #b8b8b8;
`;

const ErrorBox = styled.div`
  font-weight: 500;
  font-size: 15px;
  color: ${ERROR_RED};
  justify-self: flex-end;
  margin: 10px 0;
  height: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorsAndButtons = styled.div`
  margin-top: auto;
`;
type FormErrors = string[];

const validate = (fragments: TOptionFragment[]) => {
  const errors: FormErrors = [];

  const totalLength = fragments
    .map(el => el.fragmentText.length)
    .reduce((acc, x) => x + acc, 0);

  if (totalLength > MAX_POST_LENGTH) {
    errors.push(`Posts can't be longer than ${MAX_POST_LENGTH} characters.`);
  }

  const oneOfEach = new Set(fragments.map(el => el.bookId)).size === 2;

  if (!oneOfEach) {
    errors.push('Posts must use one of each color.');
  }

  return errors;
};

type Props = {
  removeFragmentSelection: (fragmentId: number) => void;
  selectedFragments: TOptionFragment[];
  resetSelected: () => void;
  handleSubmit: () => void;
  loading: boolean;
};

const SelectionAndControlsBox: React.FC<Props> = ({
  removeFragmentSelection,
  selectedFragments,
  resetSelected,
  handleSubmit,
  loading
}) => {
  const { isSmall } = useContext(MediaQueryContext);
  const [errors, setErrors] = useState<FormErrors>([]);
  const scrollRef = useRef<any>();

  const noSelection = selectedFragments.length === 0;
  const hasErrors = errors.length !== 0;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const maxScrollTop =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      scrollRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    if (!noSelection) {
      setErrors(validate(selectedFragments));
      scrollToBottom();
    } else if (hasErrors) {
      // so it doesn't set redundantly, initially
      setErrors([]);
    }
  }, [selectedFragments, hasErrors, noSelection]);

  let content = null;

  if (loading) {
    content = (
      <ExpandAndContractSpinner
        dimension={isSmall ? 50 : 75}
        margin={isSmall ? 30 : 50}
      />
    );
  } else {
    content = (
      <SelectionBox>
        <TransitionGroup>
          {selectedFragments.map(el => (
            <Transition
              timeout={OPTION_FRAGMENT_ANIMATION_DURATION}
              key={el.fragmentId}
            >
              {transitionStatus => (
                <>
                  <SelectedOption
                    whichBook={el.whichBook}
                    onClick={() => removeFragmentSelection(el.fragmentId)}
                    transitionStatus={transitionStatus}
                  >
                    {el.fragmentText}
                  </SelectedOption>{' '}
                </>
              )}
            </Transition>
          ))}
        </TransitionGroup>
      </SelectionBox>
    );
  }

  return (
    <Container>
      <OverflowBox ref={scrollRef}>{content}</OverflowBox>
      <ErrorsAndButtons>
        <ErrorBox>
          {errors.length > 0 ? <span>* {errors[0]}</span> : null}
        </ErrorBox>
        <StyledButtonsBox>
          <button
            type="submit"
            onClick={resetSelected}
            disabled={loading || noSelection}
          >
            Clear
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || hasErrors || noSelection}
          >
            Submit
          </button>
        </StyledButtonsBox>
      </ErrorsAndButtons>
    </Container>
  );
};

export default SelectionAndControlsBox;
