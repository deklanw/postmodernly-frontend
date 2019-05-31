import React, { useState, useRef } from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import dayjs from 'dayjs';
import { useSubscription } from 'react-apollo-hooks';

import Post from './Post';
import { useGetPostsWithCursorQuery } from '../../generated/graphql';
import { ExpandAndContractSpinner } from '../shared/Spinner';
import { DATE_FORMAT, POSTS_FEED_LIMIT } from '../../util/constants';
import { GET_POSTS_WITH_CURSOR, NEW_POST_SUB } from '../../graphql/graphql';
import GenericError from '../shared/GenericError';

const LoadMoreButton = styled.button`
  font-family: 'Spectral';
  font-size: 14px;
  height: 35px;
  width: 180px;
  border-radius: 2px;
  background-color: white;
  border: 1px solid black;

  &:disabled {
    opacity: 0.5;
  }

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

const PostFeed = () => {
  const closePopupRef = useRef<() => void>(() => null);

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

  let innerContent = null;
  let buttonStuff = null;

  if (loading) {
    innerContent = <ExpandAndContractSpinner dimension={100} margin={200} />;
  } else if (error) {
    innerContent = <GenericError />;
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

    innerContent = posts.map(
      ({
        id,
        usedFragments,
        book1,
        book2,
        portman,
        created,
        likeCount,
        currentUserLiked,
        currentUserOwns
      }) => {
        const fragments = usedFragments.map(f => ({
          bookId: parseInt(f.fragment.book.id),
          fragmentId: parseInt(f.fragment.id),
          fragmentText: f.fragment.fragmentText,
          context: f.fragment.context,
          order: f.order
        }));
        fragments.sort((a, b) => a.order - b.order);

        const date = dayjs(created).format(DATE_FORMAT);

        let book1Info = book1;
        let book2Info = book2;
        let initial1 = book1.author.name.split(' ').pop()![0];
        let initial2 = book2.author.name.split(' ').pop()![0];

        // order the bookInfo and initials with the portman
        if (initial2.toLowerCase() === portman.name[0]) {
          [initial2, initial1] = [initial1, initial2];
          [book2Info, book1Info] = [book1Info, book2Info];
        }

        const booksInfo = {
          book1Info: {
            id: parseInt(book1Info.id),
            title: book1Info.title,
            author: book1Info.author.name
          },
          book2Info: {
            id: parseInt(book2Info.id),
            title: book2Info.title,
            author: book2Info.author.name
          }
        };

        return (
          <Post
            key={id}
            postId={id}
            date={date}
            initial1={initial1}
            initial2={initial2}
            portman={portman.name}
            fragments={fragments}
            likeCount={likeCount}
            booksInfo={booksInfo}
            currentUserLiked={currentUserLiked}
            currentUserOwns={currentUserOwns}
            closePopup={closePopupRef}
          />
        );
      }
    );
  }

  return (
    <FeedAndButton>
      <StyledPostFeed>{innerContent}</StyledPostFeed>
      {buttonStuff}
    </FeedAndButton>
  );
};

export default hot(PostFeed);
