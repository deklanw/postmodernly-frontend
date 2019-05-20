import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { knuthShuffle } from 'knuth-shuffle';
import { CircleExpandAndDisappear, ExpandAndContractSpinner } from './Spinner';
import StyledButtonsBox from '../StyledButtonsBox';
import { BOOK1_BLUE, BOOK2_YELLOW } from '../util/constants';
import { Fragment, BooksInfo } from './shared/types';
import SelectionAndControlsBox from './SelectionAndControlsBox';
import {
  useGetNewPostOptionsMutation,
  useGetPostOptionsMutation,
  useMakePostMutation,
  BookFragmentOptions,
  PostOptionsWithTime
} from '../generated/graphql';

const FragmentOption = styled.span<{ whichBook: boolean }>`
  background-color: ${({ whichBook }) =>
    whichBook ? BOOK1_BLUE : BOOK2_YELLOW};
  font-family: 'Spectral Regular';
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

  font-family: 'Spectral Regular';
  font-size: 12px;

  &::before {
    position: absolute;
    content: '*';
    font-family: 'Spectral Regular';
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

const AuthorCircle = styled.div`
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

const OptionsBox = ({
  getNewFragmentOptions,
  shuffleFragments,
  orderedFragments,
  selectedFragments,
  clearSelectedFragments,
  bookInfo,
  addFragmentSelection
}: {
  orderedFragments: Fragment[];
  selectedFragments: Fragment[];
  bookInfo: BooksInfo | undefined;
  addFragmentSelection: any;
  clearSelectedFragments: any;
  getNewFragmentOptions: any;
  shuffleFragments: any;
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

  return (
    <StyledOptionsBox>
      <StyledButtonsBox>
        <button type="submit" onClick={shuffleFragments}>
          Shuffle
        </button>
        <button type="submit" onClick={refresh}>
          Refresh
        </button>
      </StyledButtonsBox>
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
    </StyledOptionsBox>
  );
};

function immutableShuffle<T>(arr: T[]): T[] {
  const newArray = arr.slice();
  return knuthShuffle(newArray);
}
const initSelectedFragments: Fragment[] = [];
const initFragmentOptions: Fragment[] = [];
// const initBookInfo: { [key: string]: { id: string, title: string; author: string } } = {};

const initBookInfo: BooksInfo | undefined = undefined;

const Container = styled.div`
  background-color: white;
  border: 1px #c4c4c4 solid;
  border-radius: 5px;
`;

const PostCreator = () => {
  const getNewPostOptions = useGetNewPostOptionsMutation();
  const getPostOptions = useGetPostOptionsMutation();
  const makePost = useMakePostMutation();

  const [somethingLoading, setLoading] = useState(true);
  const [orderedFragments, setFragments] = useState(initFragmentOptions);
  const [selectedFragments, setSelectedFragments] = useState(
    initSelectedFragments
  );
  const [bookInfo, setBookInfo] = useState<BooksInfo | undefined>(initBookInfo);

  const formatOptionsAndSet = async (
    book1Options: BookFragmentOptions,
    book2Options: BookFragmentOptions
  ) => {
    const reformattedBook1Options: Fragment[] = book1Options.fragmentOptions.map(
      el => ({
        fragmentText: el.fragment.fragmentText,
        fragmentId: parseInt(el.fragment.id),
        order: el.order,
        bookId: parseInt(book1Options.book.id),
        whichBook: true
      })
    );

    const reformattedBook2Options: Fragment[] = book2Options.fragmentOptions.map(
      el => ({
        fragmentText: el.fragment.fragmentText,
        fragmentId: parseInt(el.fragment.id),
        order: el.order,
        bookId: parseInt(book2Options.book.id),
        whichBook: false
      })
    );

    setFragments(
      reformattedBook1Options
        .concat(reformattedBook2Options)
        .sort((a, b) => a.order - b.order)
    );

    setBookInfo({
      book1Info: {
        id: parseInt(book1Options.book.id),
        title: book1Options.book.title,
        author: book1Options.book.author.name
      },
      book2Info: {
        id: parseInt(book2Options.book.id),
        title: book2Options.book.title,
        author: book2Options.book.author.name
      }
    });
  };

  const getFragmentOptions = async () => {
    const { data, error, loading } = await getPostOptions();

    if (!loading && data.getPostOptions.postOptions) {
      const { book1Options, book2Options } = data.getPostOptions.postOptions;

      setLoading(false);
      formatOptionsAndSet(book1Options, book2Options);
    }

    if (error) {
      // error state?
      console.log('Not there');
    }
  };

  const getNewFragmentOptions = async () => {
    const { data, error, loading } = await getNewPostOptions();
    const options = data.getNewPostOptions;

    if (options.postOptions) {
      const { book1Options, book2Options } = options.postOptions;

      setLoading(false);
      formatOptionsAndSet(book1Options, book2Options);
    } else {
      // error state?
      console.log('Not there');
    }
  };

  const addFragmentSelection = (fragment: Fragment) =>
    setSelectedFragments([...selectedFragments, fragment]);

  const clearSelectedFragments = () => setSelectedFragments([]);

  const removeFragmentSelection = (fragmentId: number) => {
    setSelectedFragments(
      selectedFragments.filter(el => el.fragmentId !== fragmentId)
    );
  };

  const resetOptions = () => setSelectedFragments([]);

  const shuffleFragments = () => {
    setFragments(immutableShuffle(orderedFragments));
  };

  useEffect(() => {
    getFragmentOptions();
  }, []);

  return (
    <Container>
      {somethingLoading ? (
        <ExpandAndContractSpinner dimension={75} />
      ) : (
        <>
          <SelectionAndControlsBox
            removeFragmentSelection={removeFragmentSelection}
            selectedFragments={selectedFragments}
            resetOptions={resetOptions}
            makePost={makePost}
            bookInfo={bookInfo}
          />
          <OptionsBox
            getNewFragmentOptions={getNewFragmentOptions}
            shuffleFragments={shuffleFragments}
            addFragmentSelection={addFragmentSelection}
            clearSelectedFragments={clearSelectedFragments}
            orderedFragments={orderedFragments}
            selectedFragments={selectedFragments}
            bookInfo={bookInfo}
          />
        </>
      )}
    </Container>
  );
};

export default PostCreator;
