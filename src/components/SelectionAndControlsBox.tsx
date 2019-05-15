import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { withFormik, FormikProps } from 'formik';

import StyledButtonsBox from '../StyledButtonsBox';
import { BOOK1_BLUE, BOOK2_YELLOW, MAX_POST_LENGTH } from '../util/constants';
import { Fragment, BooksInfo } from './shared/types';
import { ExpandAndContractSpinner, CircleExpandAndDisappear } from './Spinner';

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

  font-family: 'Domaine Text Regular';
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
  font-family: 'Domaine Text Bold';
  font-size: 14px;
  color: #cb2e2e;
  justify-self: flex-end;
  margin-bottom: 10px;
`;

const ErrorsAndButtons = styled.div`
  margin-top: auto;
`;

type Props = {
  removeFragmentSelection: any;
  selectedFragments: Fragment[];
  resetOptions: any;
  makePost: any;
  bookInfo: BooksInfo | undefined;
};

type FormValues = { fragments: Fragment[] };

const SelectionAndControlsBox = ({
  removeFragmentSelection,
  selectedFragments,
  resetOptions,
  makePost,
  bookInfo,
  handleSubmit,
  errors,
  isSubmitting,
  setFieldValue,
  isValid,
  resetForm
}: FormikProps<FormValues> & Props) => {
  useEffect(() => {
    if (selectedFragments.length === 0) {
      resetForm(); // does this get called one extra time initially?
    } else {
      setFieldValue('fragments', selectedFragments);
    }
  }, [selectedFragments]);

  const anyHandleSubmit = handleSubmit as any;

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
        {errors.fragments && (
          <ErrorBox>
            {errors.fragments.map(e => (
              <div>* {e}</div>
            ))}
          </ErrorBox>
        )}
        <StyledButtonsBox>
          <button type="submit" onClick={resetOptions}>
            Clear
          </button>
          <button type="submit" onClick={anyHandleSubmit}>
            Submit
          </button>
        </StyledButtonsBox>
      </ErrorsAndButtons>
    </StyledResultAndControlsBox>
  );
};

type Errors = {
  [key: string]: string[];
};

const validate = ({ fragments }: FormValues) => {
  const errors: Errors = {};

  const totalLength = fragments
    .map(el => el.fragmentText.length)
    .reduce((acc, x) => x + acc);

  if (totalLength > MAX_POST_LENGTH) {
    errors.fragments = [
      ...(errors.fragments || []),
      `Posts can't be longer than ${MAX_POST_LENGTH} characters.`
    ];
  }

  const oneOfEach = new Set(fragments.map(el => el.bookId)).size === 2;

  if (!oneOfEach) {
    errors.fragments = [
      ...(errors.fragments || []),
      'Posts must use at least one Fragment from each author (color).'
    ];
  }

  return errors;
};

export default withFormik<Props, FormValues>({
  validate,
  mapPropsToValues: () => ({ fragments: [] }),
  handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
    try {
      const data = {
        fragments: values.fragments.map((el, i) => ({
          fragmentId: el.fragmentId,
          order: i
        }))
      };
      const response = await props.makePost({
        variables: { data }
      });

      if (response.data.makePost) {
        props.resetOptions();
      } else {
        // indicate some kind of error
      }
    } catch (errors) {
      setErrors(errors);
    } finally {
      setSubmitting(false);
    }
  }
})(SelectionAndControlsBox);