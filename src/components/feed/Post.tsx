import React, { useState, useContext } from 'react';
import { styled } from 'linaria/react';
import { useApolloClient } from 'react-apollo-hooks';
import gql from 'graphql-tag';

import { useLikePostMutation } from '../../generated/graphql';
import { TBooksInfo, TPostFragment, TClosePopup } from '../shared/types';
import PostFragment from './PostFragment';
import AuthorInfo from './AuthorInfo';
import { atMediaQ } from '../../util/style';
import { MediaQueryContext } from '../../App';
import Heart from '../../assets/svg/Heart';

const PostContainer = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px #c4c4c4 solid;
  background-color: white;
  flex-direction: row;
  align-items: center;

  ${atMediaQ.small} {
    line-height: 1.1;
  }
`;

const AuthorHeader = styled.div`
  font-weight: 300;
  font-size: 13px;

  ${atMediaQ.small} {
    font-size: 11px;
  }
  ${atMediaQ.medium} {
    font-size: 13px;
  }
  ${atMediaQ.large} {
    font-size: 13px;
  }
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
  flex-direction: column;
  justify-content: space-evenly;

  ${atMediaQ.small} {
    height: 60%;
    width: 85%;
    padding: 25px 0px;
    margin: 0 auto;
  }
  ${atMediaQ.medium} {
    height: 60%;
    width: 75%;
    padding: 40px 0px;
  }
  ${atMediaQ.large} {
    height: 60%;
    width: 75%;
    padding: 40px 0px;
  }
`;

export const LikeContainer = styled.div<{
  liked: boolean;
  valid: boolean;
  onClick: () => void;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  cursor: ${({ valid }) => (valid ? 'pointer' : 'auto')};
  fill: ${({ liked }) => (liked ? 'red' : 'black')};

  &:hover svg {
    fill: ${({ valid }) => (valid ? 'red' : 'black')};
  }

  & svg {
    fill: ${({ liked }) => (liked ? 'red' : 'black')};
    ${atMediaQ.small} {
      width: 15px;
    }
    ${atMediaQ.medium} {
      width: 20px;
    }
    ${atMediaQ.large} {
      width: 20px;
    }
  }

  ${atMediaQ.small} {
    margin: 5px;
    bottom: 0;
    right: 0px;
  }
  ${atMediaQ.medium} {
    margin: 10px;
    bottom: 0;
    right: 0px;
  }
  ${atMediaQ.large} {
    margin: 10px;
    bottom: 0;
    right: 0px;
  }
`;

const LikeCount = styled.span`
  font-size: 13px;
  font-weight: 300;
  margin-left: 5px;
`;

const Circle = styled.div`
  border-radius: 50%;
  border: 1px solid #b5b5b5;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  ${atMediaQ.medium} {
    width: 70px;
    height: 70px;
    margin: 0 20px;
  }
  ${atMediaQ.large} {
    width: 90px;
    height: 90px;
    margin: 0 30px;
  }
`;

const Letter1 = styled.span`
  font-size: 44px;
  color: #676767;
  position: relative;
  top: 3px;

  ${atMediaQ.small} {
    font-size: 30px;
  }
  ${atMediaQ.medium} {
    font-size: 44px;
  }
  ${atMediaQ.large} {
    font-size: 44px;
  }
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
  loggedOut: boolean;
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
  closePopup,
  loggedOut
}) => {
  const { isSmall } = useContext(MediaQueryContext);
  const { book1Info, book2Info } = booksInfo;
  const dot = '·';
  const cacheId = `Post:${postId}`; // default naming

  const client = useApolloClient();
  const likePost = useLikePostMutation();
  const [authorInfoVisible, setAuthorInfoVisible] = useState(false);

  const displayPopup = () => {
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
          fragment LikeUpdateFragment on Post {
            currentUserLiked
            likeCount
          }
        `,
        data: {
          currentUserLiked: !currentUserLiked,
          likeCount: likeCount + (currentUserLiked ? -1 : 1),
          __typename: 'Post'
        }
      });
    } else {
      // indicate inability to like?
    }
  };

  return (
    <PostContainer>
      {!isSmall && (
        <Circle>
          <Letter1>{initial1}</Letter1>
        </Circle>
      )}
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
        <Heart />
        <LikeCount>{likeCount}</LikeCount>
      </LikeContainer>
    </PostContainer>
  );
};

export default Post;
