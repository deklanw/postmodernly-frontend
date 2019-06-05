import React, { useState } from 'react';
import { styled } from 'linaria/react';
import { useApolloClient } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import HeartOpenBook from '../../assets/svg/HeartOpenBook';
import { useLikePostMutation, useMeQuery } from '../../generated/graphql';
import { TBooksInfo, TPostFragment, TClosePopup } from '../shared/types';
import PostFragment from './PostFragment';
import AuthorInfo from './AuthorInfo';

const PostContainer = styled.div`
  position: relative;
  display: flex;
  min-height: 175px;
  border-bottom: 1px #c4c4c4 solid;
  background-color: white;
  flex-direction: row;
  align-items: center;
`;

const AuthorHeader = styled.div`
  font-family: 'Spectral';
  font-weight: light;
  font-size: 13px;
  position: relative;
`;

const Dot = styled.span`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 13px;
`;

const FragmentContainer = styled.div`
  padding-top: 5px;
`;

const ContentContainer = styled.div`
  display: flex;
  height: 60%;
  width: 75%;
  padding: 40px 0px;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
`;

export const LikeContainer = styled.div<{
  liked: boolean;
  valid: boolean;
  onClick: any;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 45px;
  height: 40px;
  margin: 10px;
  position: absolute;
  bottom: 0;
  right: 5px;
  cursor: ${({ valid }) => (valid ? 'pointer' : 'auto')};
  fill: ${({ liked }) => (liked ? 'red' : 'black')};

  &:hover svg {
    fill: ${({ valid }) => (valid ? 'red' : 'black')};
  }
`;

const LikeCount = styled.span`
  font-size: 13px;
  font-family: 'Spectral';
  font-weight: light;
`;

const Circle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 1px solid #b5b5b5;
  flex-shrink: 0;
  margin: 0 30px;
  position: relative;
`;

const Letter1 = styled.span`
  font-size: 44px;
  font-family: 'Spectral';
  color: #676767;
  position: absolute;
  top: 13%;
  left: 27%;
`;

const Letter2 = styled.span`
  font-size: 39px;
  font-family: 'Spectral';
  color: #676767;
  position: absolute;
  top: 30%;
  left: 47%;
`;

const PortmanName = styled.span`
  cursor: pointer;
`;

interface PostProps {
  booksInfo: TBooksInfo;
  fragments: TPostFragment[];
  initial1: string;
  initial2: string;
  likeCount: number;
  portman: string;
  date: string;
  currentUserLiked: boolean;
  currentUserOwns: boolean;
  postId: string;
  closePopup: TClosePopup;
}

const Post: React.FC<PostProps> = ({
  booksInfo,
  fragments,
  initial1,
  initial2,
  likeCount,
  portman,
  currentUserLiked,
  currentUserOwns,
  date,
  postId,
  closePopup
}) => {
  const { book1Info, book2Info } = booksInfo;
  const dot = '·';
  const cacheId = `Post:${postId}`; // default naming

  const { data, error, loading } = useMeQuery();
  const client = useApolloClient();

  const loggedOut = !(data && data.me);
  const likePost = useLikePostMutation();

  const [authorInfoVisible, setAuthorInfoVisible] = useState(false);

  const displayPopup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    closePopup.current();
    closePopup.current = () => setAuthorInfoVisible(false);
    setAuthorInfoVisible(true);
  };

  const clickLike = async () => {
    if (!loggedOut && !currentUserOwns) {
      await likePost({
        variables: {
          data: {
            postId: parseInt(postId),
            like: !currentUserLiked
          }
        }
      });
      client.writeFragment({
        id: cacheId,
        fragment: gql`
          fragment LikeUpdateFragment on GetPostsWithCursor {
            currentUserLiked
            likeCount
          }
        `,
        data: {
          currentUserLiked: !currentUserLiked,
          likeCount: likeCount + (currentUserLiked ? -1 : 1),
          __typename: 'GetPostsWithCursor'
        }
        // variables: {
        //   cursor: null,
        //   limit: POSTS_FEED_LIMIT
        // }
      });
    } else {
      console.log('Cannot like post', loggedOut, currentUserOwns);
    }
  };

  return (
    <PostContainer>
      <Circle>
        <Letter1>{initial1}</Letter1>
        <Letter2>{initial2}</Letter2>
      </Circle>
      <ContentContainer>
        <AuthorInfo
          authorInfoVisible={authorInfoVisible}
          setAuthorInfoVisible={setAuthorInfoVisible}
          portman={portman}
          booksInfo={booksInfo}
        />
        <AuthorHeader>
          <PortmanName role="button" onClick={displayPopup}>
            {portman}{' '}
          </PortmanName>
          <Dot>{dot} </Dot>
          <span>{date} </span>
        </AuthorHeader>
        <FragmentContainer>
          {fragments.map(el => {
            const whichBook = el.bookId === book1Info.id;
            return (
              <PostFragment
                info={whichBook ? book1Info : book2Info}
                whichBook={whichBook}
                fragmentText={el.fragmentText}
                key={el.fragmentId}
                context={el.context}
                closePopup={closePopup}
              />
            );
          })}
        </FragmentContainer>
      </ContentContainer>
      <LikeContainer
        onClick={clickLike}
        liked={currentUserLiked}
        valid={!loggedOut}
      >
        <HeartOpenBook size="25px" />
        <LikeCount>{likeCount}</LikeCount>
      </LikeContainer>
    </PostContainer>
  );
};

export default Post;
