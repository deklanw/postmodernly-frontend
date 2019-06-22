import React, { useState, useRef, useContext } from 'react';
import { hot } from 'react-hot-loader/root';
import { styled } from 'linaria/react';
import dayjs from 'dayjs';
import { useSubscription } from 'react-apollo-hooks';

import Post from './Post';
import {
  useGetPostsWithCursorQuery,
  useMeQuery
} from '../../generated/graphql';
import { ExpandAndContractSpinner } from '../shared/Spinner';
import { DATE_FORMAT, POSTS_FEED_LIMIT } from '../../util/constants';
import { GET_POSTS_WITH_CURSOR, NEW_POST_SUB } from '../../graphql/graphql';
import GenericError from '../shared/GenericError';
import { atMediaQ } from '../../util/style';
import { MediaQueryContext } from '../../App';
import PostCreator from '../creator/PostCreator';
import ArrowLeft from '../../assets/svg/arrow-left.svg';

const Container = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  ${atMediaQ.large} {
    margin-right: 20px;
  }
`;

const BottomFeedButton = styled.button`
  font-family: inherit;
  border-radius: 2px;
  background-color: white;
  border: 1px solid #5e5e5e;

  &:disabled {
    opacity: 0.5;
  }

  cursor: pointer;

  ${atMediaQ.small} {
    font-size: 12px;
    height: 30px;
    width: 150px;
  }
  ${atMediaQ.medium} {
    font-size: 14px;
    height: 35px;
    width: 180px;
  }
  ${atMediaQ.large} {
    font-size: 14px;
    height: 35px;
    width: 180px;
  }
`;

const BottomButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 15px;
`;

const StyledPostFeed = styled.div`
  background-color: white;

  border: 1px #c4c4c4 solid;
  width: 100%;

  ${atMediaQ.medium} {
    border-radius: 5px;
  }
  ${atMediaQ.large} {
    border-radius: 5px;
  }

  & > :first-of-type {
    ${atMediaQ.medium} {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    ${atMediaQ.large} {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
  }

  & > :last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom: none;
  }
`;

const TopButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;

const OpenPostCreatorButton = styled.button`
  font-family: inherit;
  font-weight: 400;

  border-radius: 2px;

  background-color: #515151;
  color: white;
  border: 1px solid black;

  margin-left: auto;

  &:disabled {
    opacity: 0.5;
  }

  cursor: pointer;

  ${atMediaQ.small} {
    font-size: 13px;
    height: 30px;
    width: 100%;
  }
  ${atMediaQ.medium} {
    font-size: 14px;
    height: 35px;
    width: 180px;
    margin-bottom: 5px;
  }
`;

const ArrowBackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  font-size: 15px;
`;

const GoBackArrow = styled.img`
  width: 15px;
  margin-right: 7px;
`;

const PostFeed: React.FC = () => {
  const closePopupRef = useRef<() => void>(() => null);
  const { isLarge } = useContext(MediaQueryContext);

  const [areMorePosts, setAreMorePosts] = useState(true);
  const [postCreatorOpen, setPostCreatorOpen] = useState(false);
  const togglePostCreator = () => setPostCreatorOpen(b => !b);

  const { data, error, loading, fetchMore } = useGetPostsWithCursorQuery({
    variables: {
      limit: POSTS_FEED_LIMIT,
      cursor: null
    },
    fetchPolicy: 'network-only' // when change page, don't keep paginated results in cache, just refetch on return to this route
  });

  const { data: meData, error: meError, loading: meLoading } = useMeQuery();
  const loggedOut = !(meData && meData.me);

  useSubscription(NEW_POST_SUB, {
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
  let lowerButtons = null;

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

    lowerButtons = (
      <BottomButtonContainer>
        <BottomFeedButton type="submit" onClick={() => window.scrollTo(0, 0)}>
          Go To Top
        </BottomFeedButton>
        <BottomFeedButton
          type="submit"
          onClick={morePosts}
          disabled={!areMorePosts}
        >
          Load Older Posts
        </BottomFeedButton>
      </BottomButtonContainer>
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
            loggedOut={loggedOut}
          />
        );
      }
    );
  }

  return (
    <Container>
      {postCreatorOpen && !isLarge ? (
        <>
          <ArrowBackContainer onClick={togglePostCreator}>
            <GoBackArrow alt="Go back arrow" src={ArrowLeft} />
            Back to Posts
          </ArrowBackContainer>
          <PostCreator alternativeOnSubmit={() => setPostCreatorOpen(false)} />
        </>
      ) : (
        <>
          {!isLarge && (
            <TopButtonContainer>
              <OpenPostCreatorButton onClick={togglePostCreator}>
                Craft a post
              </OpenPostCreatorButton>
            </TopButtonContainer>
          )}
          <StyledPostFeed>{innerContent}</StyledPostFeed>
          {lowerButtons}
        </>
      )}
    </Container>
  );
};

export default hot(PostFeed);
