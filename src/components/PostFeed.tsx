import React, { createContext, useState } from 'react';
import { gql } from 'apollo-boost';
import styled from '@emotion/styled';
import { useQuery } from 'react-apollo-hooks';
import dayjs from 'dayjs';
import Post from './Post';
import { Post as IPost, PostsWithCursor } from '../../generated/graphql';
import { ExpandAndContractSpinner } from './Spinner';
import { DATE_FORMAT } from '../util/constants';

const LIMIT = 10;

const LoadMoreButton = styled.button`
  font-family: 'Domaine Text Regular';
  font-size: 14px;
  height: 35px;
  width: 180px;
  border-radius: 2px;
  background-color: white;
  border: 1px solid black;

  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 5px;
`;

const FeedAndButton = styled.div`
  grid-column-start: 1;
  grid-column-end: span 16;
`;

const StyledPostFeed = styled.div`
  background-color: white;

  border: 1px #c4c4c4 solid;
  border-radius: 5px;

  & > :first-of-type {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  & > :last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: none;
  }
`;

const GET_POSTS_WITH_CURSOR = gql`
  query($cursor: String, $limit: Int!) {
    getPostsWithCursor(cursor: $cursor, limit: $limit) {
      cursor
      posts {
        id
        created
        creator {
          id
        }
        portman {
          id
          name
        }
        book1 {
          id
          title
          author {
            name
          }
        }
        book2 {
          id
          title
          author {
            name
          }
        }
        usedFragments {
          order
          fragment {
            id
            context
            fragmentText
            book {
              id
            }
          }
        }
        likeCount
      }
    }
  }
`;

// figure out how to make these types better
export const ClosePopup = createContext({
  closePopup: null as any,
  setClosePopup: null as any
});

const PostFeed = () => {
  const [closePopup, setClosePopup] = useState({
    close: () => console.log('Initial')
  });

  const { data, error, loading, fetchMore } = useQuery(GET_POSTS_WITH_CURSOR, {
    variables: { limit: LIMIT, cursor: null }
  });

  const errorContent = <span>`Error! ${error}`</span>;

  let innerContent = null;
  let buttonStuff = null;

  if (loading) {
    innerContent = <ExpandAndContractSpinner dimension={100} />;
  } else if (error) {
    innerContent = errorContent;
  } else {
    const morePosts = () =>
      fetchMore({
        query: GET_POSTS_WITH_CURSOR,
        variables: { cursor: cursor as any, limit: LIMIT },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getPostsWithCursor;
          const newPosts = fetchMoreResult.getPostsWithCursor.posts;
          const newCursor = fetchMoreResult.getPostsWithCursor.cursor;

          return {
            getPostsWithCursor: {
              cursor: newCursor,
              posts: [...previousEntry.posts, ...newPosts],
              __typename: previousEntry.__typename
            }
          };
        }
      });

    buttonStuff = (
      <ButtonContainer>
        <LoadMoreButton type="submit" onClick={morePosts}>
          Load Older Posts
        </LoadMoreButton>
      </ButtonContainer>
    );
    const { posts, cursor }: PostsWithCursor = data.getPostsWithCursor;

    innerContent = (
      <ClosePopup.Provider value={{ closePopup, setClosePopup }}>
        {posts.map(post => {
          const fragments = post.usedFragments.map(f => ({
            bookId: f.fragment.book.id,
            fragmentId: f.fragment.id,
            fragmentText: f.fragment.fragmentText,
            context: f.fragment.context,
            order: f.order
          }));
          fragments.sort((a, b) => (a.order > b.order ? 1 : 0));

          const bookInfo = { book1Info: post.book1, book2Info: post.book2 };
          const date = dayjs(post.created).format(DATE_FORMAT);

          const initial1 = post.book1.author.name.split(' ').pop()![0];
          const initial2 = post.book2.author.name.split(' ').pop()![0];

          return (
            <Post
              date={date}
              initial1={initial1}
              initial2={initial2}
              portman={post.portman.name}
              fragments={fragments}
              likeCount={post.likeCount}
              bookInfo={bookInfo}
              key={post.id}
            />
          );
        })}
      </ClosePopup.Provider>
    );
  }

  return (
    <FeedAndButton>
      <StyledPostFeed>{innerContent}</StyledPostFeed>
      {buttonStuff}
    </FeedAndButton>
  );
};

export default PostFeed;
