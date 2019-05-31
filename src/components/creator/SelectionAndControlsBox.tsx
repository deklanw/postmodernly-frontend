import React, { useEffect, useState } from 'react';
import { styled } from 'linaria/react';

import StyledButtonsBox from '../shared/StyledButtonsBox';
import {
  BOOK1_BLUE,
  BOOK2_YELLOW,
  MAX_POST_LENGTH,
  ERROR_RED
} from '../../util/constants';
import { TOptionFragment } from '../shared/types';
import { ExpandAndContractSpinner } from '../shared/Spinner';

const RemoveSelectionX = styled.div`
  display: inline-block;
  cursor: pointer;
  margin-left: 5px;
  font-size: 22px;
  color: #7b7b7b;
`;

const SelectedOption = styled.div<{ whichBook: boolean }>`
  background-color: ${props => (props.whichBook ? BOOK1_BLUE : BOOK2_YELLOW)};
  margin: 3px 5px;
  padding: 0 7px;

  font-family: 'Spectral';
  font-size: 14px;

  display: inline-flex;
  align-items: center;
`;

const SelectionBox = styled.div`
  margin-bottom: 20px;
`;

const StyledResultAndControlsBox = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  padding: 20px;

  border-bottom: 1px solid #b8b8b8;
`;

const ErrorBox = styled.div`
  font-family: 'Spectral';
  font-weight: medium;
  font-size: 15px;
  color: ${ERROR_RED};
  justify-self: flex-end;
  margin-bottom: 10px;
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
    errors.push(
      'Posts must use at least one Fragment from each author (color).'
    );
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
  const [errors, setErrors] = useState<FormErrors>([]);

  const noSelection = selectedFragments.length === 0;
  const hasErrors = errors.length !== 0;

  useEffect(() => {
    if (!noSelection) {
      setErrors(validate(selectedFragments));
    } else if (hasErrors) {
      // so it doesn't set redundantly, initially
      setErrors([]);
    }
  }, [selectedFragments]);

  let content = null;

  if (loading) {
    content = <ExpandAndContractSpinner dimension={75} margin={50} />;
  } else {
    content = (
      <SelectionBox>
        {selectedFragments.map(el => (
          <SelectedOption whichBook={el.whichBook} key={el.fragmentId}>
            {el.fragmentText}
            <RemoveSelectionX
              onClick={() => removeFragmentSelection(el.fragmentId)}
            >
              &#xd7;
            </RemoveSelectionX>
          </SelectedOption>
        ))}
      </SelectionBox>
    );
  }

  return (
    <StyledResultAndControlsBox>
      {content}
      <ErrorsAndButtons>
        {errors && (
          <ErrorBox>
            {errors.map(e => (
              <div key={e}>* {e}</div>
            ))}
          </ErrorBox>
        )}
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
    </StyledResultAndControlsBox>
  );
};

export default SelectionAndControlsBox;
