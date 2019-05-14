import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { knuthShuffle } from 'knuth-shuffle';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo-hooks';
import { PostOptions } from '../../generated/graphql';

type Fragment = {
  fragmentText: string;
  fragmentId: number;
  bookId: number;
  whichBook: boolean;
};

type BookInfos = {
  book1Info: BookInfo;
  book2Info: BookInfo;
};

type BookInfo = {
  id: number;
  title: string;
  author: string;
};

const book1Blue = '#C9D8F3';
const book2Yellow = '#F5F2CD';

const FragmentOption = styled.span`
  background-color: ${(props: any) =>
    props.whichBook ? book1Blue : book2Yellow};
  font-family: 'Domaine Text Regular';
  font-size: 13px;
  color: black;
  display: inline-block;
  margin: 4px 6px;
  padding: 1px;
  cursor: pointer;
`;

const StyledResultAndControlsBox = styled.div`
  min-height: 270px;
  display: flex;
  flex-direction: column;
  padding: 20px;

  border-bottom: 1px solid #b8b8b8;
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

  font-family: 'Domaine Text Regular';
  font-size: 12px;

  &::before {
    position: absolute;
    content: '*';
    font-family: 'Domaine Text Regular';
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

const StyledButtonsBox = styled.div`
  height: 50px;
  margin: ${({ top }: any) => (top ? '0 0 auto 0' : 'auto 0 0 0')};
  display: flex;
  justify-content: space-between;
  align-items: ${({ top }: any) => (top ? 'flex-start' : 'flex-end')};

  & button {
    font-family: 'Domaine Text Regular';
    font-size: 14px;
    width: 95px;
    height: 35px;
    border: none;
    border-radius: 2px;

    cursor: pointer;
  }
  /* 
  & button:nth-of-type(1) {
    color: black;
    background-color: white;
  } */

  & button:nth-of-type(1) {
    color: black;
    background-color: white;
    border: 1px solid black;
  }

  & button:nth-of-type(2) {
    color: white;
    background-color: #535353;
  }
`;

const FragmentsBox = styled.div`
  margin-bottom: 30px;
`;

const OptionsBox = ({
  getFragmentOptions,
  shuffleFragments,
  orderedFragments,
  selectedFragments,
  bookInfo,
  addFragmentSelection
}: {
  orderedFragments: Fragment[];
  selectedFragments: Fragment[];
  bookInfo: BookInfos | undefined;
  addFragmentSelection: any;
  getFragmentOptions: any;
  shuffleFragments: any;
}) => {
  const authorsBox = bookInfo ? (
    <StyledAuthorsInfoBox>
      <AuthorInfo>
        {bookInfo.book1Info.author}
        <AuthorCircle color={book1Blue} />
      </AuthorInfo>
      <AuthorInfo>
        {bookInfo.book2Info.author}
        <AuthorCircle color={book2Yellow} />
      </AuthorInfo>
    </StyledAuthorsInfoBox>
  ) : null;

  return (
    <StyledOptionsBox>
      <StyledButtonsBox top>
        <button type="submit" onClick={shuffleFragments}>
          Shuffle
        </button>
        <button type="submit" onClick={getFragmentOptions}>
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

const SelectionBox = styled.div``;

const SelectedOption = styled.div`
  background-color: ${(props: any) =>
    props.whichBook ? book1Blue : book2Yellow};
  margin: 3px 5px;
  padding: 0 7px;

  font-family: 'Domaine Text Regular';
  font-size: 14px;

  display: inline-flex;
  align-items: center;
`;

const RemoveSelectionX = styled.div`
  display: inline-block;
  cursor: pointer;
  margin-left: 5px;
  font-size: 22px;
  color: #7b7b7b;
`;

const SelectionAndControlsBox = ({
  removeFragmentSelection,
  selectedFragments,
  resetOptions,
  makePost,
  bookInfo
}: {
  removeFragmentSelection: any;
  selectedFragments: Fragment[];
  resetOptions: any;
  makePost: any;
  bookInfo: BookInfos | undefined;
}) => {
  const submit = async () => {
    const fragments = selectedFragments.map((el, i) => ({
      fragmentId: el.fragmentId,
      order: i
    }));

    const response = await makePost({ variables: { data: { fragments } } });

    if (response.data.makePost) {
      // reset form, refresh options
      resetOptions();
    } else {
      // errored out, show error, keep options. keep form
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
      <StyledButtonsBox top={false}>
        <button type="submit" onClick={resetOptions}>
          Clear
        </button>
        <button type="submit" onClick={submit}>
          Submit
        </button>
      </StyledButtonsBox>
    </StyledResultAndControlsBox>
  );
};

function immutableShuffle<T>(arr: T[]): T[] {
  const newArray = arr.slice();
  return knuthShuffle(newArray);
}

const GET_NEW_POST_OPTIONS = gql`
  mutation {
    getNewPostOptions {
      book1Options {
        book {
          title
          author {
            name
          }
        }
        fragmentOptions {
          order
          fragment {
            id
            fragmentText
          }
        }
      }
      book2Options {
        book {
          title
          author {
            name
          }
        }
        fragmentOptions {
          order
          fragment {
            id
            fragmentText
          }
        }
      }
    }
  }
`;

const MAKE_POST = gql`
  mutation($data: PostInput!) {
    makePost(data: $data)
  }
`;

const initSelectedFragments: Fragment[] = [];
const initFragmentOptions: Fragment[] = [];
// const initBookInfo: { [key: string]: { id: string, title: string; author: string } } = {};

const initBookInfo: BookInfos | undefined = undefined;

const Container = styled.div`
  background-color: white;
  border: 1px #c4c4c4 solid;
  border-radius: 5px;
`;

const PostCreator = () => {
  const getNewPostOptions = useMutation(GET_NEW_POST_OPTIONS);
  const makePost = useMutation(MAKE_POST);

  const [orderedFragments, setFragments] = useState(initFragmentOptions);
  const [selectedFragments, setSelectedFragments] = useState(
    initSelectedFragments
  );
  const [bookInfo, setBookInfo] = useState<BookInfos | undefined>(initBookInfo);

  const getFragmentOptions = async () => {
    const options: PostOptions = (await getNewPostOptions()).data
      .getNewPostOptions;
    const { book1Options, book2Options } = options;

    const reformattedBook1Options: Fragment[] = book1Options.fragmentOptions.map(
      el => ({
        fragmentText: el.fragment.fragmentText,
        fragmentId: parseInt(el.fragment.id),
        bookId: parseInt(book1Options.book.id),
        whichBook: true
      })
    );

    const reformattedBook2Options: Fragment[] = book2Options.fragmentOptions.map(
      el => ({
        fragmentText: el.fragment.fragmentText,
        fragmentId: parseInt(el.fragment.id),
        bookId: parseInt(book2Options.book.id),
        whichBook: false
      })
    );

    // what if one of these two fail
    setFragments(
      knuthShuffle(reformattedBook1Options.concat(reformattedBook2Options))
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

  const addFragmentSelection = (fragment: Fragment) =>
    setSelectedFragments([...selectedFragments, fragment]);

  const removeFragmentSelection = (fragmentId: number) => {
    setSelectedFragments(
      selectedFragments.filter(el => el.fragmentId !== fragmentId)
    );
  };

  const resetOptions = () => setSelectedFragments([]);

  const shuffleFragments = () => {
    setFragments(immutableShuffle(orderedFragments));
  };

  return (
    <Container>
      <SelectionAndControlsBox
        removeFragmentSelection={removeFragmentSelection}
        selectedFragments={selectedFragments}
        resetOptions={resetOptions}
        makePost={makePost}
        bookInfo={bookInfo}
      />
      <OptionsBox
        getFragmentOptions={getFragmentOptions}
        shuffleFragments={shuffleFragments}
        addFragmentSelection={addFragmentSelection}
        orderedFragments={orderedFragments}
        selectedFragments={selectedFragments}
        bookInfo={bookInfo}
      />
    </Container>
  );
};

export default PostCreator;
