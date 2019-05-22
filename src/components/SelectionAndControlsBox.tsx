import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { MutationFn } from 'react-apollo-hooks';

import StyledButtonsBox from '../StyledButtonsBox';
import {
  BOOK1_BLUE,
  BOOK2_YELLOW,
  MAX_POST_LENGTH,
  ERROR_RED
} from '../util/constants';
import { Fragment } from './shared/types';
import { ExpandAndContractSpinner, CircleExpandAndDisappear } from './Spinner';
import {
  MakePostMutation,
  MakePostMutationVariables
} from '../generated/graphql';

const RemoveSelectionX = styled.div`
  display: inline-block;
  cursor: pointer;
  margin-left: 5px;
  font-size: 22px;
  color: #7b7b7b;
`;

const SelectedOption = styled.div<{ whichBook: boolean }>`
  background-color: ${({ whichBook }) =>
    whichBook ? BOOK1_BLUE : BOOK2_YELLOW};
  margin: 3px 5px;
  padding: 0 7px;

  font-family: 'Spectral Regular';
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
  font-family: 'Spectral Medium';
  font-size: 15px;
  color: ${ERROR_RED};
  justify-self: flex-end;
  margin-bottom: 10px;
`;

const ErrorsAndButtons = styled.div`
  margin-top: auto;
`;

type Props = {
  removeFragmentSelection: (fragmentId: number) => void;
  selectedFragments: Fragment[];
  resetSelected: () => void;
  submitted: () => void;
  makePost: MutationFn<MakePostMutation, MakePostMutationVariables>;
};

type FormErrors = string[];

const validate = (fragments: Fragment[]) => {
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

const SelectionAndControlsBox = ({
  removeFragmentSelection,
  selectedFragments,
  resetSelected,
  submitted,
  makePost
}: Props) => {
  const [errors, setErrors] = useState<FormErrors>([]);

  useEffect(() => {
    if (selectedFragments.length !== 0) {
      setErrors(validate(selectedFragments));
    } else if (errors.length !== 0) {
      setErrors([]);
    }
  }, [selectedFragments]);

  const handleSubmit = async () => {
    try {
      const data = {
        fragments: selectedFragments.map((el, i) => ({
          fragmentId: el.fragmentId,
          order: i
        }))
      };
      const response = await makePost({
        variables: { data }
      });

      if (response.data.makePost) {
        submitted();
      } else {
        // indicate some kind of error
      }
    } catch (e) {
      // setErrors(errors);
    }
  };

  return (
    <StyledResultAndControlsBox>
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
      <ErrorsAndButtons>
        {errors && (
          <ErrorBox>
            {errors.map(e => (
              <div key={e}>* {e}</div>
            ))}
          </ErrorBox>
        )}
        <StyledButtonsBox>
          <button type="submit" onClick={resetSelected}>
            Clear
          </button>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </StyledButtonsBox>
      </ErrorsAndButtons>
    </StyledResultAndControlsBox>
  );
};

export default SelectionAndControlsBox;
