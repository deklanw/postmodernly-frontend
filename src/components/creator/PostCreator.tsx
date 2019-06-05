import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import { knuthShuffle } from 'knuth-shuffle';

import { TOptionFragment, TBooksInfo } from '../shared/types';
import SelectionAndControlsBox from './SelectionAndControlsBox';
import {
  useGetNewPostOptionsMutation,
  useGetPostOptionsMutation,
  useMakePostMutation,
  BookOptionsFragment,
  RemainingLimit,
  Maybe
} from '../../generated/graphql';
import OptionsBox from './OptionsBox';
import GenericError from '../shared/GenericError';
import { useInterval } from '../../util/util';

function immutableShuffle<T>(arr: T[]): T[] {
  const newArray = arr.slice();
  return knuthShuffle(newArray);
}
const initSelectedFragments: TOptionFragment[] = [];
const initFragmentOptions: TOptionFragment[] = [];
const initBookInfo: TBooksInfo | undefined = undefined;

const Container = styled.div`
  background-color: white;
  border: 1px #c4c4c4 solid;
  border-radius: 5px;
`;

const formatOptions = (
  book1Options: BookOptionsFragment,
  book2Options: BookOptionsFragment
) => {
  const reformattedBook1Options: TOptionFragment[] = book1Options.fragmentOptions.map(
    el => ({
      fragmentText: el.fragment.fragmentText,
      fragmentId: parseInt(el.fragment.id),
      order: el.order,
      bookId: parseInt(book1Options.book.id),
      whichBook: true
    })
  );

  const reformattedBook2Options: TOptionFragment[] = book2Options.fragmentOptions.map(
    el => ({
      fragmentText: el.fragment.fragmentText,
      fragmentId: parseInt(el.fragment.id),
      order: el.order,
      bookId: parseInt(book2Options.book.id),
      whichBook: false
    })
  );

  return {
    reformattedBookOptions: reformattedBook1Options
      .concat(reformattedBook2Options)
      .sort((a, b) => a.order - b.order),
    bookInfos: {
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
    }
  };
};

const PostCreator = () => {
  const getNewPostOptions = useGetNewPostOptionsMutation();
  const getPostOptions = useGetPostOptionsMutation();
  const makePost = useMakePostMutation();

  const [
    selectionAndControlBoxLoading,
    setSelectionAndControlBoxLoading
  ] = useState(false);
  const [optionsBoxLoading, setOptionsBoxLoading] = useState(true);
  const [remainingLimit, setRemainingLimit] = useState<Maybe<RemainingLimit>>(
    null
  );
  const [refreshTime, setRefreshTime] = useState<Maybe<dayjs.Dayjs>>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<Maybe<number>>(null);

  useInterval(() => {
    if (refreshTime !== null) {
      setRemainingSeconds(refreshTime.diff(dayjs(), 'second', false));
    }
  }, 1000);

  const [orderedFragments, setFragments] = useState(initFragmentOptions);
  const [selectedFragments, setSelectedFragments] = useState(
    initSelectedFragments
  );
  const [bookInfo, setBookInfo] = useState<TBooksInfo | undefined>(
    initBookInfo
  );
  const [errored, setErrored] = useState(false);

  const getFragmentOptions = async (newOptions: boolean) => {
    setOptionsBoxLoading(true);
    try {
      let options;

      if (newOptions) {
        const { data } = await getNewPostOptions();
        options = data!.getNewPostOptions;
      } else {
        const { data } = await getPostOptions();
        options = data!.getPostOptions;
      }

      if (options.postOptions) {
        const { book1Options, book2Options } = options.postOptions;

        const { reformattedBookOptions, bookInfos } = formatOptions(
          book1Options,
          book2Options
        );
        setFragments(reformattedBookOptions);
        setBookInfo(bookInfos);
        setOptionsBoxLoading(false);
      }

      // console.log(options);

      if (options.remaining) {
        setRemainingLimit(options.remaining);
        setRefreshTime(
          dayjs().add(options.remaining.remainingSeconds + 1, 'second') // give a second of error
        );
      }
    } catch (e) {
      setErrored(true);
    } finally {
      setOptionsBoxLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSelectionAndControlBoxLoading(true);
    const input = {
      fragments: selectedFragments.map((el, i) => ({
        fragmentId: el.fragmentId,
        order: i
      }))
    };
    try {
      const { data } = await makePost({
        variables: { data: input }
      });

      if (data!.makePost) {
        setSelectedFragments([]);
        setFragments([]);
        getFragmentOptions(true);
        setSelectionAndControlBoxLoading(false);
      }
    } catch (e) {
      setErrored(true);
    }
  };

  const addFragmentSelection = (fragment: TOptionFragment) =>
    setSelectedFragments([...selectedFragments, fragment]);

  const clearSelectedFragments = () => setSelectedFragments([]);

  const removeFragmentSelection = (fragmentId: number) => {
    setSelectedFragments(
      selectedFragments.filter(el => el.fragmentId !== fragmentId)
    );
  };

  const resetSelected = () => setSelectedFragments([]);

  const shuffleFragments = () => {
    setFragments(immutableShuffle(orderedFragments));
  };

  useEffect(() => {
    getFragmentOptions(false);
  }, []);

  let content = null;

  if (errored) {
    content = <GenericError />;
  } else {
    content = (
      <>
        <SelectionAndControlsBox
          removeFragmentSelection={removeFragmentSelection}
          selectedFragments={selectedFragments}
          resetSelected={resetSelected}
          handleSubmit={handleSubmit}
          loading={selectionAndControlBoxLoading}
        />
        <OptionsBox
          getNewFragmentOptions={() => getFragmentOptions(true)}
          shuffleFragments={shuffleFragments}
          addFragmentSelection={addFragmentSelection}
          clearSelectedFragments={clearSelectedFragments}
          orderedFragments={orderedFragments}
          selectedFragments={selectedFragments}
          bookInfo={bookInfo}
          remainingRefreshes={
            remainingLimit ? remainingLimit.remainingRefreshes : null
          }
          remainingSeconds={remainingSeconds}
          loading={selectionAndControlBoxLoading || optionsBoxLoading}
        />
      </>
    );
  }

  return <Container>{content}</Container>;
};

export default hot(PostCreator);
