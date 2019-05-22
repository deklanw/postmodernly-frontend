import React, { createContext, useState } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { useSubscription } from 'react-apollo-hooks';

import Post from './Post';
import { useGetPostsWithCursorQuery } from '../generated/graphql';
import { ExpandAndContractSpinner } from './Spinner';
import { DATE_FORMAT, POSTS_FEED_LIMIT } from '../util/constants';
import { GET_POSTS_WITH_CURSOR, NEW_POST_SUB } from '../graphql/graphql';

const LoadMoreButton = styled.button`
  font-family: 'Spectral Regular';
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
  margin-top: 10px;
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

// figure out how to make these types better
export const ClosePopup = createContext({
  closePopup: null as any,
  setClosePopup: null as any
});

const PostFeed = () => {
  const [closePopup, setClosePopup] = useState({
    close: () => console.log('Initial')
  });

  const [areMorePosts, setAreMorePosts] = useState(true);

  const { data, error, loading, fetchMore } = useGetPostsWithCursorQuery({
    variables: { limit: POSTS_FEED_LIMIT, cursor: null }
  });

  const {
    data: subData,
    error: subError,
    loading: subLoading
  } = useSubscription(NEW_POST_SUB, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      client.writeQuery({
        query: GET_POSTS_WITH_CURSOR,
        variables: { limit: POSTS_FEED_LIMIT, cursor: null },
        data: {
          getPostsWithCursor: {
            ...data!.getPostsWithCursor,
            posts: [
              subscriptionData.data.newPost,
              ...data!.getPostsWithCursor.posts
            ]
          }
        }
      });
    }
  });

  const errorContent = <span>{`Error! ${error}`}</span>;

  let innerContent = null;
  let buttonStuff = null;

  if (loading) {
    innerContent = <ExpandAndContractSpinner dimension={100} />;
  } else if (error) {
    innerContent = errorContent;
  } else if (data) {
    const { posts, cursor } = data.getPostsWithCursor;

    const morePosts = () =>
      fetchMore({
        query: GET_POSTS_WITH_CURSOR,
        variables: { cursor, limit: POSTS_FEED_LIMIT },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.getPostsWithCursor;
          const newPosts = fetchMoreResult!.getPostsWithCursor.posts;
          const newCursor = fetchMoreResult!.getPostsWithCursor.cursor;

          if (newPosts.length === 0) {
            setAreMorePosts(false);
          }

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
        <LoadMoreButton
          type="submit"
          onClick={morePosts}
          disabled={!areMorePosts}
        >
          Load Older Posts
        </LoadMoreButton>
      </ButtonContainer>
    );

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
          fragments.sort((a, b) => a.order - b.order);

          const bookInfo = { book1Info: post.book1, book2Info: post.book2 };
          const date = dayjs(post.created).format(DATE_FORMAT);

          let initial1 = post.book1.author.name.split(' ').pop()![0];
          let initial2 = post.book2.author.name.split(' ').pop()![0];

          if (initial2.toLowerCase() === post.portman.name[0]) {
            [initial2, initial1] = [initial1, initial2];
          }

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
